import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import ItemDetails from "@/app/[itemId]";
import { withProviders } from "../utils/testProviders";
import { setJson } from "../utils/http";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({ itemId: "123" })),
  router: { push: jest.fn(), back: jest.fn() },
  Stack: { Screen: ({ children }: any) => children ?? null },
}));

const itemUrl = (id: number | string) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

describe("ItemDetails screen", () => {
  test("renders selected post details and comment count", async () => {
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
      expect(screen.getByText("Hello")).toBeTruthy();
      expect(screen.getByText("2")).toBeTruthy();
    });
  });

  test("renders formatted content when text exists", async () => {
    setJson(itemUrl("123"), {
      id: 123,
      by: "alice",
      text: "<blockquote>Quote</blockquote>",
    });

    const { Wrapper } = withProviders(<ItemDetails />);
    render(<ItemDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("alice")).toBeTruthy();
    });
  });
});
