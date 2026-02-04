// Utility to wait for a service to be healthy (for demo purposes)

export async function waitForHealth(url: string, timeoutMs = 15_000) {
  const start = Date.now();
  while (true) {
    try {
      const res = await fetch(`${url}/health`);
      if (res.ok) return;
    } catch {
      // ignore
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timed out waiting for health: ${url}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }
}
