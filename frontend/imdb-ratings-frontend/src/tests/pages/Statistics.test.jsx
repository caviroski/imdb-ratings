import { render, screen, waitFor, within, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Statistics from '../../pages/Statistics';
import { fetchDates } from '../../api/fetchDates';
import { fetchYearlyAverage } from '../../api/fetchYearlyAverage';
import { fetchTitleTypeCounts } from '../../api/fetchTitleTypeCounts';
import { fetchGenreStats } from '../../api/fetchGenreStats';
import { test } from 'vitest';

vi.mock("../../api/fetchDates");
vi.mock("../../api/fetchYearlyAverage");
vi.mock("../../api/fetchTitleTypeCounts");
vi.mock("../../api/fetchGenreStats");

describe('Statistics component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders date select and DataGrid rows after selecting a date', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockYearRows = [
      { id: 1, year: 2000, avgRating: 7.5, itemsNum: 115 },
      { id: 2, year: 2001, avgRating: 7.0, itemsNum: 150 }
    ];
    const mockTitleTypeRows = [
      { id: 1, titleType: 'movie', count: 200 },
      { id: 2, titleType: 'tvSeries', count: 101 }
    ];
    const mockGenreRows = [
      { id: 1, genre: 'Action', count: 120, avgRating: 7.2 },
      { id: 2, genre: 'Comedy', count: 80, avgRating: 6.8 }
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage.mockImplementationOnce((setRows, date) => setRows(mockYearRows));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => setRows(mockTitleTypeRows));
    fetchGenreStats.mockImplementationOnce((setRows, date) => setRows(mockGenreRows));
    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    // Open date select and pick a date
    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));

    // Wait for DataGrids to populate
    await waitFor(() =>
      expect(screen.getByTestId('yearly-average-grid')).toBeInTheDocument() && 
        expect(screen.getByTestId('title-type-counts-grid')).toBeInTheDocument() &&
        expect(screen.getByTestId('genre-stats-grid')).toBeInTheDocument()
    );

    // Check if rows are rendered in Yearly Average DataGrid
    const yearGrid = screen.getByTestId('yearly-average-grid');
    expect(within(yearGrid).getByText('2000')).toBeInTheDocument();
    expect(within(yearGrid).getByText('7.5')).toBeInTheDocument();
    expect(within(yearGrid).getByText('115')).toBeInTheDocument();
    expect(within(yearGrid).getByText('2001')).toBeInTheDocument();
    expect(within(yearGrid).getByText('7')).toBeInTheDocument();
    expect(within(yearGrid).getByText('150')).toBeInTheDocument();
    const yearRows = within(yearGrid).getAllByRole('row');
    expect(yearRows).toHaveLength(3);

    // Check if rows are rendered in Title Type Counts DataGrid
    const titleTypeGrid = screen.getByTestId('title-type-counts-grid');
    expect(within(titleTypeGrid).getByText('movie')).toBeInTheDocument();
    expect(within(titleTypeGrid).getByText('200')).toBeInTheDocument();
    expect(within(titleTypeGrid).getByText('tvSeries')).toBeInTheDocument();
    expect(within(titleTypeGrid).getByText('101')).toBeInTheDocument();
    const titleTypeRows = within(titleTypeGrid).getAllByRole('row');
    expect(titleTypeRows).toHaveLength(3);

    // Check if rows are rendered in Genre Stats DataGrid
    const genreGrid = screen.getByTestId('genre-stats-grid');
    expect(within(genreGrid).getByText('Action')).toBeInTheDocument();
    expect(within(genreGrid).getByText('120')).toBeInTheDocument();
    expect(within(genreGrid).getByText('7.2')).toBeInTheDocument();
    expect(within(genreGrid).getByText('Comedy')).toBeInTheDocument();
    expect(within(genreGrid).getByText('80')).toBeInTheDocument();
    expect(within(genreGrid).getByText('6.8')).toBeInTheDocument();
    const genreRows = within(genreGrid).getAllByRole('row');
    expect(genreRows).toHaveLength(3);
  });

  test('handles fetchDates error gracefully', async () => {
    fetchDates.mockImplementationOnce(() => {
      throw new Error('Failed to fetch dates');
    });

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByText(/Get files dates - Failed to fetch dates/i)).toBeInTheDocument()
    );
  });

  test('handles fetchYearlyAverage error gracefully', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockError = 'Failed to fetch yearly average data';

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage.mockImplementationOnce((setRows, date) => 
      Promise.reject(new Error(mockError))
    );

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByText(/Fetch yearly avarage - Failed to fetch yearly average data/i)).toBeInTheDocument()
    );
  });

  test('handles fetchTitleTypeCounts error gracefully', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockError = 'Failed to fetch title type counts data';
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => 
      Promise.reject(new Error(mockError))
    );

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByText(/Fetch title type - Failed to fetch title type counts data/i)).toBeInTheDocument()
    );
  });

  test('handles fetchGenreStats error gracefully', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockError = 'Failed to fetch genre stats data';
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchGenreStats.mockImplementationOnce((setRows, date) => 
      Promise.reject(new Error(mockError))
    );

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByText(/Fetch genre stats - Failed to fetch genre stats data/i)).toBeInTheDocument()
    );
  });

  test('displays no data message when fetch functions return empty', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockYearRows = [];
    const mockTitleTypeRows = [];
    const mockGenreRows = [];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage.mockImplementationOnce((setRows, date) => setRows(mockYearRows));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => setRows(mockTitleTypeRows));
    fetchGenreStats.mockImplementationOnce((setRows, date) => setRows(mockGenreRows));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));

    // Check each grid individually for no data message
    await waitFor(() => {
      const yearGrid = screen.getByTestId('yearly-average-grid');
      const titleTypeGrid = screen.getByTestId('title-type-counts-grid');
      const genreGrid = screen.getByTestId('genre-stats-grid');

      expect(within(yearGrid).getByText(/No rows/i)).toBeInTheDocument();
      expect(within(titleTypeGrid).getByText(/No rows/i)).toBeInTheDocument();
      expect(within(genreGrid).getByText(/No rows/i)).toBeInTheDocument();
    });
  });

  test('date select contains correct options', async () => {
    const mockDates = ["01.01.2010", "02.01.2010", "03.01.2010"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    mockDates.forEach(date => {
      expect(screen.getByText(date)).toBeInTheDocument();
    });

    // Close the dropdown
    fireEvent.click(screen.getByRole('presentation').firstChild);
    await waitForElementToBeRemoved(() => document.querySelector('.MuiPopover-root'));

    expect(screen.queryByText('01.01.2010')).not.toBeInTheDocument();
  });

  test("check if correct columns are rendered year average", async () => {
    const mockDates = ["01.01.2010"];
    const mockRatings = [
      {
        id: 1,
        year: 2000,
        avgRating: 7.5,
        itemsNum: 115
      }
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage.mockImplementationOnce((setRows, date) => setRows(mockRatings));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByTestId('yearly-average-grid')).toBeInTheDocument()
    );

    const yearGrid = screen.getByTestId('yearly-average-grid');
    const rows = within(yearGrid).getAllByRole('row');
    expect(within(yearGrid).getByText('Year')).toBeInTheDocument();
    expect(within(yearGrid).getByText('Average Rating')).toBeInTheDocument();
    expect(within(yearGrid).getByText('Count')).toBeInTheDocument();
    expect(rows[0]).toHaveTextContent('YearAverage RatingCount');
    expect(rows[1]).toHaveTextContent('20007.5115');
    expect(rows).toHaveLength(2);
  });

  test("check if correct columns are rendered title type counts", async () => {
    const mockDates = ["01.01.2010"];
    const mockRatings = [
      {
        id: 1,
        titleType: 'movie',
        count: 200
      }
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => setRows(mockRatings));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByTestId('title-type-counts-grid')).toBeInTheDocument()
    );

    const titleTypeGrid = screen.getByTestId('title-type-counts-grid');
    const rows = within(titleTypeGrid).getAllByRole('row');
    expect(within(titleTypeGrid).getByText('Title Type')).toBeInTheDocument();
    expect(within(titleTypeGrid).getByText('Count')).toBeInTheDocument();
    expect(rows[0]).toHaveTextContent('Title TypeCount');
    expect(rows[1]).toHaveTextContent('movie200');
    expect(rows).toHaveLength(2);
  });

  test("check if correct columns are rendered genre stats", async () => {
    const mockDates = ["01.01.2010"];
    const mockRatings = [
      {
        id: 1,
        genre: 'Action',
        count: 120,
        avgRating: 7.2
      }
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchGenreStats.mockImplementationOnce((setRows, date) => setRows(mockRatings));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByTestId('genre-stats-grid')).toBeInTheDocument()
    );
    const genreGrid = screen.getByTestId('genre-stats-grid');
    const rows = within(genreGrid).getAllByRole('row');
    expect(within(genreGrid).getByText('Genre')).toBeInTheDocument();
    expect(within(genreGrid).getByText('Count')).toBeInTheDocument();
    expect(within(genreGrid).getByText('Average Rating')).toBeInTheDocument();
    expect(rows[0]).toHaveTextContent('GenreCountAverage Rating');
    expect(rows[1]).toHaveTextContent('Action1207.2');
    expect(rows).toHaveLength(2);
  });

  test('handles no dates available', async () => {
    const mockDates = [];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    expect(screen.queryByRole('option')).not.toBeInTheDocument();

    // Close the dropdown
    fireEvent.click(screen.getByRole('presentation').firstChild);
    await waitForElementToBeRemoved(() => document.querySelector('.MuiPopover-root'));

    expect(screen.queryByText('01.01.2010')).not.toBeInTheDocument();
  });

  test('handles no data for selected date', async () => {
    const mockDates = ["01.01.2010"];
    const mockYearRows = [];
    const mockTitleTypeRows = [];
    const mockGenreRows = [];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));

    fetchYearlyAverage.mockImplementationOnce((setRows, date) => setRows(mockYearRows));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => setRows(mockTitleTypeRows));
    fetchGenreStats.mockImplementationOnce((setRows, date) => setRows(mockGenreRows));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByTestId('yearly-average-grid')).toBeInTheDocument() && 
        expect(screen.getByTestId('title-type-counts-grid')).toBeInTheDocument() &&
        expect(screen.getByTestId('genre-stats-grid')).toBeInTheDocument()
    );

    // Check if no rows message is rendered in Yearly Average DataGrid
    const yearGrid = screen.getByTestId('yearly-average-grid');
    expect(within(yearGrid).getByText(/No rows/i)).toBeInTheDocument();
    const yearRows = within(yearGrid).getAllByRole('row');
    expect(yearRows).toHaveLength(1);

    // Check if no rows message is rendered in Title Type Counts DataGrid
    const titleTypeGrid = screen.getByTestId('title-type-counts-grid');
    expect(within(titleTypeGrid).getByText(/No rows/i)).toBeInTheDocument();
    const titleTypeRows = within(titleTypeGrid).getAllByRole('row');
    expect(titleTypeRows).toHaveLength(1);

    // Check if no rows message is rendered in Genre Stats DataGrid
    const genreGrid = screen.getByTestId('genre-stats-grid');
    expect(within(genreGrid).getByText(/No rows/i)).toBeInTheDocument();
    const genreRows = within(genreGrid).getAllByRole('row');
    expect(genreRows).toHaveLength(1);
  });

  test('handles rapid date changes', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockYearRowsDate1 = [
      { id: 1, year: 2000, avgRating: 7.5, itemsNum: 115 }
    ];
    const mockYearRowsDate2 = [
      { id: 1, year: 2001, avgRating: 7.1, itemsNum: 150 }
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage
      .mockImplementationOnce((setRows, date) => setRows(mockYearRowsDate1))
      .mockImplementationOnce((setRows, date) => setRows(mockYearRowsDate2));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('02.01.2010'));

    await waitFor(() =>
      expect(screen.getByTestId('yearly-average-grid')).toBeInTheDocument()
    );

    const yearGrid = screen.getByTestId('yearly-average-grid');
    const rows = within(yearGrid).getAllByRole('row');
    expect(within(yearGrid).getByText('2001')).toBeInTheDocument();
    expect(within(yearGrid).getByText('7.1')).toBeInTheDocument();
    expect(within(yearGrid).getByText('150')).toBeInTheDocument();
    expect(rows[0]).toHaveTextContent('YearAverage RatingCount');
    expect(rows[1]).toHaveTextContent('20017.1150');
    expect(rows).toHaveLength(2);
  });

  test('snapshot test', async () => {
    const mockDates = ["01.01.2010"];
    const mockYearRows = [
      { id: 1, year: 2000, avgRating: 7.5, itemsNum: 115 }
    ];
    const mockTitleTypeRows = [
      { id: 1, titleType: 'movie', count: 200 }
    ];
    const mockGenreRows = [
      { id: 1, genre: 'Action', count: 120, avgRating: 7.2 }
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage.mockImplementationOnce((setRows, date) => setRows(mockYearRows));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => setRows(mockTitleTypeRows));
    fetchGenreStats.mockImplementationOnce((setRows, date) => setRows(mockGenreRows));

    const { asFragment } = render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByTestId('yearly-average-grid')).toBeInTheDocument() && 
        expect(screen.getByTestId('title-type-counts-grid')).toBeInTheDocument() &&
        expect(screen.getByTestId('genre-stats-grid')).toBeInTheDocument()
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('read data from the three tables', async () => {
    const mockDates = ["01.01.2010"];
    const mockYearRows = [
      { id: 1, year: 2000, avgRating: 7.5, itemsNum: 115 }
    ];
    const mockTitleTypeRows = [
      { id: 1, titleType: 'movie', count: 200 }
    ];
    const mockGenreRows = [
      { id: 1, genre: 'Action', count: 120, avgRating: 7.2 }
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage.mockImplementationOnce((setRows, date) => setRows(mockYearRows));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => setRows(mockTitleTypeRows));
    fetchGenreStats.mockImplementationOnce((setRows, date) => setRows(mockGenreRows));

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByTestId('yearly-average-grid')).toBeInTheDocument() && 
        expect(screen.getByTestId('title-type-counts-grid')).toBeInTheDocument() &&
        expect(screen.getByTestId('genre-stats-grid')).toBeInTheDocument()
    );

    const yearGrid = screen.getByTestId('yearly-average-grid');
    const yearRows = within(yearGrid).getAllByRole('row');
    expect(within(yearGrid).getByText('2000')).toBeInTheDocument();
    expect(within(yearGrid).getByText('7.5')).toBeInTheDocument();
    expect(within(yearGrid).getByText('115')).toBeInTheDocument();
    expect(yearRows[0]).toHaveTextContent('YearAverage RatingCount');
    expect(yearRows[1]).toHaveTextContent('20007.5115');
    expect(yearRows).toHaveLength(2);

    const titleTypeGrid = screen.getByTestId('title-type-counts-grid');
    const titleTypeRows = within(titleTypeGrid).getAllByRole('row');
    expect(within(titleTypeGrid).getByText('movie')).toBeInTheDocument();
    expect(within(titleTypeGrid).getByText('200')).toBeInTheDocument();
    expect(titleTypeRows[0]).toHaveTextContent('Title TypeCount');
    expect(titleTypeRows[1]).toHaveTextContent('movie200');
    expect(titleTypeRows).toHaveLength(2);

    const genreGrid = screen.getByTestId('genre-stats-grid');
    const genreRows = within(genreGrid).getAllByRole('row');
    expect(within(genreGrid).getByText('Action')).toBeInTheDocument();
    expect(within(genreGrid).getByText('120')).toBeInTheDocument();
    expect(within(genreGrid).getByText('7.2')).toBeInTheDocument();
    expect(genreRows[0]).toHaveTextContent('GenreCountAverage Rating');
    expect(genreRows[1]).toHaveTextContent('Action1207.2');
    expect(genreRows).toHaveLength(2);
  });

  test('read data from two tables and fail to read from the third one', async () => {
    const mockDates = ["01.01.2010"];
    const mockYearRows = [
      { id: 1, year: 2000, avgRating: 7.5, itemsNum: 115 }
    ];
    const mockTitleTypeRows = [
      { id: 1, titleType: 'movie', count: 200 }
    ];
    const mockError = 'Failed to fetch genre stats data';

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearlyAverage.mockImplementationOnce((setRows, date) => setRows(mockYearRows));
    fetchTitleTypeCounts.mockImplementationOnce((setRows, date) => setRows(mockTitleTypeRows));
    fetchGenreStats.mockImplementationOnce((setRows, date) => 
      Promise.reject(new Error(mockError))
    );

    render(<Statistics />);

    await waitFor(() =>
      expect(screen.getByTestId('select-date')).toBeInTheDocument()
    );

    const combobox = screen.getByTestId('select-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));
    await waitFor(() =>
      expect(screen.getByTestId('yearly-average-grid')).toBeInTheDocument() && 
        expect(screen.getByTestId('title-type-counts-grid')).toBeInTheDocument() &&
        expect(screen.getByTestId('genre-stats-grid')).toBeInTheDocument()
    );
    const yearGrid = screen.getByTestId('yearly-average-grid');
    const yearRows = within(yearGrid).getAllByRole('row');
    expect(within(yearGrid).getByText('2000')).toBeInTheDocument();
    expect(within(yearGrid).getByText('7.5')).toBeInTheDocument();
    expect(within(yearGrid).getByText('115')).toBeInTheDocument();
    expect(yearRows[0]).toHaveTextContent('YearAverage RatingCount');
    expect(yearRows[1]).toHaveTextContent('20007.5115');
    expect(yearRows).toHaveLength(2);

    const titleTypeGrid = screen.getByTestId('title-type-counts-grid');
    const titleTypeRows = within(titleTypeGrid).getAllByRole('row');
    expect(within(titleTypeGrid).getByText('movie')).toBeInTheDocument();
    expect(within(titleTypeGrid).getByText('200')).toBeInTheDocument();
    expect(titleTypeRows[0]).toHaveTextContent('Title TypeCount');
    expect(titleTypeRows[1]).toHaveTextContent('movie200');
    expect(titleTypeRows).toHaveLength(2);

    expect(screen.getByText(/Fetch genre stats - Failed to fetch genre stats data/i)).toBeInTheDocument();
  });
});
