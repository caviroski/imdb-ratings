import { render, screen, waitFor, within, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Upload from '../../pages/Upload';
import { fetchDates } from '../../api/fetchDates';
import { fillCountries, stopFillCountries } from '../../api/fillCountries';
import { deleteFileByName } from '../../api/deleteFileByName';
import { test } from 'vitest';

vi.mock('../../api/fetchDates');
vi.mock('../../api/fillCountries');
vi.mock('../../api/deleteFileByName');

describe("Upload page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Upload page", async () => {
    const mockDates = ["01.01.2010", "02.02.2020"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));

    render(<Upload />);

    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Fill Missing Countries")).toBeInTheDocument();
    expect(screen.getByText("Stop filling countries")).toBeInTheDocument();
    expect(screen.getByTestId("fill-countries-button")).toBeInTheDocument();
    expect(screen.getByTestId("stop-fill-countries-button")).toBeInTheDocument();
    expect(screen.getByTestId("files-list")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("01.01.2010")).toBeInTheDocument();
      expect(screen.getByText("02.02.2020")).toBeInTheDocument();
    });
  });
});