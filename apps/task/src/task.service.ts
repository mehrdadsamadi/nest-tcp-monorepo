import { HttpStatus, Injectable } from '@nestjs/common';
import { ITaskDto } from './interface/task.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schema/task.schema';
import { Model } from 'mongoose';
import { TaskStatus } from './status.enum';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(taskDto: ITaskDto) {
    const { title, content, userId } = taskDto;

    const task = await this.taskModel.create({
      title,
      content,
      userId,
      status: TaskStatus.PENDING,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Task created successfully',
      data: { task },
    };
  }

  async findUserTasks(userId: string) {
    const tasks = await this.taskModel.find({
      userId,
    });

    return {
      status: HttpStatus.OK,
      message: 'fetch tasks successfully',
      data: { tasks },
    };
  }
}
