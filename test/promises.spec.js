// tests for Promises related
import { describe, it, expect } from 'vitest';

describe('promises', () => {
  it('7.1 always runs after fail', async () => {
    const calls = [];
    await Promise.reject(new Error('nope'))
      .then(() => calls.push('done'), () => calls.push('fail'))
      .finally(() => calls.push('always'));

    expect(calls).toEqual(['fail', 'always']);
  });

  it('7.2 when', async () => {
    const [promise1Result, promise2Result] = await Promise.all([Promise.resolve(1), Promise.resolve(2)]);

    expect([promise1Result, promise2Result]).toEqual([1, 2]);
  });

  it('7.3 Deferred way with Promise.withResolvers', async () => {
    function asyncFunc() {
      const { promise, resolve } = Promise.withResolvers();
      setTimeout(() => {
        resolve('some_value_computed_asynchronously');
      }, 10);

      return promise;
    }

    await expect(asyncFunc()).resolves.toBe('some_value_computed_asynchronously');
  });
});
