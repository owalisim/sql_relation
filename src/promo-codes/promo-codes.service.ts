import { Injectable } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoCode } from './entities/promo-code.entity';
import { User } from '../users/entities/user.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectRepository(PromoCode)
    private promoCodeRepository: Repository<PromoCode>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPromoCodeDto: CreatePromoCodeDto) {
    const { userIds, ...payload } = createPromoCodeDto;
    const promoCode = this.promoCodeRepository.create(payload);

    if (userIds?.length) {
      promoCode.users = await this.userRepository.findBy({ id: In(userIds) });
    }

    return this.promoCodeRepository.save(promoCode);
  }

  async findAll() {
    return this.promoCodeRepository.find({ relations: ['users'] });
  }

  async findOne(id: number) {
    return this.promoCodeRepository.findOne({ where: { id }, relations: ['users'] });
  }

  async update(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    const { userIds, ...payload } = updatePromoCodeDto as any;
    const preloadData: any = { id, ...payload };

    if (userIds !== undefined) {
      preloadData.users = userIds.length ? await this.userRepository.findBy({ id: In(userIds) }) : [];
    }

    const promoCode = await this.promoCodeRepository.preload(preloadData);

    if (!promoCode) {
      return null;
    }

    return this.promoCodeRepository.save(promoCode);
  }

  async remove(id: number) {
    return this.promoCodeRepository.delete(id);
  }
}
