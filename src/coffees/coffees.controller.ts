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
import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  // this is dependency injection.
  constructor(private readonly coffesService: CoffeesService) {}

  @Get('/')
  index(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return this.coffesService.index(parseInt(limit), parseInt(offset));
  }

  @Get('/:id')
  show(@Param() params) {
    return this.coffesService.show(params.id);
  }

  @Post('/')
  create(@Body() body) {
    this.coffesService.create(body);
    return `${JSON.stringify(body)} has been created as a coffee.`;
  }

  @Delete('/:id')
  remove(@Param() params) {
    this.coffesService.remove(params.id);
    return `The Coffee #${params.id} is removed`;
  }

  @Patch('/:id')
  partial_update(@Param() params, @Body() body) {
    this.coffesService.partial_update(params.id, body);
    return `The Coffee #${params.id} is updated`;
  }

  @Put('/:id')
  update(@Param() params, @Body() body) {
    this.coffesService.update(params.id, body);
    return `The Coffee #${params.id} is updated`;
  }
}
