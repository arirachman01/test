import {
  Controller,
  Get,
  Param,
  Body,
  Query,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FrameTemplatesService } from './frame-templates.service';
import { CreateFrameTemplateDto } from './dto/create-frame-template.dto';
import { imageFileFilter, multerStorage } from '../utils/file-upload.util.js';
import { UpdateFrameTemplateDto } from './dto/update-frame-template.dto';

@ApiBearerAuth('JWT')
@Controller('frame-templates')
export class FrameTemplatesController {
  constructor(private readonly service: FrameTemplatesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        name: { type: 'string', example: 'Frame Lucu Wisuda' },
        category: { type: 'string', example: 'wisuda' },
        isActive: { type: 'boolean', example: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage('frames'),
      fileFilter: imageFileFilter,
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateFrameTemplateDto,
  ) {
    return this.service.create(file, dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('active')
  findActive(@Query('category') category?: string) {
    return this.service.findActive(category);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFrameTemplateDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
