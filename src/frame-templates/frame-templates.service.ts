import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';
import { PrismaService } from '../prisma.service.js';
import { CreateFrameTemplateDto } from './dto/create-frame-template.dto';
import { buildFileUrl } from '../utils/file-upload.util.js';
import { UpdateFrameTemplateDto } from './dto/update-frame-template.dto';

const FOLDER = 'frames';

@Injectable()
export class FrameTemplatesService {
  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File, dto: CreateFrameTemplateDto) {
    const url = buildFileUrl(FOLDER, file.filename);

    return this.prisma.frameTemplate.create({
      data: {
        name: dto.name,
        category: dto.category,
        filename: file.filename,
        url,
        isActive: dto.isActive ?? true,
        settingid: null,
      },
    });
  }

  async findAll() {
    return await this.prisma.frameTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive(category?: string) {
    return await this.prisma.frameTemplate.findMany({
      where: { isActive: true, ...(category ? { category } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const frame = await this.prisma.frameTemplate.findUnique({ where: { id } });
    if (!frame) {
      throw new NotFoundException(
        `Frame template dengan id ${id} tidak ditemukan`,
      );
    }
    return frame;
  }

  async update(id: number, dto: UpdateFrameTemplateDto) {
    await this.findOne(id);
    return this.prisma.frameTemplate.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const frame = await this.findOne(id);
    const filePath = `./uploads/${FOLDER}/${frame.filename}`;
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
    return this.prisma.frameTemplate.delete({ where: { id } });
  }
}
