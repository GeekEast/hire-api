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
import { ParseSortPipe } from 'pipes/sort.pipe';
import { CompanySortDto } from './dto/sort.dto';
import { UserSortDto } from 'modules/users/dto/sort.dto';
import { VacanciesSortDto } from 'modules/vacancies/dto/sort.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  index(
    @Query() indexCompanyDto: IndexCompanyDto,
    @Query('sort', ParseSortPipe) sort: CompanySortDto,
  ) {
    return this.companiesService.findAll({ ...indexCompanyDto, sort });
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
  showUsers(
    @Param('id') id: string,
    @Query() showCompanyUsersDto: ShowCompanyUserDto,
    @Query('sort', ParseSortPipe) sort: UserSortDto,
  ) {
    return this.companiesService.findUsersById(id, {
      ...showCompanyUsersDto,
      sort,
    });
  }

  @Get('/:id/vacancies')
  showVacancies(
    @Param('id') id: string,
    @Query() showCompanyVacancies: ShowCompanyVacancies,
    @Query('sort', ParseSortPipe) sort: VacanciesSortDto,
  ) {
    return this.companiesService.findVacanciesById(id, {
      ...showCompanyVacancies,
      sort,
    });
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
