import { uploadFileToCloudinary } from '@/app/actions/uploadActions';
import { addToast } from '@heroui/toast';

/**
 * File types supported by the upload utils
 */
export type FileType = 'image' | 'pdf' | 'any';

/**
 * Validates if a file is of the expected type
 */
function validateFileType(file: File, type: FileType): boolean {
  if (type === 'any') return true;

  if (type === 'image') {
    return file.type.startsWith('image/');
  }

  if (type === 'pdf') {
    return file.type === 'application/pdf';
  }

  return false;
}

/**
 * Uploads a single file to Cloudinary
 *
 * @param file - The file to upload
 * @param folder - The Cloudinary folder to upload to
 * @param path - The path to revalidate after upload (optional)
 * @param type - The expected file type (image, pdf, or any)
 * @returns A promise that resolves to the uploaded file URL
 */
export async function uploadFile(
  file: File,
  folder: string,
  path?: string,
  type: FileType = 'any'
): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!validateFileType(file, type)) {
    throw new Error(`Invalid file type. Expected ${type}, got ${file.type}`);
  }

  addToast({
    title: 'Uploading file...',
    description: `Uploading file. Please wait.`,
    timeout: 1200,
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  if (path) formData.append('path', path);

  const result = await uploadFileToCloudinary(formData);

  if (!result.success || !result.url) {
    const errorMsg = result.error || `Failed to upload ${file.name}`;
    addToast({
      title: 'Upload Failed',
      description: errorMsg,
      color: 'danger',
    });
    throw new Error(errorMsg);
  }

  // addToast({
  //   title: 'Upload Complete',
  //   description: 'File uploaded successfully.',
  //   color: 'success',
  // });

  return result.url;
}

/**
 * Uploads multiple files of the specified type to Cloudinary
 *
 * @param files - Array of files to upload
 * @param folder - The Cloudinary folder to upload to
 * @param path - The path to revalidate after upload (optional)
 * @param type - The expected file type (image, pdf, or any)
 * @returns A promise that resolves to an array of uploaded file URLs
 */
export async function uploadFiles(
  files: File[],
  folder: string,
  path?: string,
  type: FileType = 'any'
): Promise<string[]> {
  if (!files || files.length === 0) {
    return []; // Return empty array if no files
  }

  // Filter for valid file objects and correct file types
  const validFiles = files.filter(
    (f) => f instanceof File && validateFileType(f, type)
  );

  if (validFiles.length === 0) {
    addToast({
      title: 'No Valid Files',
      description: `None of the files match the expected ${type} type.`,
      color: 'danger',
    });
    return [];
  }

  if (validFiles.length !== files.length) {
    addToast({
      title: 'Some Files Skipped',
      description: `${files.length - validFiles.length} files were skipped due to invalid type.`,
      color: 'danger',
    });
  }

  addToast({
    title: 'Uploading files...',
    description: `Uploading ${validFiles.length} file(s). Please wait.`,
  });

  const uploadPromises = validFiles.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (path) formData.append('path', path);

    const result = await uploadFileToCloudinary(formData);

    if (!result.success || !result.url) {
      throw new Error(result.error || `Failed to upload ${file.name}`);
    }
    return result.url;
  });

  try {
    // Wait for all uploads to complete
    const uploadedUrls = await Promise.all(uploadPromises);
    addToast({
      title: 'Uploads complete!',
      description: `${uploadedUrls.length} file(s) uploaded successfully.`,
    });
    return uploadedUrls;
  } catch (error) {
    console.error('Error during file uploads:', error);
    addToast({
      title: 'Upload Failed',
      description:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during upload.',
      color: 'danger',
    });
    throw error;
  }
}

/**
 * Uploads multiple PDF files to Cloudinary
 */
export async function uploadPdfs(
  files: File[],
  folder: string,
  path?: string
): Promise<string[]> {
  return uploadFiles(files, folder, path, 'pdf');
}

/**
 * Uploads multiple image files to Cloudinary
 */
export async function uploadImages(
  files: File[],
  folder: string,
  path?: string
): Promise<string[]> {
  return uploadFiles(files, folder, path, 'image');
}

/**
 * Uploads a single PDF file to Cloudinary
 */
export async function uploadPdf(
  file: File,
  folder: string,
  path?: string
): Promise<string> {
  return uploadFile(file, folder, path, 'pdf');
}

/**
 * Uploads a single image file to Cloudinary
 */
export async function uploadImage(
  file: File,
  folder: string,
  path?: string
): Promise<string> {
  return uploadFile(file, folder, path, 'image');
}
