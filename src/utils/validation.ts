import { Parameters } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateParameters = (params: Parameters, E: number, K: number, T: number): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate dimensions
  if (params.fi.length !== E) {
    errors.push({ field: 'fi', message: `Fixed costs must have ${E} values (one per facility)` });
  }

  // Validate non-negative values
  params.fi.forEach((val, i) => {
    if (val < 0) {
      errors.push({ field: `fi[${i}]`, message: 'Fixed operating costs must be non-negative' });
    }
  });

  // Validate variable costs
  for (let i = 0; i < Math.min(params.ci.length, E); i++) {
    for (let k = 0; k < Math.min(params.ci[i]?.length || 0, K); k++) {
      if (params.ci[i][k] < 0) {
        errors.push({ field: `ci[${i}][${k}]`, message: 'Variable costs must be non-negative' });
      }
    }
  }

  // Validate emissions intensity
  for (let i = 0; i < Math.min(params.ei.length, E); i++) {
    for (let k = 0; k < Math.min(params.ei[i]?.length || 0, K); k++) {
      if (params.ei[i][k] < 0) {
        errors.push({ field: `ei[${i}][${k}]`, message: 'Emissions intensity must be non-negative' });
      }
    }
  }

  // Validate capacity per unit
  for (let i = 0; i < Math.min(params.wi.length, E); i++) {
    for (let k = 0; k < Math.min(params.wi[i]?.length || 0, K); k++) {
      if (params.wi[i][k] <= 0) {
        errors.push({ field: `wi[${i}][${k}]`, message: 'Capacity per unit must be positive' });
      }
    }
  }

  // Validate gestation periods
  for (let i = 0; i < Math.min(params.yi.length, E); i++) {
    for (let k = 0; k < Math.min(params.yi[i]?.length || 0, K); k++) {
      if (params.yi[i][k] < 1 || params.yi[i][k] > T) {
        errors.push({ field: `yi[${i}][${k}]`, message: `Gestation period must be between 1 and ${T}` });
      }
    }
  }

  // Validate demands
  for (let i = 0; i < Math.min(params.di.length, E); i++) {
    for (let t = 0; t < Math.min(params.di[i]?.length || 0, T); t++) {
      if (params.di[i][t] < 0) {
        errors.push({ field: `di[${i}][${t}]`, message: 'Demand must be non-negative' });
      }
    }
  }

  // Validate carbon prices
  params.pt.forEach((val, t) => {
    if (val < 0) {
      errors.push({ field: `pt[${t}]`, message: 'Carbon price must be non-negative' });
    }
  });

  // Validate penalty parameter
  if (params.pi < 0) {
    errors.push({ field: 'pi', message: 'Penalty parameter must be non-negative' });
  }

  if (params.M <= 0) {
    errors.push({ field: 'M', message: 'Big-M parameter must be positive' });
  }

  return errors;
};