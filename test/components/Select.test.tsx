import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { StoriesSelect } from "@/components/Select";

const mockOptions = [
  { id: "topstories", label: "Top Stories", icon: jest.fn() },
  { id: "beststories", label: "Best Stories", icon: jest.fn() },
];

describe("StoriesSelect", () => {
  test("renders trigger button with selected option", () => {
    render(
      <StoriesSelect
        value="topstories"
        onChange={jest.fn()}
        options={mockOptions}
      />
    );

    expect(screen.getByText("Top Stories")).toBeTruthy();
  });

  test("shows default label when no option selected", () => {
    render(
      <StoriesSelect
        value="unknown"
        as
        any
        onChange={jest.fn()}
        options={mockOptions}
      />
    );

    expect(screen.getByText("Select")).toBeTruthy();
  });

  test("opens dropdown when trigger is pressed", () => {
    render(
      <StoriesSelect
        value="topstories"
        onChange={jest.fn()}
        options={mockOptions}
      />
    );

    const trigger = screen.getByText("Top Stories");
    fireEvent.press(trigger);

    // Should show options
    expect(screen.getByText("Best Stories")).toBeTruthy();
  });

  test("calls onChange when option is selected", () => {
    const mockOnChange = jest.fn();
    render(
      <StoriesSelect
        value="topstories"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );

    const trigger = screen.getByText("Top Stories");
    fireEvent.press(trigger);

    const bestOption = screen.getByText("Best Stories");
    fireEvent.press(bestOption);

    expect(mockOnChange).toHaveBeenCalledWith("beststories");
  });

  test("closes dropdown after selection", () => {
    render(
      <StoriesSelect
        value="topstories"
        onChange={jest.fn()}
        options={mockOptions}
      />
    );

    const trigger = screen.getByText("Top Stories");
    fireEvent.press(trigger);

    const bestOption = screen.getByText("Best Stories");
    fireEvent.press(bestOption);

    // Dropdown should close
    expect(screen.queryByText("Best Stories")).toBeNull();
  });

  test("handles empty options array", () => {
    render(
      <StoriesSelect value="topstories" onChange={jest.fn()} options={[]} />
    );

    expect(screen.getByText("Select")).toBeTruthy();
  });
});
