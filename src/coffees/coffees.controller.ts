import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get('/')
  index() {
    return 'all coffees';
  }

  @Get('/:id')
  show(@Param() params) {
    return `The Coffee #${params.id}`;
  }

  @Post('/')
  create(@Body() body) {
    return `${JSON.stringify(body)} has been created as a coffee.`;
  }

  @Delete('/:id')
  remove(@Param() params) {
    return `The Coffee #${params.id} is removed`;
  }

  @Patch('/:id')
  partial_update(@Param() params, @Body() body) {
    return `The Coffee #${params.id} is updated`;
  }

  @Put('/:id')
  update(@Param() params, @Body() body) {
    return `The Coffee #${params.id} is updated`;
  }
}
