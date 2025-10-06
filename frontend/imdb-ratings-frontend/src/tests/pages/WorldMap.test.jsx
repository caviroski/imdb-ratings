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

describe('WorldMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders', async () => {
    fetchCountryCounts.mockResolvedValue([]);

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });
  });

  it('maps country names correctly using countryMapping', async () => {
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

  it('renders map container with correct size', async () => {
    fetchCountryCounts.mockResolvedValue([]);

    const { container } = render(<WorldMap />);

    await waitFor(() => {
        expect(fetchCountryCounts).toHaveBeenCalledTimes(1);
    });

    const mapDiv = container.querySelector('div');
    expect(mapDiv).toHaveStyle({ height: '600px', width: '100%' });
    });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchCountryCounts.mockRejectedValue(new Error('API error'));

    render(<WorldMap />);

    await waitFor(() => {
      expect(fetchCountryCounts).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
