import { render, screen, act } from "@testing-library/react";

import AllData from "../../pages/AllData";

describe("AllData", () => {
  test("renders AllData component", async () => {
    await act(async () => {
      render(<AllData />);
    });
    expect(screen.getByText(/All the data from the export/i)).toBeInTheDocument();
    expect(screen.getByTestId("test-select-date")).toBeInTheDocument();
  });

  test("select date dropdown works", async () => {
    await act(async () => {
      render(<AllData />);
    });

    expect(screen.getByTestId("test-select-date")).toHaveValue('');
  });

  test("data grid is in the document", async () => {
    await act(async () => {
      render(<AllData />);
    });
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
