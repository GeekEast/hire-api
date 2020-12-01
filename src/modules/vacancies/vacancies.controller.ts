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
} from '@nestjs/common';
import { ListVacancyPaginationDto } from './dto/list.dto';
import { CreateVacancyDto } from './dto/create.dto';

@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get('')
  index(@Query() listVacancyPagination: ListVacancyPaginationDto) {
    return this.vacanciesService.findAll(listVacancyPagination);
  }

  @Get('/:id')
  show(@Param('id') id: string) {
    return this.vacanciesService.findById(id);
  }

  @Post('')
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Patch('/:id')
  partial_update(
    @Param('id') id: string,
    @Body() updateVacancyDto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Delete('/:id')
  remove(@Param() id: string) {
    return this.vacanciesService.remove(id);
  }
}
