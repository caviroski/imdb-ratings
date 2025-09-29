import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";

import UploadButton from "../../components/UploadButton";

describe("UploadButton", () => {
  test("renders UploadButton component", async () => {
    await act(async () => {
      render(<UploadButton onUploadSuccess={() => {}} />);
    });

    expect(screen.getByText(/upload/i)).toBeInTheDocument();
  });

  test("button click triggers file input click", async () => {
    await act(async () => {
      render(<UploadButton onUploadSuccess={() => {}} />);
    });
    const button = screen.getByText(/upload/i);
    const fileInput = screen.getByRole("button");
    vi.spyOn(fileInput, "click");

    await act(async () => {
      button.click();
    });
    expect(fileInput.click).toHaveBeenCalled();
  });

  test("shows snackbar on invalid file upload", async () => {
    await act(async () => {
      render(<UploadButton onUploadSuccess={() => {}} />);
    });
    const fileInput = screen.getByTestId('file-input');
    const badFile = new File(['hello'], 'badfile.txt', { type: 'text/plain' });

    // Override the read-only files property
    Object.defineProperty(fileInput, 'files', {value: [badFile], writable: false});

    fireEvent.change(fileInput);
    const snackbar = await waitFor(() => screen.getByTestId('snackbar'));

    expect(snackbar).toHaveTextContent('Please upload a valid CSV file.');
  });

  test("shows snackbar on invalid date format in filename", async () => {
    await act(async () => {
      render(<UploadButton onUploadSuccess={() => {}} />);
    });
    const fileInput = screen.getByTestId('file-input');
    const badDateFile = new File(['name,date\nMovie,2023-01-01'], 'invalid_date.csv', { type: 'text/csv' });
    Object.defineProperty(fileInput, 'files', {value: [badDateFile], writable: false});

    fireEvent.change(fileInput);
    const snackbar = await waitFor(() => screen.getByTestId('snackbar'));
    expect(snackbar).toHaveTextContent('Please upload file with valid date format dd.mm.yyyy.');
  });

  test("calls onUploadSuccess on valid file upload", async () => {
    const mockUploadSuccess = vi.fn();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('Success'),
      })
    );
    await act(async () => {
      render(<UploadButton onUploadSuccess={mockUploadSuccess} />);
    });
    const fileInput = screen.getByTestId('file-input');
    const goodFile = new File(['name,date\nMovie,2023-01-01'], '15.08.2023.csv', { type: 'text/csv' });
    Object.defineProperty(fileInput, 'files', {value: [goodFile], writable: false});
    fireEvent.change(fileInput);

    await waitFor(() => expect(mockUploadSuccess).toHaveBeenCalled());
    const snackbar = await waitFor(() => screen.getByTestId('snackbar'));
    expect(snackbar).toHaveTextContent('Upload successful!');
  });

  test("shows snackbar on upload failure", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false
      })
    );

    await act(async () => {
      render(<UploadButton onUploadSuccess={() => {}} />);
    });
    const fileInput = screen.getByTestId('file-input');
    const goodFile = new File(['name,date\nMovie,2023-01-01'], '15.08.2023.csv', { type: 'text/csv' });
    Object.defineProperty(fileInput, 'files', {value: [goodFile], writable: false});
    fireEvent.change(fileInput);
    const snackbar = await waitFor(() => screen.getByTestId('snackbar'));
    expect(snackbar).toHaveTextContent('Upload failed.');
  });

  test("shows snackbar on fetch error", async () => {
    global.fetch = vi.fn(() => Promise.reject('API is down'));
    await act(async () => {
      render(<UploadButton onUploadSuccess={() => {}} />);
    });
    const fileInput = screen.getByTestId('file-input');
    const goodFile = new File(['name,date\nMovie,2023-01-01'], '15.08.2023.csv', { type: 'text/csv' });
    Object.defineProperty(fileInput, 'files', {value: [goodFile], writable: false});
    fireEvent.change(fileInput);
    const snackbar = await waitFor(() => screen.getByTestId('snackbar'));
    expect(snackbar).toHaveTextContent('Upload failed.');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});
