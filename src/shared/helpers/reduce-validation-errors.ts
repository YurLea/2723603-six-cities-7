import type { ValidationError } from 'class-validator';

import type { ValidationErrorField } from '../http/validation-error-field.type.js';

export function reduceValidationErrors(
  errors: ValidationError[],
  parentPath = ''
): ValidationErrorField[] {
  const result: ValidationErrorField[] = [];

  for (const error of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      result.push({
        property: propertyPath,
        value: error.value,
        messages: Object.values(error.constraints),
      });
    }

    if (error.children && error.children.length > 0) {
      result.push(...reduceValidationErrors(error.children, propertyPath));
    }
  }

  return result;
}
