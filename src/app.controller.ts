import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as process from 'process';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return {
      data: {
        title: 'Chat App',
        message: 'Hello world!',
      },
    };
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
