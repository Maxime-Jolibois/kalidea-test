import {
  Args,
  ID,
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

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    return this.userService.getFromEmail(parent);
  }
}
