import { IsNumber, IsOptional } from 'class-validator';
export class IndexCompanyDto {
  @IsNumber()
  @IsOptional()
  skip?: number;
  @IsNumber()
  @IsOptional()
  limit?: number;
}
