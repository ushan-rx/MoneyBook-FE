import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function RecentTransactions() {
  const rows = [
    { key: '1', name: 'John Doe', amount: '$100', date: '2021-10-01' },
    { key: '2', name: 'Jane Doe loan', amount: '$200', date: '2021-10-02' },
    { key: '3', name: 'foods', amount: '$300', date: '2021-10-03' },
    { key: '4', name: 'Junk food', amount: '$400', date: '2021-10-04' },
    { key: '5', name: 'books', amount: '$500', date: '2021-10-05' },
    { key: '6', name: 'Jane Doe borrow', amount: '$600', date: '2021-10-06' },
    { key: '7', name: 'John Smith loan', amount: '$700', date: '2021-10-07' },
    { key: '8', name: 'Jane Smith rent', amount: '$800', date: '2021-10-08' },
    { key: '9', name: 'John Doe', amount: '$900', date: '2021-10-09' },
    { key: '10', name: 'Jane Doe', amount: '$1000', date: '2021-10-10' },
  ];

  return (
    <div className='mx-2 mb-[100px] max-h-[640px] rounded border shadow-inner'>
      <Table aria-label='Recent transactions table'>
        <TableHeader className='bg-primary-50/40 text-base'>
          <TableRow>
            <TableHead className='w-[150px]'>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className='text-right'>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='overflow-y-auto'>
          {rows.map((transaction) => (
            <TableRow key={transaction.key} className='py-1'>
              <TableCell className='font-medium'>{transaction.name}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell className='text-right font-medium'>
                {transaction.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
