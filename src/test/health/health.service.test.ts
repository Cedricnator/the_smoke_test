import { HealthService } from '@/app/features/health/health.service';
import { describe, it, expect } from 'vitest';

describe('HealthService', () => {
  it('should return OK status', () => {
    const healthService = new HealthService();
    const result = healthService.getStatus();

    expect(result).toEqual({ status: 'OK' });
  });

  it('should always return a status property', () => {
    const healthService = new HealthService();
    const result = healthService.getStatus();

    expect(result).toHaveProperty('status');
  });
});
