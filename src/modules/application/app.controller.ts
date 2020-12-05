import { Controller, Get } from '@nestjs/common';
import { SkipJwt } from 'modules/auth/decorators/skipJwt.decorator';

@Controller()
export class AppController {
  @Get()
  @SkipJwt()
  index(): string {
    return 'Welcome to the Hire API.';
  }
}
