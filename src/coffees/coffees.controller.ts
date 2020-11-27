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
  show(@Param('id') id: number) {
    return this.coffesService.show(id);
  }

  @Post('/')
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    // createCoffeeDto is only shape of CreateeCoffeeDto, but not instance
    return this.coffesService.create(createCoffeeDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    this.coffesService.remove(id);
    return `The Coffee #${id} is removed`;
  }

  @Patch('/:id')
  partial_update(@Param('id') id: number, @Body() body) {
    this.coffesService.update(id, body);
    return `The Coffee #${id} is updated`;
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() body) {
    this.coffesService.update(id, body);
    return `The Coffee #${id} is updated`;
  }
}
