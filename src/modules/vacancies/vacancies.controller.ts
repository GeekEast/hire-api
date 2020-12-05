import { VacanciesSortDto } from './dto/sort.dto';
import { CreateVacancyDto } from './dto/create.dto';
import { ListVacancyPaginationDto } from './dto/list.dto';
import { Role } from 'modules/auth/decorators/roles.decorator';
import { RoleEnum } from 'modules/auth/enums/role.enum';
import { RolesGuard } from 'modules/auth/guards/roles.guard';
import { UpdateVacancyDto } from './dto/update.dto';
import { VacanciesService } from 'modules/vacancies/vacancies.service';
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
  UseGuards,
} from '@nestjs/common';
import { ParseSortPipe } from 'pipes/sort.pipe';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get('')
  index(
    @Query() listVacancyPagination: ListVacancyPaginationDto,
    @Query('sort', ParseSortPipe) sort: VacanciesSortDto,
  ) {
    return this.vacanciesService.findAll({ ...listVacancyPagination, sort });
  }

  @Get('/:id')
  show(@Param('id') id: string) {
    return this.vacanciesService.findById(id);
  }

  @Post('')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Put('/:id')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Patch('/:id')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  partial_update(
    @Param('id') id: string,
    @Body() updateVacancyDto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Delete('/:id')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }

  @Get('/:id/company')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  find_company(@Param('id') id: string) {
    return this.vacanciesService.findCompany(id);
  }

  @Delete('/:id/company')
  @Role(RoleEnum.Admin)
  @UseGuards(RolesGuard)
  remove_company(@Param('id') id: string) {
    return this.vacanciesService.removeCompany(id);
  }
}
