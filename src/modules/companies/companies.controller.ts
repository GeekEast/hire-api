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

  @Post('/:company_id/users/:user_id')
  addUserToCompany(
    @Param('company_id') companyId: string,
    @Param('user_id') userId: string,
  ) {
    return this.companiesService.addUserToCompany({
      companyId,
      user: userId as any,
    });
  }

  @Delete('/:company_id/users/:user_id')
  removeUserFromCompany(
    @Param('company_id') companyId: string,
    @Param('user_id') user: string,
  ) {
    return this.companiesService.removeUserFromCompany({
      companyId,
      user,
    });
  }
}
