import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityNotFoundError, getConnection } from 'typeorm';

export function Exists(
  modelClass: any,
  field = 'id',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      constraints: [modelClass, field],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!value) {
      return false;
    }
    try {
      const [modelClass, field] = args.constraints;
      const conn = getConnection('default');
      const repository = conn.getRepository(modelClass);
      const result = await repository.findOne({
        where: {
          [field]: value,
        },
      });
      if (!result) {
        throw new EntityNotFoundError(modelClass, value);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  defaultMessage(args: ValidationArguments) {
    const [modelClass] = args.constraints;
    return `${modelClass.name} not found`;
  }
}
