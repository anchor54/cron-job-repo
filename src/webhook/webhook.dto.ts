import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateWebHookDto {
  body: any;
}