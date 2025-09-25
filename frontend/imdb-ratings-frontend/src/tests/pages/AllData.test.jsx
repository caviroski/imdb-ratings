import { render, screen, act, waitFor, within, waitForElementToBeRemoved, fireEvent } from "@testing-library/react";
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

  test("dropdown opens picks value and closes correctly", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    await act(async () => {
      render(<AllData />);
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
    );
    
    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));
    userEvent.click(screen.getByText("01.01.2010"));

    let popover = document.querySelector('.MuiPopover-root');

    const menu = within(popover).getByRole('listbox');
    expect(within(menu).queryByText("01.01.2010")).toBeInTheDocument();
    expect(within(menu).queryByText("02.01.2010")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => document.querySelector('.MuiPopover-root'));
    expect(document.querySelector('.MuiPopover-root')).not.toBeInTheDocument();

    expect(screen.queryByText("01.01.2010")).toBeInTheDocument();
    expect(screen.queryByText("02.01.2010")).not.toBeInTheDocument();
  });

  test("dropdown opens and closes correctly", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    await act(async () => {
      render(<AllData />);
    });

    await waitFor(() =>
      expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
    );
    
    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));

    expect(screen.queryByText("01.01.2010")).toBeInTheDocument();
    expect(screen.queryByText("02.01.2010")).toBeInTheDocument();

    fireEvent.click(screen.getByRole('presentation').firstChild);

    await waitForElementToBeRemoved(() => document.querySelector('.MuiPopover-root'));

    expect(document.querySelector('.MuiPopover-root')).not.toBeInTheDocument();

    let option = screen.queryByText("01.01.2010");
    expect(option).not.toBeInTheDocument();
    option = screen.queryByText("02.01.2010");
    expect(option).not.toBeInTheDocument();
  });

  test("check if there are 3 rows of data", async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockRatings = [
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
      },
      {
        id: 2,
        const: "tt7654321",
        yourRating: 9,
        dateRated: "01.01.2010",
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
      },
      {
        id: 3,
        const: "tt1111111",
        yourRating: 7,
        dateRated: "01.01.2010",
        title: "Test Movie 3",
        originalTitle: "Original Test Movie 3",
        url: "https://imdb.com/title/tt1111111",
        titleType: "movie",
        imdbRating: 6.5,
        runtime: 110,
        year: 2009,
        genres: "Comedy",
        numVotes: 1500,
        releaseDate: "2009-01-01",
        directors: "Alice Johnson"
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

    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));
    userEvent.click(screen.getByText("01.01.2010"));

    await waitFor(() =>
      expect(screen.getByText("Test Movie 1")).toBeInTheDocument()
    );

    const rows = screen.getAllByRole('row');
    // There should be 4 rows: 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  test("check if there are 0 rows of data", async () => {
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
    userEvent.click(screen.getByText("01.01.2010"));

    await waitFor(() =>
      expect(screen.getByText(/No rows/i)).toBeInTheDocument()
    );

    await waitFor(() => {
      // header row always exists
      expect(screen.getAllByRole('row')[0]).toBeInTheDocument();
    });

    const rows = screen.queryAllByRole('row');
    // There should be only 1 row: the header row, since there are no data rows
    expect(rows).toHaveLength(1);
  });

  test("check if correct columns are rendered", async () => {
    const mockDates = ["01.01.2010"];
    const mockRatings = [
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
    fetchDates.mockImplementationOnce((setDate) => setDate(mockDates));
    fetchRatingsByDate.mockImplementationOnce((setDataRows, date) =>
      setDataRows(mockRatings)
    );
    
    await act(async () => {
      render(<AllData />);
    }
    );

    await waitFor(() =>
      expect(screen.getByLabelText(/Pick Date/i)).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole('combobox', { name: /pick date/i }));
    userEvent.click(screen.getByText("01.01.2010"));
    await waitFor(() =>
      expect(screen.getByText("Test Movie 1")).toBeInTheDocument()
    );
    expect(screen.getByRole('columnheader', { name: 'Const' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Your Rating' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Date Rated' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Original Title' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'URL' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Title Type' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'IMDb Rating' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Runtime (mins)' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Year' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Genres' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Num Votes' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Release Date' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Directors' })).toBeInTheDocument();
  });
});
