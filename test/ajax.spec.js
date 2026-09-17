// tests for Ajax related
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('ajax', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function requestJSON(url, handleData, handleError) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(handleData)
      .catch(handleError);
  }

  it('4.0 Request JSON resolves data', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{"ok":true}', { status: 200 })));
    const handleData = vi.fn();
    const handleError = vi.fn();

    await requestJSON('/data', handleData, handleError);

    expect(handleData).toHaveBeenCalledWith({ ok: true });
    expect(handleError).not.toHaveBeenCalled();
  });

  it('4.0 Request JSON treats HTTP errors as failures', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('not found', { status: 404 })));
    const handleData = vi.fn();
    const handleError = vi.fn();

    await requestJSON('/missing', handleData, handleError);

    expect(handleData).not.toHaveBeenCalled();
    expect(handleError.mock.calls[0][0].message).toBe('HTTP 404');
  });

  it('4.0.2 abort', async () => {
    const controller = new AbortController();
    controller.abort();

    expect(controller.signal.aborted).toBe(true);
    expect(AbortSignal.timeout(5000)).toBeInstanceOf(AbortSignal);
  });
});
