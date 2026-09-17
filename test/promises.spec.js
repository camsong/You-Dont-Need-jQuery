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

  it('7.3 Deferred way', async () => {
    function defer() {
      const deferred = {};
      const promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });

      deferred.promise = () => {
        return promise;
      };

      return deferred;
    }

    function asyncFunc() {
      const deferred = defer();
      setTimeout(() => {
        deferred.resolve('some_value_computed_asynchronously');
      }, 10);

      return deferred.promise();
    }

    await expect(asyncFunc()).resolves.toBe('some_value_computed_asynchronously');
  });
});
