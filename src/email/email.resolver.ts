import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EmailFiltersArgs, UserEmail } from './email.types';
import { User } from '../user/user.types';
import { EmailService } from './email.service';
import { IEmail } from './email.interfaces';
import { UserService } from '../user/user.service';
import { UserId } from 'src/user/user.interfaces';

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @Query(() => UserEmail, { name: 'email' })
  getEmail(
    @Args({ name: 'emailId', type: () => ID }) emailId: string,
  ): Promise<IEmail> {
    return this.emailService.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    return this.emailService.getFromFilters(filters);
  }

  @Mutation(() => UserEmail)
  async addEmail(
    @Args('userId') userId: UserId,
    @Args('address') address: string,
  ): Promise<UserEmail> {
    return this.emailService.addEmailToUser(userId, address);
  }

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    return this.userService.getFromEmail(parent);
  }
}
