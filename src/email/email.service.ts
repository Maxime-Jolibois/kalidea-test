import { UserId } from './../user/user.interfaces';
import { Injectable } from '@nestjs/common';
import { EmailEntity } from './email.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, In, Repository } from 'typeorm';
import { IEmail, IEmailId } from './email.interfaces';
import { EmailFiltersArgs, UserEmail } from './email.types';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  public get(id: IEmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }

  public getFromFilters(
    filters: EmailFiltersArgs,
    userId?: UserId,
  ): Promise<UserEmail[]> {
    const where: FindOptionsWhere<EmailEntity>[] = [];

    if (filters.address) {
      if (filters.address.equal) {
        where.push({
          address: Equal(filters.address.equal),
        });
      }

      if (filters.address.in?.length > 0) {
        where.push({ address: In(filters.address.in) });
      }
    }

    if (userId) {
      where.forEach((element) => (element.userId = userId));
    }

    return this.emailRepository.find({
      where,
      order: { address: 'asc' },
    });
  }
}
