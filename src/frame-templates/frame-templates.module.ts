import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FrameTemplatesService } from './frame-templates.service.js';
import { FrameTemplate } from './entities/frame-template.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([FrameTemplate]),
  ],
  providers: [FrameTemplatesService],
  exports: [FrameTemplatesService],
})
export class FrameTemplatesModule {}