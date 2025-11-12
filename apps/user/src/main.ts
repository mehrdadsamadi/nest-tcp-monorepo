import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import {
  MicroserviceOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4001,
      },
    } as TcpOptions,
  );

  await app.listen();

  console.log('user service: http://localhost:4001');
}
bootstrap();
