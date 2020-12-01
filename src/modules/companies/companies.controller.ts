import { CompaniesService } from './companies.service';
import { IndexCompanyDto } from './dto/indexCompnay.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';
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

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  index(@Query() indexCompanyDto: IndexCompanyDto) {
    return this.companiesService.findAll(indexCompanyDto);
  }

  @Post()
  create(@Body() body: any) {
    return this.companiesService.create(body);
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
    return this.companiesService.delete(id);
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
