import { Injectable } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PromoCode } from './entities/promo-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectRepository(PromoCode)
    private promoCodeRepository: Repository<PromoCode>
  ) {}

  async create(createPromoCodeDto: CreatePromoCodeDto) {
    const promoCode = this.promoCodeRepository.create(createPromoCodeDto);
    return this.promoCodeRepository.save(promoCode);
  }

  async findAll() {
    return this.promoCodeRepository.find({relations: ['users']});
  }

  async findOne(id: number) {
    return this.promoCodeRepository.findOne({ where: { id }, relations: ['users'] });
  }

  async update(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    await this.promoCodeRepository.update(id, updatePromoCodeDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.promoCodeRepository.delete(id);
  }
}
