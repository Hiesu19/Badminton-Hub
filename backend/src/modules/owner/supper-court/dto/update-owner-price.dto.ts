import { PartialType } from '@nestjs/swagger';
import { CreateOwnerPriceDto } from './create-owner-price.dto';

export class UpdateOwnerPriceDto extends PartialType(CreateOwnerPriceDto) {}
