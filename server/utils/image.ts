import sharp from 'sharp';
import path from 'path';
import { UploadedFile } from 'express-fileupload';

export async function compressAndSaveImage(
  image: UploadedFile,
  outputPath: string,
  options: {
    quality?: number;
    maxWidth?: number;
  } = {}
): Promise<void> {
  const { quality = 80, maxWidth = 1200 } = options;
  
  // Create Sharp instance
  let sharpInstance = sharp(image.tempFilePath)
    .rotate() // Auto-rotate based on EXIF data
    .resize({
      width: maxWidth,
      height: undefined, // Maintain aspect ratio
      withoutEnlargement: true, // Don't enlarge if image is smaller
      fit: 'inside'
    });

  // Determine output format based on original file
  const ext = path.extname(image.name).toLowerCase();
  
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
      break;
    case '.png':
      sharpInstance = sharpInstance.png({ quality, compressionLevel: 9 });
      break;
    case '.webp':
      sharpInstance = sharpInstance.webp({ quality });
      break;
    default:
      // Convert other formats to JPEG
      sharpInstance = sharpInstance.jpeg({ quality, mozjpeg: true });
  }

  // Save the processed image
  await sharpInstance.toFile(outputPath);
}
