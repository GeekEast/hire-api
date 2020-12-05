import { AppController } from './app.controller';

import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Welcome to the Hire API."', () => {
      expect(appController.index()).toBe('Welcome to the Hire API.');
    });
  });
});
