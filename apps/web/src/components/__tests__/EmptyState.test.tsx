import { render, screen } from '@testing-library/react';
import React from 'react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders title, description, and action', () => {
    render(
      <EmptyState
        title="No automations yet"
        description="Create your first automation to get started."
        action={<button type="button">Create automation</button>}
      />,
    );

    expect(screen.getByText('No automations yet')).toBeInTheDocument();
    expect(
      screen.getByText('Create your first automation to get started.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create automation' }),
    ).toBeInTheDocument();
  });
});
