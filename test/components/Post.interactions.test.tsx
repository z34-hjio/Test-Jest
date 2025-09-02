import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Post } from "@/components/posts/Post";
import { withProviders } from "../utils/testProviders";
import * as Haptics from "expo-haptics";
import { Linking } from "react-native";
import type { Item } from "@/shared/types";

// Helper to create valid Item objects for tests
const createMockItem = (overrides: Partial<Item> = {}): Item => ({
  id: 1,
  deleted: false,
  type: "story",
  by: "test",
  time: 0,
  text: "",
  dead: false,
  parent: 0,
  poll: 0,
  kids: [],
  url: "",
  score: 0,
  title: "Title",
  parts: [],
  descendants: 0,
  ...overrides,
});

const mockHaptics = Haptics as jest.Mocked<typeof Haptics>;

describe("Post Interactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("navigates to details when post has text content", async () => {
    const mockPost = createMockItem({
      id: 123,
      title: "Test Post",
      text: "This is a text post",
      score: 5,
      kids: [1, 2],
    });

    const { Wrapper } = withProviders(<Post {...mockPost} />);
    render(<Post {...mockPost} />, { wrapper: Wrapper });

    const titlePressable = screen.getByText("Test Post");
    fireEvent.press(titlePressable);

    // Should not open external URL since it has text content
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  test("opens external URL when post has no text content", async () => {
    const mockPost = createMockItem({
      id: 123,
      text: undefined,
      title: "External Post",
      url: "https://example.com",
      score: 5,
      kids: [],
    });

    const { Wrapper } = withProviders(<Post {...mockPost} />);
    render(<Post {...mockPost} />, { wrapper: Wrapper });

    const titlePressable = screen.getByText("External Post");
    fireEvent.press(titlePressable);
    expect(Linking.openURL).toHaveBeenCalledWith("https://example.com");
  });

  test("triggers haptic feedback on score button press", async () => {
    const mockPost = createMockItem({
      id: 123,
      title: "Test Post",
      score: 5,
      kids: [],
    });

    const { Wrapper } = withProviders(<Post {...mockPost} />);
    render(<Post {...mockPost} />, { wrapper: Wrapper });

    const scoreButton = screen.getByText("▲ 5");
    fireEvent.press(scoreButton);

    expect(mockHaptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });

  test("shows correct comment count", () => {
    const mockPost = createMockItem({
      id: 123,
      title: "Test Post",
      score: 5,
      kids: [1, 2, 3],
    });

    const { Wrapper } = withProviders(<Post {...mockPost} />);
    render(<Post {...mockPost} />, { wrapper: Wrapper });

    expect(screen.getByText("3")).toBeTruthy();
  });

  test("shows zero comments when no kids", () => {
    const mockPost = createMockItem({
      id: 123,
      title: "Test Post",
      score: 5,
      kids: [],
    });

    const { Wrapper } = withProviders(<Post {...mockPost} />);
    render(<Post {...mockPost} />, { wrapper: Wrapper });

    expect(screen.getByText("0")).toBeTruthy();
  });

  test("displays external link when URL is present", () => {
    const mockPost = createMockItem({
      id: 123,
      title: "Test Post",
      url: "https://example.com",
      score: 5,
      kids: [],
    });

    const { Wrapper } = withProviders(<Post {...mockPost} />);
    render(<Post {...mockPost} />, { wrapper: Wrapper });

    expect(screen.getByText("example.com")).toBeTruthy();
  });

  test("opens external link when link button is pressed", () => {
    const mockPost = createMockItem({
      id: 123,
      title: "Test Post",
      url: "https://example.com",
      score: 5,
      kids: [],
    });

    const { Wrapper } = withProviders(<Post {...mockPost} />);
    render(<Post {...mockPost} />, { wrapper: Wrapper });

    const linkButton = screen.getByText("example.com");
    fireEvent.press(linkButton);

    expect(Linking.openURL).toHaveBeenCalledWith("https://example.com");
  });
});
