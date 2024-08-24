import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users/users.entity';
import { AddingMongoIdMiddleware } from './adding-mongo-id/adding-mongo-id.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: '127.0.0.1',
      port: 27017,
      database: 'UsersDB',
      entities: [Users],
      logging: true
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {
  configure(consumer : MiddlewareConsumer) {
    consumer.apply(AddingMongoIdMiddleware)
    .forRoutes({path: "users", method: RequestMethod.PUT})
  }
}
