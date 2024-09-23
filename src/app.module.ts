import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://18.118.85.71:27017/nest-users'),
    UserModule,
  ]
})
export class AppModule {}
