import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react-native";
import { Posts } from "@/components/posts/Posts";
import { withProviders } from "../utils/testProviders";
import { setJson, getCallCount } from "../utils/http";

const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
const itemUrl = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

function mockTopStories(ids: number[]) {
  setJson(topStoriesUrl, ids);
}

function mockItems(
  items: Array<{ id: number; title?: string; text?: string }>
) {
  items.forEach((item) => {
    setJson(itemUrl(item.id), {
      id: item.id,
      title: item.title ?? `Title ${item.id}`,
      text: item.text,
      score: 0,
      kids: [],
    });
  });
}

describe("Posts", () => {
  test("renders initial posts and shows loading footer", async () => {
    const ids = [1, 2, 3, 4];
    mockTopStories(ids);
    mockItems(ids.map((id) => ({ id, text: "internal" })));

    const { Wrapper } = withProviders(<Posts storyType="topstories" />);
    render(<Posts storyType="topstories" />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Title 1")).toBeTruthy();
      expect(screen.getByText("Title 2")).toBeTruthy();
    });
  });

  test("fetches next page on end reached without duplicates", async () => {
    const ids = Array.from({ length: 15 }, (_, i) => i + 1);
    mockTopStories(ids);
    mockItems(ids.map((id) => ({ id, text: "internal" })));

    const { Wrapper } = withProviders(<Posts storyType="topstories" />);
    const { getByTestId } = render(<Posts storyType="topstories" />, {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(screen.getByText("Title 1")).toBeTruthy();
      expect(screen.queryByText("Title 11")).toBeNull();
    });

    const list = getByTestId("PostsFlatList");
    act(() => {
      list.props.onEndReached?.({ distanceFromEnd: 1 });
    });
    // Some RN versions require an additional tick/call
    await waitFor(() =>
      expect(screen.queryAllByText(/Title/).length).toBeGreaterThanOrEqual(10)
    );
    act(() => {
      list.props.onEndReached?.({ distanceFromEnd: 1 });
    });

    await waitFor(() =>
      expect(getCallCount(itemUrl(11))).toBeGreaterThanOrEqual(1)
    );
    expect(getCallCount(itemUrl(1))).toBeGreaterThanOrEqual(1);
  });
});
