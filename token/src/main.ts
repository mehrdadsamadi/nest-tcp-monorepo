import { NestFactory } from '@nestjs/core';
import { TokenModule } from './token.module';
import {
  MicroserviceOptions,
  TcpOptions,
  Transport,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TokenModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4002,
      },
    } as TcpOptions,
  );

  await app.listen();

  console.log('token service: http://localhost:4002');
}
bootstrap();
