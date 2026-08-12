import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { AuditLogRepository } from '../common/audit-log.repository';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TasksRepository, AuditLogRepository],
  exports: [TasksRepository],
})
export class TasksModule {}
