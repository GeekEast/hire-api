import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { SkipJwt } from 'decorators/SkipJwt';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipJwt()
  getHello(): string {
    return 'Welcome to the Hire API.';
  }
}
