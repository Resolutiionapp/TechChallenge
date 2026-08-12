import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [WorkspacesModule, TasksModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
