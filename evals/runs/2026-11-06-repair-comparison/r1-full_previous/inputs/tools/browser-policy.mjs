// Browser HTTP(S)/WebSocket policy only. This is not a process/network sandbox.
export function localOrigin(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) ||
      !['127.0.0.1', '[::1]', 'localhost'].includes(url.hostname) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('Expected an exact loopback HTTP(S) origin, including the server port');
  }
  return url.origin;
}

function destination(value) {
  try { return new URL(value).origin; } catch { return 'invalid-url'; }
}

export async function restrictedContext(browser, origin, options = {}, transform) {
  origin = localOrigin(origin);
  const policy = {
    scope: 'Context HTTP(S) and WebSocket routing only; speculative TCP connections may occur; no Node/process/host isolation',
    allowedOrigin: origin, serviceWorkers: 'block', webSockets: 'block-all',
    redirects: 'block-all', denied: [], failures: 0, droppedRecords: 0,
  };
  const deny = (kind, url) => {
    if (policy.denied.length < 200) policy.denied.push({ kind, origin: destination(url) });
    else policy.droppedRecords++;
  };
  const context = await browser.newContext({ ...options, serviceWorkers: 'block', acceptDownloads: false });
  try {
    if (typeof context.routeWebSocket !== 'function') throw new Error('Playwright >= 1.48 is required for WebSocket routing');
    await context.routeWebSocket(/.*/, async socket => {
      deny('websocket', socket.url());
      await socket.close({ code: 1008, reason: 'Maintainer test policy' });
    });
    await context.route(/.*/, async route => {
      const url = new URL(route.request().url());
      if (url.origin !== origin || url.username || url.password) {
        deny('request', url.href);
        return route.abort('blockedbyclient');
      }
      let response;
      try {
        // Prevent route.fetch from following a redirect outside the allowlist.
        response = await route.fetch({ maxRedirects: 0, maxRetries: 0, timeout: 15000 });
        if ([301, 302, 303, 307, 308].includes(response.status())) {
          deny('redirect', new URL(response.headers().location || '/', url).href);
          return await route.abort('blockedbyclient');
        }
        const body = transform ? await transform(url, response) : undefined;
        await route.fulfill({ response, ...(body === undefined ? {} : { body }) });
      } catch {
        // Never persist raw exception text: it can contain URLs or page content.
        policy.failures++;
        await route.abort('failed').catch(() => {});
      } finally {
        await response?.dispose();
      }
    });
    return { context, policy };
  } catch (error) {
    await context.close();
    throw error;
  }
}
