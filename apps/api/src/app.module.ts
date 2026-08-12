import { Module } from '@nestjs/common';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [WorkspacesModule, TasksModule],
})
export class AppModule {}
