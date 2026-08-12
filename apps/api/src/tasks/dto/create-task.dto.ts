import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { TaskStatus } from '@techchallenge/shared-types';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  workspaceId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

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
