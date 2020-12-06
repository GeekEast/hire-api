import { Controller, Get } from '@nestjs/common';
import { SkipJwt } from 'modules/auth/decorators/skipJwt.decorator';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Get()
  @SkipJwt()
  hello() {
    this.seedService.seed();
  }
}
