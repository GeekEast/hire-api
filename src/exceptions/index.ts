import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAccountExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'User account already exist.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AccountPasswordNotMatchConfirmException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: `Password doesn't match confirm.`,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
