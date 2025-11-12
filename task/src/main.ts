import { NestFactory } from '@nestjs/core';
import { TaskModule } from './task.module';
import {
  MicroserviceOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4003,
      },
    } as TcpOptions,
  );

  await app.listen();

  console.log('task service: http://localhost:4003');
}
bootstrap();
