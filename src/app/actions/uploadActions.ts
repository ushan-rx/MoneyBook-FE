'use server';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Ensure HTTPS URLs are returned
});

/**
 * Uploads an image to Cloudinary using the provided `FormData`.
 *
 * @param formData - The `FormData` object containing the file and optional metadata.
 *   - `file`: The image file to be uploaded (required).
 *   - `folder`: The folder in Cloudinary where the image will be stored (optional).
 *   - `path`: The path to revalidate after the upload (optional).
 *
 * @returns A promise that resolves to an object containing:
 *   - `success`: A boolean indicating whether the upload was successful.
 *   - `url` (optional): The URL of the uploaded image if the upload was successful.
 *   - `error` (optional): An error message if the upload failed.
 *
 * @throws Will throw an error if the upload fails without an error object.
 *
 * @example
 * ```typescript
 * const formData = new FormData();
 * formData.append('file', fileInput.files[0]);
 * formData.append('folder', 'user_uploads');
 * formData.append('path', '/gallery');
 *
 * const result = await uploadImageToCloudinary(formData);
 * if (result.success) {
 *   console.log('Image URL:', result.url);
 * } else {
 *   console.error('Upload failed:', result.error);
 * }
 * ```
 */
export async function uploadFileToCloudinary(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('file') as File | null;
  const folder = formData.get('folder') as string | null;
  const path = formData.get('path') as string | null;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Use upload_stream to upload the buffer
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              // Optional: Add upload presets, tags, folders, etc.
              folder: folder || 'default_folder',
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary Upload Error:', error);
                reject(error);
              } else if (result) {
                resolve(result);
              } else {
                reject(
                  new Error('Cloudinary upload failed without error object.')
                );
              }
            }
          )
          .end(buffer);
      }
    );

    console.log('Cloudinary Upload Success:', uploadResult.secure_url);
    // Optionally revalidate paths if needed after upload (refresh)
    if (path) {
      revalidatePath(path);
    }
    return { success: true, url: uploadResult.secure_url };
  } catch (error: any) {
    console.error('Failed to upload image to Cloudinary:', error);
    return { success: false, error: error.message || 'Upload failed.' };
  }
}
