import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { existsSync } from 'fs';
import { unlink } from 'fs/promises';

import { FrameTemplate } from './entities/frame-template.entity.js';
import { CreateFrameTemplateDto } from './dto/create-frame-template.dto';
import { UpdateFrameTemplateDto } from './dto/update-frame-template.dto';
import { buildFileUrl } from '../utils/file-upload.util.js';

const FOLDER = 'frames';

@Injectable()
export class FrameTemplatesService {
  constructor(
    @InjectRepository(FrameTemplate)
    private readonly frameTemplateRepository: Repository<FrameTemplate>,
  ) {}

  async create(
    file: Express.Multer.File,
    dto: CreateFrameTemplateDto,
  ) {
    const url = buildFileUrl(FOLDER, file.filename);

    const frame = this.frameTemplateRepository.create({
      name: dto.name,
      category: dto.category,
      filename: file.filename,
      url,
      isActive: dto.isActive ?? true,
      settingid: null,
    });

    return this.frameTemplateRepository.save(frame);
  }

  async findAll() {
    return this.frameTemplateRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findActive(category?: string) {
    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    return this.frameTemplateRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const frame = await this.frameTemplateRepository.findOne({
      where: { id },
    });

    if (!frame) {
      throw new NotFoundException(
        `Frame template dengan id ${id} tidak ditemukan`,
      );
    }

    return frame;
  }

  async update(id: number, dto: UpdateFrameTemplateDto) {
    await this.findOne(id);

    await this.frameTemplateRepository.update(
      { id },
      dto,
    );

    return this.findOne(id);
  }

  async remove(id: number) {
    const frame = await this.findOne(id);

    const filePath = `./uploads/${FOLDER}/${frame.filename}`;

    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    await this.frameTemplateRepository.delete({ id });

    return {
      message: 'Frame template berhasil dihapus',
    };
  }
}