import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import UserDetails from "@/app/users/[userId]";
import { withProviders } from "../utils/testProviders";
import { setJson } from "../utils/http";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({ userId: "testuser" })),
  router: { push: jest.fn(), back: jest.fn() },
  Stack: { Screen: ({ children }: any) => children ?? null },
}));

const userUrl = (id: string) =>
  `https://hacker-news.firebaseio.com/v0/user/${id}.json`;

describe("UserProfile Screen", () => {
  test("renders user profile with basic info", async () => {
    setJson(userUrl("testuser"), {
      id: "testuser",
      created: 1234567890,
      karma: 100,
      about: "Test user profile",
    });

    const { Wrapper } = withProviders(<UserDetails />);
    render(<UserDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeTruthy();
    });
  });

  test("handles user without about text", async () => {
    setJson(userUrl("testuser"), {
      id: "testuser",
      created: 1234567890,
      karma: 50,
    });

    const { Wrapper } = withProviders(<UserDetails />);
    render(<UserDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("testuser")).toBeTruthy();
    });
  });

  test("displays karma score", async () => {
    setJson(userUrl("testuser"), {
      id: "testuser",
      created: 1234567890,
      karma: 250,
    });

    const { Wrapper } = withProviders(<UserDetails />);
    render(<UserDetails />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("🔥 250")).toBeTruthy();
    });
  });

  test("handles missing user data gracefully", async () => {
    // Don't set any mock - let it fail naturally
    const { Wrapper } = withProviders(<UserDetails />);
    render(<UserDetails />, { wrapper: Wrapper });

    // Should not crash
    await waitFor(() => {
      // Component should handle missing data
      expect(screen.getByTestId("user-profile")).toBeTruthy();
    });
  });
});
