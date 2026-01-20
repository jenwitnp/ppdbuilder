"use client";

import Image from "next/image";

/**
 * SmartImage Component
 *
 * Intelligently handles image optimization based on source and environment
 * - Disables optimization for external domains in production to avoid Vercel quota limits
 * - Keeps optimization for local/same-domain images
 * - Provides fallback for problematic image sources
 */
export default function SmartImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "empty",
  onError,
  ...props
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "empty" | "blur";
  onError?: (e: any) => void;
  [key: string]: any;
}) {
  // Check if we're in production and if it's an external image
  const isProduction = process.env.NODE_ENV === "production";
  const isExternalImage =
    src &&
    (src.includes("supabase") ||
      src.includes("uploads/") ||
      src.startsWith("http"));

  // Also check for local static images that might hit optimization limits
  const isLocalStaticImage = src && src.startsWith("/images/");

  // Disable optimization for external images in production to avoid 402 errors
  // Also disable for local static images if unoptimized prop is explicitly set
  const shouldDisableOptimization =
    (isProduction && isExternalImage) ||
    props.unoptimized ||
    (isProduction && isLocalStaticImage);

  // Handle image loading errors
  const handleImageError = (e: any) => {
    // Only log in development mode to prevent console spam
    if (process.env.NODE_ENV === "development") {
      console.warn("Image failed to load:", src);
    }

    // Call parent error handler (which may set fallback image)
    if (onError) {
      onError(e);
    }
  };

  // If we need to disable optimization, use unoptimized prop
  if (shouldDisableOptimization) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width || 500}
        height={height || 500}
        className={className}
        priority={priority}
        placeholder={placeholder}
        unoptimized={true}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    );
  }

  // Use standard optimized image for local/same-domain images
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 500}
      height={height || 500}
      className={className}
      priority={priority}
      placeholder={placeholder}
      onError={handleImageError}
      loading={priority ? "eager" : "lazy"}
      {...props}
    />
  );
}
