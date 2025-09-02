import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import ItemDetails from "@/app/[itemId]";
import { withProviders } from "../utils/testProviders";
import { setJson } from "../utils/http";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({ itemId: "123" })),
  router: { push: jest.fn(), back: jest.fn() },
  Stack: { Screen: ({ children }: any) => children ?? null },
}));

const mockHaptics = Haptics as jest.Mocked<typeof Haptics>;
const mockLinking = Linking as jest.Mocked<typeof Linking>;

const itemUrl = (id: number | string) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

describe("ItemDetails Interactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("triggers haptic feedback on score button press", async () => {
    setJson(itemUrl("123"), {
      id: 123,
      by: "alice",
      title: "Hello",
      score: 5,
      kids: [1, 2],
    });

    const { Wrapper } = withProviders(<ItemDetails />);
    render(<ItemDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("alice")).toBeTruthy();
    });

    const scoreButton = screen.getByText("▲ 5");
    fireEvent.press(scoreButton);

    expect(mockHaptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success
    );
  });

  test("triggers haptic feedback on comment button press", async () => {
    setJson(itemUrl("123"), {
      id: 123,
      by: "alice",
      title: "Hello",
      score: 5,
      kids: [1, 2],
    });

    const { Wrapper } = withProviders(<ItemDetails />);
    render(<ItemDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("alice")).toBeTruthy();
    });

    const commentButton = screen.getByText("2");
    fireEvent.press(commentButton);

    expect(mockHaptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Warning
    );
  });

  test("renders parent item link when item is a comment", async () => {
    setJson(itemUrl("123"), {
      id: 123,
      by: "alice",
      text: "This is a comment",
      parent: 456,
      type: "comment",
    });

    setJson(itemUrl("456"), {
      id: 456,
      by: "bob",
      title: "Parent Post Title",
    });

    const { Wrapper } = withProviders(<ItemDetails />);
    render(<ItemDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Commented on:")).toBeTruthy();
      expect(screen.getByText("Parent Post Title")).toBeTruthy();
    });
  });

  test("handles item without URL", async () => {
    setJson(itemUrl("123"), {
      id: 123,
      by: "alice",
      title: "Hello",
      score: 5,
      kids: [],
    });

    const { Wrapper } = withProviders(<ItemDetails />);
    render(<ItemDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("alice")).toBeTruthy();
      expect(screen.queryByText("example.com")).toBeNull();
    });
  });

  test("handles item without kids", async () => {
    setJson(itemUrl("123"), {
      id: 123,
      by: "alice",
      title: "Hello",
      score: 5,
    });

    const { Wrapper } = withProviders(<ItemDetails />);
    render(<ItemDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("0")).toBeTruthy();
    });
  });
});
