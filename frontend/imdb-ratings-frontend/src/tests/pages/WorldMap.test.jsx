import { render, screen, waitFor } from '@testing-library/react';

import WorldMap, { countryMapping } from '../../pages/WorldMap';
import { fetchCountryCounts } from '../../api/fetchCountryCounts';

vi.mock('../../api/fetchCountryCounts');
vi.mock('../../data/world_countries.json', () => ({
  default: {
    features: [
      { id: 'DEU', properties: { name: 'Germany' } },
      { id: 'USA', properties: { name: 'United States' } },
      { id: 'IND', properties: { name: 'India' } }
    ]
  }
}));
vi.mock('@nivo/geo', () => ({
  ResponsiveChoropleth: vi.fn(({ data }) => (
    <div data-testid="choropleth-mock">{JSON.stringify(data)}</div>
  ))
}));

describe('WorldMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders', async () => {
    fetchCountryCounts.mockResolvedValue([]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });
  });

  test('maps country names correctly using countryMapping', async () => {
    fetchCountryCounts.mockResolvedValue([
      { country: 'United States', count: 10 },
      { country: 'India', count: 5 },
      { country: 'Germany', count: 7 }
    ]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });

    expect(countryMapping['United States']).toBe('USA');
    expect(countryMapping['India']).toBe('IND');
    expect(countryMapping['Germany']).toBe('DEU');
  });

  test('renders map container with correct size', async () => {
    fetchCountryCounts.mockResolvedValue([]);

    const { container } = render(<WorldMap />);

    await waitFor(() => {
        expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });

    const mapDiv = container.querySelector('div');
    expect(mapDiv).toHaveStyle({ height: '600px', width: '100%' });
    });

  test('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchCountryCounts.mockRejectedValue(new Error('API error'));

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles empty data from API', async () => {
    fetchCountryCounts.mockResolvedValue([]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('world-map')).toBeInTheDocument();
  });

  test('handles large data sets from API', async () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({ country: `Country${i}`, count: i }));
    fetchCountryCounts.mockResolvedValue(largeData);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId('world-map')).toBeInTheDocument();
  });

  test('handles unknown countries in data', async () => {
    fetchCountryCounts.mockResolvedValue([
      { country: 'UnknownCountry', count: 10 },
      { country: 'India', count: 5 }
    ]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });

    const map = screen.getByTestId('choropleth-mock');
    expect(map).toBeInTheDocument();

    const dataProp = JSON.parse(map.textContent);

    expect(dataProp).toEqual(
      expect.arrayContaining([
        { id: 'IND', value: 5 }
      ])
    );

    expect(dataProp).toEqual(
      expect.arrayContaining([
        { id: 'UnknownCountry', value: 10 }
      ])
    );
  });
});
