import {
  plainToInstance,
  type ClassConstructor,
} from 'class-transformer';

export function fillRdo<T, V>(
  rdo: ClassConstructor<T>,
  data: V
): T {
  return plainToInstance(rdo, data, {
    excludeExtraneousValues: true,
  });
}
