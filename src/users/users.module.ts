import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { UserImages } from './entities/user-images.entity';

@Module({
   imports: [TypeOrmModule.forFeature([User, UserProfile, UserImages])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
