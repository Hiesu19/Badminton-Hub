import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateSupperCourtDto } from './create-supper-court.dto';
import { SupperCourtStatus } from 'src/shared/enums/supper-court.enum';

export class UpdateSupperCourtDto extends PartialType(CreateSupperCourtDto) {
  @ApiPropertyOptional({ enum: SupperCourtStatus })
  @IsOptional()
  @IsEnum(SupperCourtStatus)
  status?: SupperCourtStatus;
}
