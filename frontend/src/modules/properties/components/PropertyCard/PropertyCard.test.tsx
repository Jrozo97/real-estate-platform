import { render, screen } from '@testing-library/react';
import PropertyCard from './PropertyCard';
import { Property } from '../../types/properties';
import React from 'react';


const mockProperty: Property = {
  id: 'P-001',
  name: 'Casa San Martín',
  address: 'Cra 15 #45-10, Bogotá',
  price: 500000000,
  codeInternal: 'C-001',
  year: 2017,
  owner: { id: 'O-100', name: 'Juan Pérez', address: 'Bogotá', photo: '', birthday: '1990-01-01T00:00:00Z' },
  images: [{ id: 'PI-001', file: 'https://picsum.photos/seed/p-001a/800/600', enabled: true }],
  traces: [],
};

describe('PropertyCard', () => {
  it('renderiza nombre, dirección, precio e imagen principal', () => {
    render(<PropertyCard p={mockProperty} />);

    expect(screen.getByRole('heading', { name: /casa san martín/i })).toBeInTheDocument();
    expect(screen.getByText(/bogotá/i)).toBeInTheDocument();
    expect(screen.getByText(/\$?500\.000\.000/)).toBeInTheDocument();

    const img = screen.getByRole('img', { name: /casa san martín/i });
    expect(img).toHaveAttribute('src', mockProperty.images[0].file);
  });
});


