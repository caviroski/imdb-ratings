import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Upload from '../../pages/Upload';
import { fetchDates } from '../../api/fetchDates';
import { fillCountries, stopFillCountries } from '../../api/fillCountries';
import { deleteFileByName } from '../../api/deleteFileByName';
import { expectSnackbar } from '../utils/snackbarUtils';

vi.mock('../../api/fetchDates');
vi.mock('../../api/fillCountries');
vi.mock('../../api/deleteFileByName');

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(""),
  })
);

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

  test("fill countries button works", async () => {
    const mockDates = ["01.01.2010", "02.02.2020"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fillCountries.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    stopFillCountries.mockResolvedValue();

    render(<Upload />);

    const fillButton = screen.getByTestId("fill-countries-button");
    const stopButton = screen.getByTestId("stop-fill-countries-button");
    expect(fillButton).toBeEnabled();
    expect(stopButton).toBeEnabled();
    expect(fillButton).toHaveTextContent("Fill Missing Countries");

    await userEvent.click(fillButton);
    await waitFor(() => {
      expect(fillButton).toBeDisabled();
      expect(fillButton).toHaveTextContent("Filling...");
      expect(fillCountries).toHaveBeenCalledTimes(1);
    });
    await userEvent.click(stopButton);
    await waitFor(() => {
      expect(fillButton).toBeEnabled();
      expect(fillButton).toHaveTextContent("Fill Missing Countries");
      expect(stopFillCountries).toHaveBeenCalledTimes(1);
    });
  });

  test("delete file works", async () => {
    const mockDates = ["01.01.2010", "02.02.2020"];
    fetchDates
      .mockImplementationOnce((setDates) => setDates(mockDates)) 
      .mockImplementationOnce((setDates) => setDates(["02.02.2020"]));
    deleteFileByName.mockResolvedValue("File deleted successfully.");

    render(<Upload />);

    const firstFile = screen.getByText("01.01.2010");
    expect(firstFile).toBeInTheDocument();
    const deleteButton = screen.getByTestId("delete-button-01.01.2010");
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(screen.getByText("Are you sure you want to delete all the entries from 01.01.2010?")).toBeInTheDocument();

    const confirmButton = screen.getByText("Agree");
    await userEvent.click(confirmButton);
    expect(deleteFileByName).toHaveBeenCalledWith("01.01.2010");
    expect(fetchDates).toHaveBeenCalledTimes(2); // once on initial render, once after deletion

    await waitFor(() => {
      expect(screen.queryByText("01.01.2010")).not.toBeInTheDocument();
      expect(screen.getByText("02.02.2020")).toBeInTheDocument();
    });
  });

  test("snackbar closes", async () => {
    const mockDates = ["02.02.2020"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));

    render(<Upload />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["dummy content"], "01.01.2010.csv", {
      type: "text/csv",
    });

    await userEvent.upload(fileInput, file);

    await expectSnackbar({ textPattern: /Upload successful!/i, color: /(rgb\(68, 189, 50\)|#44bd32)/ });
  });

  test("snackbar shows error on upload failure", async () => {
    const mockDates = ["02.02.2020"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));

    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Upload failed"))
    );

    render(<Upload />);

    const fileInput = screen.getByTestId("file-input");
    const file = new File(["dummy content"], "01.01.2010.csv", {
      type: "text/csv",
    });

    await userEvent.upload(fileInput, file);

    await expectSnackbar({ textPattern: /Upload failed/i, color: /(rgb\(231, 76, 60\)|#e74c3c)/ });
  });

  test("shows error snackbar if fetchDates fails", async () => {
    fetchDates.mockImplementationOnce(() => {
      throw new Error("Fetch dates failed");
    });

    render(<Upload />);

    await expectSnackbar({ textPattern: /Get files dates - Fetch dates failed/i, color: /(rgb\(232, 65, 24\)|#e84118)/ });
  });

  test("shows error snackbar if deleteFileByName fails", async () => {
    const mockDates = ["01.01.2010"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    deleteFileByName.mockRejectedValue(new Error("Delete failed"));

    render(<Upload />);

    const deleteButton = screen.getByTestId("delete-button-01.01.2010");
    await userEvent.click(deleteButton);
    const confirmButton = screen.getByText("Agree");
    await userEvent.click(confirmButton);

    await expectSnackbar({ textPattern: /Failed to delete entry/i, color: /(rgb\(231, 76, 60\)|#e74c3c)/ });
  });

  test("shows error snackbar if fillCountries fails", async () => {
    const mockDates = ["01.01.2010"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    fillCountries.mockRejectedValue(new Error("Fill countries failed"));

    render(<Upload />);

    const fillButton = screen.getByTestId("fill-countries-button");
    await userEvent.click(fillButton);
    await expectSnackbar({ textPattern: /Failed to fill missing countries - Fill countries failed/i, color: /(rgb\(231, 76, 60\)|#e74c3c)/ });
  });

  test("shows error snackbar if stopFillCountries fails", async () => {
    const mockDates = ["01.01.2010"];
    fetchDates.mockImplementationOnce((setDates) => setDates(mockDates));
    stopFillCountries.mockRejectedValue(new Error("Stop fill countries failed"));

    render(<Upload />);

    const stopButton = screen.getByTestId("stop-fill-countries-button");
    await userEvent.click(stopButton);
    await expectSnackbar({ textPattern: /Failed to stop filling countries - Stop fill countries failed/i, color: /(rgb\(231, 76, 60\)|#e74c3c)/ });
  });

  test("loading indicator appears during fetch", async () => {
    const fillPromise = new Promise(() => {});
    fillCountries.mockReturnValue(fillPromise);

    render(<Upload />);

    const button = screen.getByTestId("fill-countries-button");
    await userEvent.click(button);

    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();

    fillCountries.mockRejectedValue(new Error("cancelled"));
  });

  test("loading indicator disappears after fetch", async () => {
    const fillPromise = new Promise((resolve) => setTimeout(() => resolve(), 100));
    fillCountries.mockReturnValue(fillPromise);

    render(<Upload />);

    const button = screen.getByTestId("fill-countries-button");
    await userEvent.click(button);
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByTestId("loading-indicator"), { timeout: 2000 });
    expect(screen.queryByTestId("loading-indicator")).not.toBeInTheDocument();
  });
});
