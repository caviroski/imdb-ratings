import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Compare from '../../pages/Compare';
import { fetchDates } from '../../api/fetchDates';
import { fetchComparison } from '../../api/fetchComparison';

vi.mock("../../api/fetchDates");
vi.mock("../../api/fetchComparison");


describe('Compare component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders date selects and DataGrid rows after selecting dates', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockRows = [
      {
        id: 1,
        dateRated: '2023-01-01',
        name: 'Movie A',
        link: 'https://imdb.com/title/tt123',
        firstDate: 1000,
        secondDate: 1500,
        difference: 500,
      },
      {
        id: 2,
        dateRated: '2023-01-02',
        name: 'Movie B',
        link: 'https://imdb.com/title/tt456',
        firstDate: 2000,
        secondDate: 2500,
        difference: 500,
      },
    ];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchComparison.mockImplementationOnce((from, to, search, setRows) =>
      setRows(mockRows)
    );

    render(<Compare />);

    await waitFor(() =>
      expect(screen.getByTestId('select-from-date')).toBeInTheDocument()
    );

    // Open first date select and pick a date
    let combobox = screen.getByTestId('select-from-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));

    // Open second date select and pick a date
    combobox = screen.getByTestId('select-to-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('02.01.2010'));

    const grid = await screen.findByRole('grid');
    const rows = within(grid).getAllByRole('row');

    expect(rows).toHaveLength(3);

    expect(within(rows[1]).getByText('Movie A')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Movie B')).toBeInTheDocument();
  });

  test('typing in search triggers fetchComparison', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchComparison.mockImplementationOnce(vi.fn());

    render(<Compare />);

    await waitFor(() =>
      expect(screen.getByTestId('select-from-date')).toBeInTheDocument()
    );

    const searchInput = screen.getByLabelText(/Search/i);
    await userEvent.type(searchInput, 'Movie');

    await userEvent.keyboard('{Enter}');

    expect(fetchComparison).toHaveBeenCalled();
  });

  test('displays error message when fetchComparison fails', async () => {
    const mockDates = ["01.01.2010", "02.01.2010"];
    const mockError = 'Failed to fetch comparison data';

    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchComparison.mockImplementationOnce((from, to, search, setRows, setError) => 
      Promise.reject(new Error(mockError))
    );

    render(<Compare />);

    await waitFor(() =>
      expect(screen.getByTestId('select-from-date')).toBeInTheDocument()
    );

    let combobox = screen.getByTestId('select-from-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('01.01.2010'));

    combobox = screen.getByTestId('select-to-date').closest('.MuiSelect-root');
    await userEvent.click(within(combobox).getByRole('combobox'));
    await userEvent.click(screen.getByText('02.01.2010'));

    await waitFor(() =>
      expect(screen.getByText((content) => content.includes(mockError))).toBeInTheDocument()
    );
  });
});
