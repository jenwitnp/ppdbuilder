import sharp from "sharp";

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

export interface ProcessedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  size: number;
}

/**
 * Image processor using Sharp library
 */
export class ImageProcessor {
  /**
   * Resize and optimize image
   */
  static async resize(
    file: File,
    options: ImageResizeOptions = {}
  ): Promise<ProcessedImage> {
    const { width = 1920, height, quality = 90, format = "jpeg" } = options;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process image with Sharp
    let sharpInstance = sharp(buffer);

    // Resize
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert to format with quality
    if (format === "jpeg") {
      sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
    } else if (format === "png") {
      sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
    } else if (format === "webp") {
      sharpInstance = sharpInstance.webp({ quality });
    }

    // Execute processing
    const processedBuffer = await sharpInstance.toBuffer();
    const metadata = await sharp(processedBuffer).metadata();

    return {
      buffer: processedBuffer,
      format: metadata.format || format,
      width: metadata.width || width,
      height: metadata.height || 0,
      size: processedBuffer.length,
    };
  }

  /**
   * Generate multiple sizes from one image
   */
  static async resizeMultiple(
    file: File,
    sizes: { name: string; width: number; quality?: number }[]
  ): Promise<Record<string, ProcessedImage>> {
    const results: Record<string, ProcessedImage> = {};

    for (const size of sizes) {
      results[size.name] = await this.resize(file, {
        width: size.width,
        quality: size.quality || 90,
      });
    }

    return results;
  }

  /**
   * Convert File to Buffer
   */
  static async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Convert Buffer to File
   */
  static bufferToFile(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): File {
    // Convert Buffer to Uint8Array to satisfy TypeScript's BlobPart type
    return new File([new Uint8Array(buffer)], filename, { type: mimeType });
  }
}

/**
 * Preset configurations for different use cases
 */
export const ImagePresets = {
  // For slides (large hero images)
  slide: {
    large: { width: 1920, quality: 90 },
    medium: { width: 1280, quality: 85 },
    thumbnail: { width: 640, quality: 80 },
  },

  // For album images
  album: {
    large: { width: 1600, quality: 90 },
    medium: { width: 800, quality: 85 },
    thumbnail: { width: 400, quality: 80 },
  },

  // For article featured images
  article: {
    large: { width: 1200, quality: 90 },
    medium: { width: 800, quality: 85 },
    thumbnail: { width: 400, quality: 80 },
  },

  // For article content images
  articleContent: {
    large: { width: 1000, quality: 85 },
  },

  // For company logos
  logo: {
    large: { width: 800, quality: 95 },
    medium: { width: 400, quality: 95 },
  },
};
