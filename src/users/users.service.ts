import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { Repository } from 'typeorm';
import { UserImages } from './entities/user-images.entity';

@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  
async create(createUserDto: CreateUserDto) {
const profile = this.usersRepository.manager.create(UserProfile, {
    bio: 'This is a default bio',
    avatarUrl: 'https://example.com/default-avatar.png',
  });

  const images1 = this.usersRepository.manager.create(UserImages, {
    avatarUrl: 'https://example11.com/default-avatar.png',
  });

    const images2 = this.usersRepository.manager.create(UserImages, {
    avatarUrl: 'https://example2.com/default-avatar.png',
  });
  // await this.usersRepository.manager.save(profile);
  const user =  this.usersRepository.create(createUserDto);
  user.profile = profile;
  user.images = [images1, images2];
  return await this.usersRepository.save(user);
}

   async findAll() {
    return await this.usersRepository.find({relations: ['profile','orders', 'promoCodes']});
  }

async findOne(id: number) {
  return await this.usersRepository.findOne({ where: { id }, relations: ['profile', 'orders', 'promoCodes'] });
}

 async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({id});
    if(!user) {
        return null;
    }

  //   const profile = this.usersRepository.manager.create(UserProfile, {
  //   bio: 'Second profile',
  //   avatarUrl: 'https://example.com',
  // });

      const images2 = this.usersRepository.manager.create(UserImages, {
    avatarUrl: 'https://example2.com/default-avatar.png',
  });

    // user.profile = profile;
    user.images = [];
    return await this.usersRepository.save(user);
    
  }

  async remove(id: number) {
    return await this.usersRepository.delete(id);
  }
}
