import { render, screen, act, fireEvent } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import AllData from "../../pages/AllData";
import { fetchDates } from "../../api/fetchDates";
import { fetchRatingsByDate } from "../../api/fetchRatingsByDate";

jest.mock("../../api/fetchDates");
jest.mock("../../api/fetchRatingsByDate");

describe("AllData", () => {
  test("renders AllData component", async () => {
    await act(async () => {
      render(<AllData />);
    });
    expect(screen.getByText(/All the data from the export/i)).toBeInTheDocument();
    expect(screen.getByTestId("test-select-date")).toBeInTheDocument();
    expect(screen.getByTestId("test-select-date")).toHaveValue('');
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toHaveTextContent('No rows');
  });

  test("renders AllData component with preselected date", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockRatings = [
      {
        id: 1,
        const: "tt1234567",
        yourRating: 8,
        dateRated: "01.01.2010",
        title: "Test Movie",
        originalTitle: "Original Test Movie",
        url: "https://imdb.com/title/tt1234567",
        titleType: "movie",
        imdbRating: 7.5,
        runtime: 120,
        year: 2010,
        genres: "Drama",
        numVotes: 2000,
        releaseDate: "2010-01-01",
        directors: "John Doe"
      }
    ];

    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    fetchRatingsByDate.mockImplementationOnce((setDataRows, date) =>
      setDataRows(mockRatings)
    );

    await act(async () => {
      render(<AllData />);
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
    );

    await act(async () => {
      userEvent.click(screen.getByLabelText(/Pick Date/i));
    });

    await act(async () => {
      userEvent.click(screen.getByText("01.01.2010"));
    });

    await waitFor(() =>
      expect(screen.getByText("Test Movie")).toBeInTheDocument()
    );

    expect(screen.getByText("Original Test Movie")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
  });

  test("handles no data for selected date", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockRatings = [];

    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    fetchRatingsByDate.mockImplementationOnce((setDataRows, date) =>
      setDataRows(mockRatings)
    );

    await act(async () => {
      render(<AllData />);
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
    );

    await act(async () => {
      userEvent.click(screen.getByLabelText(/Pick Date/i));
    });

    await act(async () => {
      userEvent.click(screen.getByText("02.01.2010"));
    });

    await waitFor(() =>
      expect(screen.getByText(/No rows/i)).toBeInTheDocument()
    );
  });

  test("handles fetchDates error", async () => {
    fetchDates.mockImplementationOnce(() => Promise.reject(new Error("Failed to fetch dates")));

    await act(async () => {
      render(<AllData />);
    });

    expect(screen.getByText(/All the data from the export/i)).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toHaveTextContent('No rows');
  });

  test("handles fetchRatingsByDate error", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];

    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    fetchRatingsByDate.mockImplementationOnce(() => Promise.reject(new Error("Failed to fetch ratings")));

    await act(async () => {
      render(<AllData />);
    });

    await act(async () => {
      userEvent.click(screen.getByLabelText(/Pick Date/i));
    });

    await act(async () => {
      userEvent.click(screen.getByText("01.01.2010"));
    });
    
    await waitFor(() =>
      expect(screen.getByText(/No rows/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/Failed to fetch ratings/i)).toBeInTheDocument()
    );
  });
});
