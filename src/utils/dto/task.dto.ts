import { IsString, IsOptional, IsArray, IsDateString, IsEnum } from 'class-validator';
import { Status } from '../constance/constance.status';
import { Priority } from '../constance/constance.priority';

export class CreateChecklistItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsString()
  @IsDateString()
  startDate?: string;

  @IsString()
  @IsDateString()
  endDate?: string;

}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsDateString()
  startDate?: string;

  @IsString()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsString()
  @IsOptional()
  createdBy: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsArray()
  @IsOptional()
  checklist: CreateChecklistItemDto[];

  @IsString()
  columnId: string;
}