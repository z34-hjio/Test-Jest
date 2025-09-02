import {
  getTopStories,
  getBestStories,
  getAskStories,
  getShowStories,
  getItemDetails,
  getUserDetails,
} from "@/api/endpoints";

// Mock fetch globally
global.fetch = jest.fn();

describe("API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getTopStories returns correct URL", async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue([1, 2, 3]) };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await getTopStories();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { method: "GET" }
    );
  });

  test("getBestStories returns correct URL", async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue([1, 2, 3]) };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await getBestStories();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/beststories.json",
      { method: "GET" }
    );
  });

  test("getAskStories returns correct URL", async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue([1, 2, 3]) };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await getAskStories();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/askstories.json",
      { method: "GET" }
    );
  });

  test("getShowStories returns correct URL", async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue([1, 2, 3]) };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await getShowStories();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/showstories.json",
      { method: "GET" }
    );
  });

  test("getItemDetails constructs correct URL with number ID", async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue({ id: 123 }) };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await getItemDetails(123);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/item/123.json",
      { method: "GET" }
    );
  });

  test("getItemDetails constructs correct URL with string ID", async () => {
    const mockResponse = { json: jest.fn().mockResolvedValue({ id: "123" }) };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await getItemDetails("123");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/item/123.json",
      { method: "GET" }
    );
  });

  test("getUserDetails constructs correct URL", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({ id: "user123" }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await getUserDetails("user123");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hacker-news.firebaseio.com/v0/user/user123.json",
      { method: "GET" }
    );
  });
});
