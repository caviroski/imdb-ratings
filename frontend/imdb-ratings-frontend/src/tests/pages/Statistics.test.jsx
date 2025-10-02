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
});
