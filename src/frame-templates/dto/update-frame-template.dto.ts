import { PartialType } from '@nestjs/swagger';
import { CreateFrameTemplateDto } from './create-frame-template.dto';

export class UpdateFrameTemplateDto extends PartialType(
  CreateFrameTemplateDto,
) {}
