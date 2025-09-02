type Json = any;

const registry = new Map<string, Json | ((url: string) => Json)>();
const calls: string[] = [];

export function installFetchMocks() {
  const g: any = global;
  if (g.__fetchInstalled) return;
  g.__fetchInstalled = true;
  g.fetch = jest.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    calls.push(url);
    const handler = registry.get(url);
    if (!handler) {
      throw new Error(`No mock for URL: ${url}`);
    }
    const result = typeof handler === "function" ? handler(url) : handler;
    return {
      ok: true,
      status: 200,
      json: async () => result,
    } as Response;
  });
}

export function setJson(url: string, json: Json | ((url: string) => Json)) {
  registry.set(url, json);
}

export function resetFetchMocks() {
  registry.clear();
  const g: any = global;
  if (g.fetch && "mockClear" in g.fetch) {
    // @ts-ignore
    g.fetch.mockClear();
  }
  calls.length = 0;
}

export function getCallCount(url: string): number {
  return calls.filter((u) => u === url).length;
}

export function getAllCalls(): string[] {
  return [...calls];
}
