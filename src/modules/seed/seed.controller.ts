import { Controller, Get } from '@nestjs/common';
import { SkipJwt } from 'modules/auth/decorators/skipJwt.decorator';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Get()
  @SkipJwt()
  async seed() {
    await this.seedService.seed();
  }
}
