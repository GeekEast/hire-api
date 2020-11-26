import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body) {
    return `${JSON.stringify(body)} has been created as a coffee.`;
  }
}
