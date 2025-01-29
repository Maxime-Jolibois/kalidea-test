import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsNotInFutur(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNotInFutur',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value instanceof Date && value <= new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} ne peut pas être dans le futur`;
        },
      },
    });
  };
}
