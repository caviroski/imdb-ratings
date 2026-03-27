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

  test('renders map with no data', async () => {
    fetchCountryCounts.mockResolvedValue([]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId('world-map')).toBeInTheDocument();

    const map = screen.getByTestId('choropleth-mock');
    expect(map).toBeInTheDocument();
    const dataProp = JSON.parse(map.textContent);
    expect(dataProp).toEqual([]);
  });

  test('renders map with some data', async () => {
    fetchCountryCounts.mockResolvedValue([
      { country: 'United States', count: 10 },
      { country: 'India', count: 5 }
    ]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId('world-map')).toBeInTheDocument();
    const map = screen.getByTestId('choropleth-mock');
    expect(map).toBeInTheDocument();
    const dataProp = JSON.parse(map.textContent);
    expect(dataProp).toEqual(
      expect.arrayContaining([
        { id: 'USA', value: 10 },
        { id: 'IND', value: 5 }
      ])
    );
  });

  test('renders map with all countries data', async () => {
    const allCountriesData = Object.keys(countryMapping).map((country, index) => ({
      country,
      count: index + 1
    }));
    fetchCountryCounts.mockResolvedValue(allCountriesData);
    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId('world-map')).toBeInTheDocument();
    const map = screen.getByTestId('choropleth-mock');
    expect(map).toBeInTheDocument();
    const dataProp = JSON.parse(map.textContent);
    expect(dataProp.length).toBe(allCountriesData.length);
    allCountriesData.forEach(({ country, count }) => {
      const countryCode = countryMapping[country];
      expect(dataProp).toEqual(
        expect.arrayContaining([
          { id: countryCode, value: count }
        ])
      );
    });
  });

  test('renders map with historical countries data', async () => {
    fetchCountryCounts.mockResolvedValue([
      { country: 'West Germany', count: 10 },
      { country: 'Soviet Union', count: 5 },
      { country: 'Yugoslavia', count: 7 }
    ]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('world-map')).toBeInTheDocument();
    const map = screen.getByTestId('choropleth-mock');
    expect(map).toBeInTheDocument();
    const dataProp = JSON.parse(map.textContent);
    expect(dataProp).toEqual(
      expect.arrayContaining([
        { id: 'DEU', value: 10 },
        { id: 'RUS', value: 5 },
        { id: 'SRB', value: 7 }
      ])
    );
  });

  test('renders map with mixed known and unknown countries data', async () => {
    fetchCountryCounts.mockResolvedValue([
      { country: 'United States', count: 10 },
      { country: 'UnknownCountry1', count: 5 },
      { country: 'India', count: 7 },
      { country: 'UnknownCountry2', count: 3 }
    ]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('world-map')).toBeInTheDocument();
    const map = screen.getByTestId('choropleth-mock');
    expect(map).toBeInTheDocument();
    const dataProp = JSON.parse(map.textContent);
    expect(dataProp).toEqual(
      expect.arrayContaining([
        { id: 'USA', value: 10 },
        { id: 'IND', value: 7 },
        { id: 'UnknownCountry1', value: 5 },
        { id: 'UnknownCountry2', value: 3 }
      ])
    );
  });
});
