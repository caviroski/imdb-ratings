import { render, screen, fireEvent, act } from '@testing-library/react';

import AlertDialog from '../../components/AlertDialog';

describe('AlertDialog', () => {
  const title = 'Test Title';
  const message = 'This is a test message';

  let onClose;
  let onConfirm;

  beforeEach(() => {
    onClose = jest.fn();
    onConfirm = jest.fn();
  });

  test('renders dialog with title and message when open', async () => {
    await act(async () => {
      render(
        <AlertDialog
          open={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title={title}
          message={message}
        />
      );
    });

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/agree/i)).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', async () => {
    await act(async () => {
      render(
        <AlertDialog
          open={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title={title}
          message={message}
        />
      );
    });

    const cancelButton = screen.getByText(/cancel/i);

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onConfirm when Agree button is clicked', async () => {
    await act(async () => {
      render(
        <AlertDialog
          open={true}
          onClose={onClose}
          onConfirm={onConfirm}
          title={title}
          message={message}
        />
      );
    });

    const confirmButton = screen.getByText(/agree/i);
    
    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('does not render dialog when open is false', async () => {
    await act(async () => {
      render(
        <AlertDialog
          open={false}
          onClose={onClose}
          onConfirm={onConfirm}
          title={title}
          message={message}
        />
      );
    });

    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
