import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatus } from '../status.enum';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({})
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;
}

export type TaskDocument = HydratedDocument<Task>;

export const TaskSchema = SchemaFactory.createForClass(Task);
