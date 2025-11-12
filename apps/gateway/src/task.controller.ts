import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiConsumes } from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';
import { ResponseType } from './types/response.type';
import { AuthDecorator } from './decorators/auth.decorator';
import { Request } from 'express';
import { TaskDto } from './dto/task.dto';

@Controller('task')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskClientService: ClientProxy,
  ) {}

  @Post('create')
  @AuthDecorator()
  @ApiConsumes('application/x-www-form-urlencoded')
  async create(@Body() createDto: TaskDto, @Req() req: Request) {
    const response = await lastValueFrom<ResponseType>(
      this.taskClientService.send<ResponseType>('create_task', {
        title: createDto.title,
        content: createDto.content,
        userId: req?.user?._id,
      }),
    );

    if (response?.error)
      throw new HttpException(
        response?.message,
        response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      message: response?.message,
      data: response?.data,
      status: response?.status,
    };
  }

  @Get('user-tasks')
  @AuthDecorator()
  async userTasks(@Req() req: Request) {
    const userId = req?.user?._id;

    const response = await lastValueFrom<ResponseType>(
      this.taskClientService.send<ResponseType>('user_tasks', { userId }),
    );

    return response?.data || { tasks: [] };
  }
}
