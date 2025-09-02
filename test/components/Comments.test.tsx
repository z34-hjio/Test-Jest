import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react-native";
import { Comments } from "@/components/comments/comments";
import { withProviders } from "../utils/testProviders";
import { setJson } from "../utils/http";

const itemUrl = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

describe("Comments", () => {
  test("renders paginated comments with header and loads next page", async () => {
    const kids = Array.from({ length: 12 }, (_, i) => i + 1);

    kids.forEach((id) => {
      setJson(itemUrl(id), {
        id,
        text: `comment ${id}`,
        by: "user",
        type: "comment",
      });
    });

    const { Wrapper } = withProviders(
      <Comments id={999} kids={kids}>
        <></>
      </Comments>
    );

    const { getByTestId } = render(
      <Comments id={999} kids={kids}>
        <></>
      </Comments>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.getAllByText("user").length).toBeGreaterThan(0);
    });

    const list = getByTestId("CommentsFlatList");
    act(() => {
      list.props.onEndReached?.();
    });

    await waitFor(() => {
      expect(screen.getAllByText("user").length).toBeGreaterThanOrEqual(10);
    });
  });

  test("handles empty state gracefully", async () => {
    const { Wrapper } = withProviders(
      <Comments id={1000} kids={[]}>
        {null}
      </Comments>
    );

    render(
      <Comments id={1000} kids={[]}>
        {null}
      </Comments>,
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(screen.queryByText(/comment/)).toBeNull();
    });
  });
});
