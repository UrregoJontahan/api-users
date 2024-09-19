import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://13.59.93.212:27017/nest-users'),
    UserModule,
  ]
})
export class AppModule {}
