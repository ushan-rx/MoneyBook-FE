'use client';
import React from 'react';
import { ParseMutualTransaction } from '../util/MutualTransactionParser';
import { MutualTransaction } from '@/types/TransactionTypes';
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover';
import DateTimeComponent from '@/components/DateTimeComponent';
import { MutualTransactionType } from '@/enums/TransactionEnums';
import { Divider } from '@heroui/divider';

const transactionList = [
  {
    transactionID: '1a2b3c4d-5e6f-7890-1234-56789abcdef0',
    transactionName: 'Dinner Split',
    description: 'Dinner bill split with friends',
    amount: 45.75,
    transactionDate: '2025-03-12T18:30:00Z',
    transactionType: 'Loan',
    borrowerID: 'user123',
    lenderID: 'user456',
    status: 'Pending',
  },
  {
    transactionID: '2a3b4c5d-6e7f-8901-2345-67890abcdef1',
    transactionName: 'Grocery Reimbursement',
    description: 'Reimbursing friend for grocery shopping',
    amount: 22.5,
    transactionDate: '2025-03-10T14:15:00Z',
    transactionType: 'Borrow',
    borrowerID: 'user789',
    lenderID: 'user321',
    status: 'ACCEPTED',
  },
  {
    transactionID: '3a4b5c6d-7e8f-9012-3456-7890abcdef2',
    transactionName: 'Concert Tickets',
    description: 'Paid for concert tickets',
    amount: 120.0,
    transactionDate: '2025-03-08T12:00:00Z',
    transactionType: 'Loan',
    borrowerID: 'user456',
    lenderID: 'user123',
    status: 'CANCELLED',
  },
  {
    transactionID: '4a5b6c7d-8e9f-0123-4567-8901abcdef3',
    transactionName: 'Car Repair',
    description: 'Covered cost of car repair',
    amount: 300.0,
    transactionDate: '2025-03-07T10:30:00Z',
    transactionType: 'Borrow',
    borrowerID: 'user321',
    lenderID: 'user789',
    status: 'PENDING',
  },
  {
    transactionID: '5a6b7c8d-9e0f-1234-5678-9012abcdef4',
    transactionName: 'Rent Share',
    description: 'Monthly rent shared with roommate',
    amount: 500.0,
    transactionDate: '2025-03-05T08:00:00Z',
    transactionType: 'Loan',
    borrowerID: 'user654',
    lenderID: 'user987',
    status: 'ACCEPTED',
  },
  {
    transactionID: '6a7b8c9d-0e1f-2345-6789-0123abcdef5',
    transactionName: 'Medical Bill',
    description: 'Borrowed money for medical expenses',
    amount: 250.0,
    transactionDate: '2025-03-03T16:45:00Z',
    transactionType: 'Borrow',
    borrowerID: 'user789',
    lenderID: 'user456',
    status: 'CANCELLED',
  },
  {
    transactionID: '7a8b9c0d-1e2f-3456-7890-1234abcdef6',
    transactionName: 'Weekend Getaway',
    description: 'Shared expense for weekend trip',
    amount: 150.0,
    transactionDate: '2025-03-02T11:20:00Z',
    transactionType: 'Loan',
    borrowerID: 'user234',
    lenderID: 'user567',
    status: 'PENDING',
  },
  {
    transactionID: '8a9b0c1d-2e3f-4567-8901-2345abcdef7',
    transactionName: 'Coffee Subscription',
    description: 'Paid for shared coffee subscription',
    amount: 20.0,
    transactionDate: '2025-03-01T09:30:00Z',
    transactionType: 'Borrow',
    borrowerID: 'user345',
    lenderID: 'user678',
    status: 'ACCEPTED',
  },
  {
    transactionID: '9a0b1c2d-3e4f-5678-9012-3456abcdef8',
    transactionName: 'Gift Purchase',
    description: "Gift for a friend's birthday",
    amount: 60.0,
    transactionDate: '2025-02-28T14:00:00Z',
    transactionType: 'Loan',
    borrowerID: 'user678',
    lenderID: 'user345',
    status: 'CANCELLED',
  },
  {
    transactionID: '0a1b2c3d-4e5f-6789-0123-4567abcdef9',
    transactionName: 'Dinner Out',
    description: 'Covered dinner, to be paid back',
    amount: 40.0,
    transactionDate: '2025-02-27T19:15:00Z',
    transactionType: 'Borrow',
    borrowerID: 'user567',
    lenderID: 'user234',
    status: 'PENDING',
  },
  {
    transactionID: '1b2c3d4e-5f6g-7890-1234-5678abcdefa',
    transactionName: 'Utility Bill',
    description: 'Split utility bill',
    amount: 100.0,
    transactionDate: '2025-02-25T08:30:00Z',
    transactionType: 'Loan',
    borrowerID: 'user111',
    lenderID: 'user222',
    status: 'ACCEPTED',
  },
  {
    transactionID: '2b3c4d5e-6f7g-8901-2345-6789abcdefb',
    transactionName: 'Gym Membership',
    description: 'Shared cost for annual gym membership',
    amount: 200.0,
    transactionDate: '2025-02-23T07:45:00Z',
    transactionType: 'Borrow',
    borrowerID: 'user222',
    lenderID: 'user111',
    status: 'CANCELLED',
  },
  {
    transactionID: '3b4c5d6e-7f8g-9012-3456-7890abcdefc',
    transactionName: 'Software Subscription',
    description: 'Paid for team software subscription',
    amount: 30.0,
    transactionDate: '2025-02-21T13:20:00Z',
    transactionType: 'Loan',
    borrowerID: 'user333',
    lenderID: 'user444',
    status: 'CANCELLED',
  },
  {
    transactionID: '4b5c6d7e-8f9g-0123-4567-8901abcdefd',
    transactionName: 'Home Appliance Purchase',
    description: 'Helped a friend buy a home appliance',
    amount: 180.0,
    transactionDate: '2025-02-19T12:10:00Z',
    transactionType: 'Borrow',
    borrowerID: 'user444',
    lenderID: 'user333',
    status: 'PENDING',
  },
  {
    transactionID: '5b6c7d8e-9f0g-1234-5678-9012abcdefe',
    transactionName: 'Online Course Payment',
    description: 'Paid for an online course',
    amount: 90.0,
    transactionDate: '2025-02-17T16:50:00Z',
    transactionType: 'Loan',
    borrowerID: 'user555',
    lenderID: 'user666',
    status: 'ACCEPTED',
  },
];

export default function MutualTransactionList() {
  const [transactions, setTransactions] = React.useState<MutualTransaction[]>(
    []
  );

  React.useEffect(() => {
    setTransactions(transactionList.map(ParseMutualTransaction));
    console.log(transactions);
  }, []);

  return (
    <article className='flow-root w-full px-4'>
      <ul role='list' className='divide-y divide-gray-200 dark:divide-gray-700'>
        {transactions.map((transaction) => (
          <Popover
            key={transaction.transactionID}
            backdrop='opaque'
            showArrow={true}
          >
            <PopoverTrigger>
              <li className='py-3 sm:py-4'>
                <div className='flex items-center space-x-4'>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-base font-medium text-gray-900 dark:text-white'>
                      {transaction.transactionName}
                    </p>
                    {/* check the borrower id also when integrating */}
                    {transaction.transactionType ===
                    MutualTransactionType.LOAN ? (
                      <p className='truncate text-sm text-green-500 dark:text-green-400'>
                        {`Rs. ${transaction.amount}`}
                      </p>
                    ) : transaction.transactionType ===
                      MutualTransactionType.BORROW ? (
                      <p className='truncate text-sm text-red-500 dark:text-red-400'>
                        {`Rs. ${transaction.amount}`}
                      </p>
                    ) : (
                      <p className='truncate text-sm text-primary-500 dark:text-red-400'>
                        {`Rs. ${transaction.amount}`}
                      </p>
                    )}
                  </div>
                  <div className='inline-flex flex-col items-end text-sm font-thin text-foreground/80'>
                    <span className='text-foreground/50'>{`${transaction.transactionType}`}</span>
                    {transaction?.transactionDate && (
                      <DateTimeComponent
                        dateString={transaction.transactionDate}
                        type='default'
                      />
                    )}
                  </div>
                </div>
              </li>
            </PopoverTrigger>
            <PopoverContent>
              <div className='px-1 py-2'>
                <h3>{transaction.transactionName}</h3>
                <Divider />
                <p>{transaction.description}</p>
                <p>Amount: {transaction.amount}</p>
                <p>Date: {transaction.transactionDate}</p>
                <p>Type: {transaction.transactionType}</p>
                <p>Borrower ID: {transaction.borrowerID}</p>
                <p>Lender ID: {transaction.lenderID}</p>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </ul>
    </article>
  );
}
