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
import { CreateCoffeeDto } from './dto/create-coffee.dto';

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
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffesService.create(createCoffeeDto);
  }

  @Delete('/:id')
  remove(@Param() params) {
    this.coffesService.remove(params.id);
    return `The Coffee #${params.id} is removed`;
  }

  @Patch('/:id')
  partial_update(@Param() params, @Body() body) {
    this.coffesService.update(params.id, body);
    return `The Coffee #${params.id} is updated`;
  }

  @Put('/:id')
  update(@Param() params, @Body() body) {
    this.coffesService.update(params.id, body);
    return `The Coffee #${params.id} is updated`;
  }
}
