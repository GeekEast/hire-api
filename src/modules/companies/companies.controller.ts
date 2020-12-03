import { ShowCompanyVacancies } from './dto/vacancies';
import { CompaniesService } from './companies.service';
import { IndexCompanyDto } from './dto/list.dto';
import { UpdateCompanyDto } from './dto/update.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create.dto';
import { ShowCompanyUserDto } from './dto/users';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  index(@Query() indexCompanyDto: IndexCompanyDto) {
    return this.companiesService.findAll(indexCompanyDto);
  }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('/:id')
  show(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Get('/:id/users')
  showUser(
    @Param('id') id: string,
    @Query() showCompanyUsersDto: ShowCompanyUserDto,
  ) {
    return this.companiesService.findUsersById(id, showCompanyUsersDto);
  }

  @Get('/:id/vacancies')
  showVacancy(
    @Param('id') id: string,
    @Query() showCompanyVacancies: ShowCompanyVacancies,
  ) {
    return this.companiesService.findVacanciesById(id, showCompanyVacancies);
  }

  @Patch('/:id')
  partial_update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
