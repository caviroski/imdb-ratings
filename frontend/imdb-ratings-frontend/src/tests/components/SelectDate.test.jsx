import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";

import SelectDate from "../../components/SelectDate";

describe("SelectDate", () => { 
  test("renders SelectDate component", () => {
    render(<SelectDate />);

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

  test("calls onChange when an option is selected", async () => {
    const options = [
      { value: "2023-01-01", label: "January 1, 2023" },
      { value: "2023-02-01", label: "February 1, 2023" },
    ];
    const handleChange = jest.fn();

    await act(async () => {
      render(
        <SelectDate
          value=""
          onChange={(evt) => handleChange(evt.target.value)}
          options={options}
        />
      );
    });

    await act(async () => {
      userEvent.click(screen.getByRole("combobox"));
    });

    await act(async () => {
      userEvent.click(screen.getByText("February 1, 2023"));
    });

    expect(handleChange).toHaveBeenCalledWith("2023-02-01");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("displays the correct selected value", async () => {
    const options = [
      { value: "2023-01-01", label: "January 1, 2023" },
      { value: "2023-02-01", label: "February 1, 2023" },
    ];
    const selectedValue = "2023-02-01";

    await act(async () => {
      render(
        <SelectDate
          value={selectedValue}
          onChange={() => {}}
          options={options}
        />
      );
    });
    const combobox = screen.getByRole("combobox");
    const selectedOption = within(combobox).getByText("February 1, 2023");
    expect(selectedOption).toBeInTheDocument();
  });

  test("renders with custom label", () => {
    const customLabel = "Choose a Date";
    render(
      <SelectDate
        value=""
        onChange={() => {}}
        label={customLabel}
        options={[]}
      />
    );

    expect(screen.getByLabelText(customLabel)).toBeInTheDocument();
  });
});
