import React from 'react';
import Table, { Column } from '../Base/Table';

type User = {
  id: string; // UUID string
  name: string;
  isAdmin: boolean;
  details: { age: number; city: string };
};

const users: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Budi',
    isAdmin: true,
    details: { age: 25, city: 'Jakarta' },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Sari',
    isAdmin: false,
    details: { age: 30, city: 'Bandung' },
  },
];

const columns: Column<User>[] = [
  { header: 'ID', key: 'id' },
  { header: 'Name', key: 'name' },
  {
    header: 'Admin',
    key: 'isAdmin',
    render: (value) => {
      return value ? 'yes' : 'no'
    }
  },
  {
    header: 'Details',
    key: 'details',
    render: (value) => {
      if (
        typeof value === 'object' &&
        value !== null &&
        'age' in value &&
        'city' in value
      ) {
        const details = value as { age: number; city: string };
        return `${details.age} years old, from ${details.city}`;
      }
      return 'Unknown details';
    }
  },
];

const Product = () => {
  return (
    <div>
      <Table columns={columns} data={users} />
    </div>
  );
};

export default Product;
