import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App.jsx';

test('renders navigation links', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Upload File/i)).toBeInTheDocument();
  expect(screen.getByText(/Compare Dates/i)).toBeInTheDocument();
  expect(screen.getByText(/Year Watch/i)).toBeInTheDocument();
  expect(screen.getByText(/Statistics/i)).toBeInTheDocument();
  expect(screen.getByText(/All Data/i)).toBeInTheDocument();
  expect(screen.getByText(/World Map/i)).toBeInTheDocument();
});
