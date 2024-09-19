import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/users.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { SqsConsumer } from "src/sqs.service.consumer";

@Module({
    imports:[
        MongooseModule.forFeature([{name: User.name, schema:UserSchema}]),
    ],
    controllers:[UsersController],
    providers:[UsersService, SqsConsumer]
})

export class UserModule {}