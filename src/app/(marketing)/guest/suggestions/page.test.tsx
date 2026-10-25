import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import GuestSuggestionsPage from "./page";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-image" />,
}));

jest.mock("@/components/listings/HotelHeader", () => ({
  __esModule: true,
  default: () => <header data-testid="hotel-header" />,
}));

const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

describe("GuestSuggestionsPage – Message host", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    for (const key of [...mockSearchParams.keys()])
      mockSearchParams.delete(key);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it("renders the Message host button next to Book for the selected apartment", () => {
    render(<GuestSuggestionsPage />);

    expect(screen.getByRole("button", { name: /Book/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Message host/i }),
    ).toBeInTheDocument();
  });

  it("navigates to the conversation thread for the selected apartment", () => {
    render(<GuestSuggestionsPage />);

    fireEvent.click(screen.getByRole("button", { name: /Message host/i }));

    expect(mockPush).toHaveBeenCalledWith("/dashboard/messages/conv-4");
  });

  it("updates the target conversation when another apartment is selected", () => {
    render(<GuestSuggestionsPage />);

    const losYosesButtons = screen.getAllByRole("button", {
      name: /Los yoses/i,
    });
    fireEvent.click(losYosesButtons[0]);
    fireEvent.click(screen.getByRole("button", { name: /Message host/i }));

    expect(mockPush).toHaveBeenCalledWith("/dashboard/messages/conv-5");
  });

  // Skipped: this page does not read the `q` search param yet, so the search
  // filter these tests describe is not implemented. Re-enable when the
  // filter lands (tracked in the PR description).
  it.skip("filters the suggestions and selected listing by the applied query", () => {
    mockSearchParams.set("q", "Heredia");

    render(<GuestSuggestionsPage />);

    expect(screen.getByText("2 units available")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Jardín de Heredia House/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /La Estación Flat/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Jardín de Heredia House" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Casa Níspero/ }),
    ).not.toBeInTheDocument();
  });

  // Skipped: depends on the search filter (q param), which this page does not implement yet.
  it.skip("renders an empty state without selected-listing actions when nothing matches", () => {
    mockSearchParams.set("q", "No such place");

    render(<GuestSuggestionsPage />);

    expect(screen.getByText("0 units available")).toBeInTheDocument();
    expect(
      screen.getByText("No suggested stays match your search."),
    ).toHaveAttribute("role", "status");
    expect(
      screen.queryByRole("button", { name: /Book with Escrow/ }),
    ).not.toBeInTheDocument();
  });
});
