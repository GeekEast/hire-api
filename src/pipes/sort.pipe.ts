import { isNil } from 'lodash';
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseSortPipe implements PipeTransform {
  transform(value: string) {
    // TODO: Need Regular Expression to valid the input format
    if (!isNil(value) && typeof value === 'string' && value !== '') {
      const options = value.split(',');
      const result = {} as Record<string, string>;
      options.map((option: string) => {
        const [name, order] = option.split(':');
        result[name] = order ?? 'asc';
      });
      return result;
    }
    return {};
  }
}
