import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { SkipJwt } from 'modules/auth/decorators/skipJwt.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipJwt()
  index(): string {
    return 'Welcome to the Hire API.';
  }
}
