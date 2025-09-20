import { IsString, IsOptional,  } from 'class-validator';

export class UpdateChecklistItemDto {
  @IsOptional()
  @IsString()
  assignedTo?: string;
  
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}