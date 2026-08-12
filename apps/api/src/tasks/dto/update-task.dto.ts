import { IsIn, IsOptional, IsString } from 'class-validator';
import type { TaskStatus } from '@techchallenge/shared-types';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsIn(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  assignee?: string | null;
}
