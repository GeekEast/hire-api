import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Get()
  index() {
    return this.companiesService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.companiesService.create(body);
  }
}
