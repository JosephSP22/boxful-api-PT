import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsEmail,
  Min,
} from 'class-validator';

export class RecipientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  municipality: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class PackageDto {
  @IsNumber()
  @Min(0)
  length: number;

  @IsNumber()
  @Min(0)
  height: number;

  @IsNumber()
  @Min(0)
  width: number;

  @IsNumber()
  @Min(0)
  weight: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledDate: Date;

  @ValidateNested()
  @Type(() => RecipientDto)
  recipient: RecipientDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsBoolean()
  @IsOptional()
  isCOD?: boolean;

  @IsNumber()
  @IsOptional()
  expectedAmount?: number;
}
