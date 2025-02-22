import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HelloWorld from '@/components/HelloWorld';

test('renders name', async () => {
  render(<HelloWorld name="Vitest" />);

  expect(screen.getByText('Hello Vitest x1!')).toBeTruthy();

  const button = screen.getByRole('button', { name: /Increment/i });
  fireEvent.click(button);

  expect(screen.getByText('Hello Vitest x2!')).toBeTruthy();
});
