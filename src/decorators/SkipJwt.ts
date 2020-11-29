import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_KEY = 'skipAuth';
export const SkipJwt = () => SetMetadata(SKIP_JWT_KEY, true);
