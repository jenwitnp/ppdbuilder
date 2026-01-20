# Supabase Setup Instructions

## Storage Bucket Setup

You need to create a storage bucket in your Supabase project for image uploads.

### Steps:

1. Go to your Supabase Dashboard: https://nowwjfqmqmltukzgeiff.supabase.co

2. Navigate to **Storage** in the left sidebar

3. Click **"New bucket"**

4. Create a bucket with these settings:

   - **Name**: `images`
   - **Public bucket**: ✅ Check this (images need to be publicly accessible)
   - **File size limit**: 5MB (or your preference)
   - **Allowed MIME types**: `image/*` (or specify: image/jpeg, image/png, image/gif, image/webp)

5. Click **"Create bucket"**

### Folder Structure

The app will automatically create this structure:

```
images/
  └── slides/
      └── [uploaded images]
```

### Security Rules (Optional)

If you want to add upload restrictions, you can set policies:

1. Go to your bucket → **Policies**
2. Add policy for **INSERT**:

   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'images');
   ```

3. Public access is already enabled since it's a public bucket

## Database Table

Your `slides` table is already created. The schema matches:

```sql
- id (uuid, primary key)
- title (text, nullable)
- image_url (text, required)
- link_url (text, nullable)
- display_order (integer, default 0)
- is_active (boolean, default true)
- created_at (timestamp with time zone)
```

## Environment Variables

Already configured in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nowwjfqmqmltukzgeiff.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_z_bLVCnK9fLkjoA4fgaQAg_i6kiN7hk
SUPABASE_SERVICE_ROLE_KEY=sb_secret_vQHBJEPEwQQbG8rbOAksag_nsQRw5CZ
```

## Testing

After setup:

1. Restart your Next.js dev server: `npm run dev`
2. Login with `admin` / `admin123456`
3. Go to `/slides`
4. Try uploading an image!

## Features

✅ Upload images to Supabase Storage
✅ Create/Update/Delete slides
✅ Toggle active/inactive status
✅ Automatic image cleanup on delete
✅ Image preview before upload
✅ Drag & drop support
