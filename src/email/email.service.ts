import { UserId } from './../user/user.interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { EmailEntity } from './email.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, FindOptionsWhere, In, Repository } from 'typeorm';
import { IEmail, IEmailId } from './email.interfaces';
import { EmailFiltersArgs, UserEmail } from './email.types';
import { UserEntity } from '../user/user.entity';
import { UserStatus } from '../enums/userStatus.enum';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

  public async addEmailToUser(
    userId: UserId,
    address: string,
  ): Promise<UserEmail> {
    // On vérifie si le user existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`L'utilisateur n'a pas été trouvé`);
    }

    if (user.status === UserStatus.INACTIF) {
      throw new Error("Impossible d'ajouter un email à un utilisateur inactif");
    }

    const email = this.emailRepository.create({
      address: address,
      userId: userId,
    });
    return this.emailRepository.save(email);
  }

  public async delete(emailId: IEmailId): Promise<DeleteResult> {
    return this.emailRepository.delete(emailId);
  }
}
