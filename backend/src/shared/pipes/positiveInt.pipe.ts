import {
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
    transform(value: string) {
        const val = parseInt(value, 10);

        if (isNaN(val) || val <= 0) {
            throw new BadRequestException(`${value} phải là số nguyên dương`);
        }

        return val;
    }
}
