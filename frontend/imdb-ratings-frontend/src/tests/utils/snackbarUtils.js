import { screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";

export async function expectSnackbar({ textPattern, color }) {
  const snackbar = await screen.findByText(textPattern, { exact: false });
  expect(snackbar).toBeInTheDocument();

  // Check background color
  expect(screen.getByTestId("snackbar")).toHaveStyle({
    backgroundColor: expect.stringMatching(color),
  });

  // Wait for snackbar to close
  await waitForElementToBeRemoved(() => screen.queryByText(textPattern), {
    timeout: 6000,
  });

  await waitFor(() => {
    expect(screen.queryByText(textPattern)).not.toBeInTheDocument();
    expect(screen.queryByTestId("snackbar")).not.toBeInTheDocument();
  });
}
