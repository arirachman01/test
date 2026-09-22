import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export function multerStorage(destinationFolder: string) {
  const fullPath = `./uploads/${destinationFolder}`;
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
  }

  return diskStorage({
    destination: fullPath,
    filename: (req, file, callback) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  });
}

export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return callback(
      new BadRequestException(
        'Hanya file gambar (jpg, jpeg, png, webp) yang diizinkan',
      ),
      false,
    );
  }
  callback(null, true);
};

export const resultFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
    return callback(
      new BadRequestException(
        'Hanya file gambar (jpg, jpeg, png, webp) atau gif yang diizinkan',
      ),
      false,
    );
  }
  callback(null, true);
};

export function buildFileUrl(destinationFolder: string, filename: string) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads/${destinationFolder}/${filename}`;
}
