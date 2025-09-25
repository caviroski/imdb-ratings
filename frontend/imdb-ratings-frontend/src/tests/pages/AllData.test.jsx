import { render, screen, act, waitFor } from "@testing-library/react";
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

    userEvent.click(screen.getByLabelText(/Pick Date/i));

    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));

    userEvent.click(screen.getByText("01.01.2010"));

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

    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));

    userEvent.click(screen.getByText("02.01.2010"));

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

    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));

    userEvent.click(screen.getByText("01.01.2010"));
    
    await waitFor(() =>
      expect(screen.getByText(/No rows/i)).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText(/Failed to fetch ratings/i)).toBeInTheDocument()
    );
  });

  test("closes snackbar", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];

    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    fetchRatingsByDate.mockImplementationOnce(() =>
      Promise.reject(new Error("Failed to fetch ratings"))
    );

    await act(async () => {
      render(<AllData />);
    });

    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));

    userEvent.click(screen.getByText("01.01.2010"));

    const snackbarMessage = await screen.findByText(/Failed to fetch ratings/i);
    expect(snackbarMessage).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Failed to fetch ratings/i)).not.toBeInTheDocument(),
      { timeout: 4000 }
    );
  });

  test("no dates available", async () => {
    const mockDates = [];

    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));

    await act(async () => {
      render(<AllData />);
    });

    expect(screen.getByText(/All the data from the export/i)).toBeInTheDocument();
    expect(screen.getByTestId("test-select-date")).toBeInTheDocument();
    expect(screen.getByTestId("test-select-date")).toHaveValue('');
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toHaveTextContent('No rows');
  });

  test("no ratings for selected date", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockRatings = [];

    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    fetchRatingsByDate.mockImplementationOnce((setDataRows, date) =>
      setDataRows(mockRatings)
    );

    await act(async () => {
      render(<AllData />);
    } );

    await waitFor(() =>
      expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));

    userEvent.click(screen.getByText("01.01.2010"));

    await waitFor(() =>
      expect(screen.getByText(/No rows/i)).toBeInTheDocument()
    );
  });

  test("snapshot test", async () => {
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
    
    let container;
    await act(async () => {
      const rendered = render(<AllData />);
      container = rendered.container;
    });
    expect(container).toMatchSnapshot();
  });

  test("user selects date and data updates", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockRatingsDate1 = [
      {
        id: 1,
        const: "tt1234567",
        yourRating: 8,
        dateRated: "01.01.2010",
        title: "Test Movie 1",
        originalTitle: "Original Test Movie 1",
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
    const mockRatingsDate2 = [
      {
        id: 2,
        const: "tt7654321",
        yourRating: 9,
        dateRated: "02.01.2010",
        title: "Test Movie 2",
        originalTitle: "Original Test Movie 2",
        url: "https://imdb.com/title/tt7654321",
        titleType: "movie",
        imdbRating: 8.5,
        runtime: 130,
        year: 2011,
        genres: "Action",
        numVotes: 3000,
        releaseDate: "2011-01-01",
        directors: "Jane Smith"
      }
    ];
    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    fetchRatingsByDate
      .mockImplementationOnce((setDataRows, date) =>
        setDataRows(mockRatingsDate1)
      )
      .mockImplementationOnce((setDataRows, date) =>
        setDataRows(mockRatingsDate2)
      );

    await act(async () => {
      render(<AllData />);
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
    );

    // Select first date
    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));
    userEvent.click(screen.getByText("01.01.2010"));

    await waitFor(() =>
      expect(screen.getByText("Test Movie 1")).toBeInTheDocument()
    );
    expect(screen.getByText("Original Test Movie 1")).toBeInTheDocument();
    expect(screen.queryByText("Original Test Movie 2")).not.toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();

    // Select second date
    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));
    userEvent.click(screen.getByText("02.01.2010"));

    await waitFor(() =>
      expect(screen.getByText("Test Movie 2")).toBeInTheDocument()
    );
    expect(screen.getByText("Original Test Movie 2")).toBeInTheDocument();
    expect(screen.queryByText("Original Test Movie 1")).not.toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  // test("dropdown opens and closes correctly", async () => {
  //   jest.useFakeTimers();

  //   const mockDates = ["01.01.2010", "02.01.2010"];
  //   fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
  //   await act(async () => {
  //     render(<AllData />);
  //   });

  //   await waitFor(() =>
  //     expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
  //   );
  //   const dropdown = screen.getByLabelText(/Pick Date/i);

  //   // Open dropdown
  //   await act(async () => {
  //     userEvent.click(dropdown);
  //   });

  //   let popover = document.querySelector('.MuiPopover-root'); // your portal root
  //   const menu = within(popover).getByRole('listbox');
  //   expect(within(menu).queryByText("01.01.2010")).toBeInTheDocument();
  //   expect(within(menu).queryByText("02.01.2010")).toBeInTheDocument();
  //   // expect(screen.getByText("02.01.2010")).toBeInTheDocument();

  //   await act(async () => userEvent.click(dropdown));
  //   // await waitForElementToBeRemoved(() => screen.queryByText("01.01.2010"), { timeout: 2000 });

  //   fireEvent.click(document.body);
  //     await act(async () => {
  //       fireEvent.click(document.body);
  //       jest.advanceTimersByTime(3000); // simulate clicking outside
  //     });
  //     await act(async () => {
  //   fireEvent.keyDown(dropdown, { key: "Escape" });
  // });
  //   await act(async () => {
  //     jest.advanceTimersByTime(30000); // Advance by 1 second
  //     await Promise.resolve();
  //   });
  //   await waitForElementToBeRemoved(() => document.querySelector('.MuiPopover-root'));
  //   popover = document.querySelector('.MuiPopover-root'); // your portal root
  //   console.log(popover.outerHTML);

  //   // // Assert visibility instead of removal
  //   // console.log(screen.queryByText("01.01.2010").parentNode.parentNode.parentNode.parentNode.outerHTML);
  //   // expect(screen.queryByText("01.01.2010")).not.toBeVisible();
  //   // await waitForElementToBeRemoved(() => screen.queryByRole("listbox"));
  //   // expect(screen.queryByText("02.01.2010")).not.toBeVisible();
  // });
});
