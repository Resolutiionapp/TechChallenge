import { Controller, Get, Headers } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('workspaces')
  listWorkspaces(@Headers('x-user-id') userId: string, @Headers('x-user-email') email: string) {
    return this.adminService.listAllWorkspaces({ userId, email });
  }
}
