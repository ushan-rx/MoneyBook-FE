import { useState } from 'react';
import type { MutualTransaction } from '@/types/TransactionTypes';
import {
  MutualTransactionType,
  TransactionStatus,
} from '@/enums/TransactionEnums';
import { Card } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

interface TransactionCardProps {
  transaction: MutualTransaction;
  onUpdate: () => void;
}

export function TransactionCard({
  transaction,
  onUpdate,
}: TransactionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLoan = transaction.transactionType === MutualTransactionType.LOAN;
  const formattedDate = new Date(
    transaction.transactionDate
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const cancelMutation = useMutation({
    mutationFn: (transactionID: string) =>
      apiService.post(`/mutual-transactions/${transactionID}/cancel`, {}),
    onSuccess: () => {
      onUpdate();
      setIsExpanded(false);
    },
    onError: (error) => {
      console.error('Failed to cancel transaction', error);
    },
  });

  const handleCancel = () => {
    cancelMutation.mutate(transaction.transactionID);
  };

  const getStatusChip = () => {
    switch (transaction.status) {
      case TransactionStatus.PENDING:
        return (
          <Chip
            size='sm'
            startContent={<Clock size={15} />}
            variant='bordered'
            color='warning'
            className='flex items-center gap-1'
          >
            Pending
          </Chip>
        );
      case TransactionStatus.ACCEPTED:
        return (
          <Chip
            size='sm'
            startContent={<CheckCircle size={15} />}
            variant='faded'
            color='success'
          >
            Accepted
          </Chip>
        );
      case TransactionStatus.REJECTED:
        return (
          <Chip
            size='sm'
            startContent={<AlertTriangle size={15} />}
            variant='bordered'
            color='danger'
          >
            Rejected
          </Chip>
        );
      case TransactionStatus.CANCELLED:
        return (
          <Chip
            size='sm'
            startContent={<XCircle size={15} />}
            variant='bordered'
            color='default'
            className='flex items-center gap-1'
          >
            Cancelled
          </Chip>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={`mt-2 overflow-hidden transition-all duration-300 ${
        isLoan
          ? 'border-l-4 border-l-green-500 shadow-green-100'
          : 'border-l-4 border-l-red-500 shadow-red-100'
      }`}
    >
      <div
        className='cursor-pointer p-4'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <div
                className={`flex size-8 items-center justify-center rounded-full ${
                  isLoan
                    ? 'bg-green-100 text-green-600 dark:bg-green-950'
                    : 'bg-red-100 text-red-600 dark:bg-red-950'
                }`}
              >
                {isLoan ? (
                  <ArrowUpRight className='size-4' />
                ) : (
                  <ArrowDownLeft className='size-4' />
                )}
              </div>
              <div>
                <h3 className='text-lg text-gray-900 dark:text-gray-300'>
                  {transaction.transactionName}
                </h3>
                <div className='mt-0.5 flex items-center gap-2'>
                  <p className='text-xs text-gray-500'>{formattedDate}</p>
                  {getStatusChip()}
                </div>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 text-right'>
            <p
              className={`text-xl font-bold ${
                isLoan ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isLoan ? '+' : '-'}${transaction.amount}
            </p>
            <ChevronDown
              className={`size-5 text-gray-500 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className='px-4 pb-4'>
          <div className='ml-10 border-t border-gray-200 pt-3 dark:border-gray-700'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {transaction.description || 'No description provided.'}
            </p>
            {transaction.status === TransactionStatus.PENDING && (
              <div className='mt-4 flex justify-end'>
                <Button
                  color='danger'
                  variant='solid'
                  onPress={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
