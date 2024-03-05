import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateCronJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  triggerLink: string;

  @IsString()
  apiKey?: string;

  @IsString()
  @IsNotEmpty()
  schedule: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;
}

export class UpdateCronJobDto {
  @IsString()
  @IsOptional()
  name?: string;
  
  @IsUrl()
  @IsOptional()
   triggerLink?: string;
  
  @IsString()
  @IsOptional()
  apiKey?: string;
  
  @IsString()
  @IsOptional()
  schedule?: string;
  
  @IsString()
  @IsOptional()
  startDate?: string;
}