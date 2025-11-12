import { Controller } from '@nestjs/common';
import { TaskService } from './task.service';
import { MessagePattern } from '@nestjs/microservices';
import { ITaskDto } from './interface/task.interface';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @MessagePattern('create_task')
  create(taskDto: ITaskDto) {
    return this.taskService.create(taskDto);
  }

  @MessagePattern('user_tasks')
  findUserTasks({ userId }: { userId: string }) {
    return this.taskService.findUserTasks(userId);
  }
}
