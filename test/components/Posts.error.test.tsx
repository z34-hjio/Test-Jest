import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { Posts } from "@/components/posts/Posts";
import { withProviders } from "../utils/testProviders";
import { setJson } from "../utils/http";

const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";

describe("Posts Error Handling", () => {
  test("handles network error gracefully", async () => {
    // Don't set any mocks - let it fail naturally
    const { Wrapper } = withProviders(<Posts storyType="topstories" />);
    render(<Posts storyType="topstories" />, { wrapper: Wrapper });

    // Should not crash and should show empty state
    await waitFor(() => {
      const list = screen.getByTestId("PostsFlatList");
      expect(list).toBeTruthy();
    });
  });

  test("handles empty stories list", async () => {
    setJson(topStoriesUrl, []);
    const { Wrapper } = withProviders(<Posts storyType="topstories" />);
    render(<Posts storyType="topstories" />, { wrapper: Wrapper });

    await waitFor(() => {
      const list = screen.getByTestId("PostsFlatList");
      expect(list).toBeTruthy();
    });
  });

  test("filters out dead and deleted posts", async () => {
    setJson(topStoriesUrl, [1, 2, 3]);
    setJson("https://hacker-news.firebaseio.com/v0/item/1.json", {
      id: 1,
      title: "Valid Post",
      dead: false,
      deleted: false,
    });
    setJson("https://hacker-news.firebaseio.com/v0/item/2.json", {
      id: 2,
      title: "Dead Post",
      dead: true,
      deleted: false,
    });
    setJson("https://hacker-news.firebaseio.com/v0/item/3.json", {
      id: 3,
      title: "Deleted Post",
      dead: false,
      deleted: true,
    });

    const { Wrapper } = withProviders(<Posts storyType="topstories" />);
    render(<Posts storyType="topstories" />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Valid Post")).toBeTruthy();
      expect(screen.queryByText("Dead Post")).toBeNull();
      expect(screen.queryByText("Deleted Post")).toBeNull();
    });
  });
});
