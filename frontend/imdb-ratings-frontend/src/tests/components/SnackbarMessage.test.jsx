import { render, screen, act } from "@testing-library/react";

import SnackbarMessage from "../../components/SnackbarMessage";

describe("SnackbarMessage", () => {
  test("renders SnackbarMessage component when open", async () => {
    const message = "This is a test message";

    await act(async () => {
      render(<SnackbarMessage open={true} message={message} onClose={() => {}} />);
    });

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test("does not render SnackbarMessage component when closed", async () => {
    const message = "This is a test message";
    await act(async () => {
      render(<SnackbarMessage open={false} message={message} onClose={() => {}} />);
    });

    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  test("calls onClose when autoHideDuration elapses", async () => {
    jest.useFakeTimers();
    const message = "This is a test message";
    const handleClose = jest.fn();
    await act(async () => {
      render(<SnackbarMessage open={true} message={message} onClose={handleClose} duration={1000} />);
    });

    expect(screen.getByText(message)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
