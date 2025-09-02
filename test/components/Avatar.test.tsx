import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Avatar } from "@/components/Avatar";

describe("Avatar Component", () => {
  test("renders with text prop", () => {
    render(<Avatar text="john" />);

    expect(screen.getByText("J")).toBeTruthy();
  });

  test("displays first character uppercase", () => {
    render(<Avatar text="alice" />);

    expect(screen.getByText("A")).toBeTruthy();
  });

  test("handles empty string", () => {
    render(<Avatar text="" />);

    // Should not crash with empty string
    expect(screen.getByText("")).toBeTruthy();
  });

  test("handles single character", () => {
    render(<Avatar text="x" />);

    expect(screen.getByText("X")).toBeTruthy();
  });

  test("handles special characters", () => {
    render(<Avatar text="@user" />);

    expect(screen.getByText("@")).toBeTruthy();
  });

  test("handles numbers", () => {
    render(<Avatar text="123" />);

    expect(screen.getByText("1")).toBeTruthy();
  });
});
