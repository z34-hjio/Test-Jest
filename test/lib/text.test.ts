import { parseTitle } from "@/lib/text";

describe("parseTitle utility", () => {
  test("returns original title when no special characters", () => {
    const title = "Simple Title";
    expect(parseTitle(title)).toBe("Simple Title");
  });

  test("handles empty string", () => {
    expect(parseTitle("")).toBe("");
  });

  test("handles undefined input", () => {
    expect(() => parseTitle(undefined as any)).toThrow();
  });

  test("handles null input", () => {
    expect(() => parseTitle(null as any)).toThrow();
  });

  test("handles very long titles", () => {
    const longTitle = "A".repeat(1000);
    const result = parseTitle(longTitle);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  test("handles titles with special characters", () => {
    const title = "Title with &amp; and &lt;tags&gt;";
    const result = parseTitle(title);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  test("handles titles with HTML entities", () => {
    const title = "Title with &quot;quotes&quot; and &#39;apostrophes&#39;";
    const result = parseTitle(title);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });
});
