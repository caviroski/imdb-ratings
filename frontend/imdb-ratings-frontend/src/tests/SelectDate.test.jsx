import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SelectDate from "../components/SelectDate";

describe("SelectDate", () => { 
  test("renders SelectDate component", () => {
    render(<SelectDate selectedDate={new Date()} onDateChange={() => {}} />);

    expect(screen.getByLabelText(/select date/i)).toBeInTheDocument();
  });

  test("renders options correctly", async () => {
    const options = [
      { value: "2023-01-01", label: "January 1, 2023" },
      { value: "2023-02-01", label: "February 1, 2023" },
    ];

    await act(async () => {
      render(
        <SelectDate
          value=""
          onChange={() => {}}
          options={options}
        />
      );
    });

    await act(async () => {
      userEvent.click(screen.getByRole("combobox"));
    });

    expect(screen.getByText("January 1, 2023")).toBeInTheDocument();
    expect(screen.getByText("February 1, 2023")).toBeInTheDocument();
  });
});