import { render, screen, waitFor } from '@testing-library/react';

import YearWatch from '../../pages/YearWatch';
import { fetchDates } from '../../api/fetchDates';
import { fetchYearCount } from '../../api/fetchYearCount';
import { expectSnackbar } from '../utils/snackbarUtils';

vi.mock('../../api/fetchDates');
vi.mock('../../api/fetchYearCount');
vi.mock('@mui/x-charts/BarChart', () => ({
  BarChart: vi.fn(() => <div data-testid="bar-chart-mock">BarChart Mock</div>)
}));

describe('YearWatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders', async () => {
    const mockDates = ['01.01.2010', '02.02.2020'];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fetchYearCount.mockImplementationOnce((setDataset, setTotal, date) => {
      setDataset([
        { year: 2000, count: 5 },
        { year: 2010, count: 10 }
      ]);
      setTotal(15);
    });

    render(<YearWatch />);

    expect(screen.getByText('How many enteries are watched from every year shown in linear graph.')).toBeInTheDocument();
    expect(screen.getByTestId('select-date')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart-mock')).toBeInTheDocument();
    const totalText = await screen.findByText('Total watched: 15 items');
    expect(totalText).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchDates).toHaveBeenCalledTimes(1);
      expect(fetchYearCount).toHaveBeenCalledTimes(1);
    });
  });
});
