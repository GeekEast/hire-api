import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidObjectIdException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'Invalid Object Id.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class CompanyExistException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'Company already exist by this name.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
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

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: `User account doesn't exist`,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

export class AccountPasswordNotMatchException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: `username and password doesn't match.`,
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
