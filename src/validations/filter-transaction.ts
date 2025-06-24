import { z } from 'zod';
import {
  MutualTransactionType,
  TransactionStatus,
} from '@/enums/TransactionEnums';
import { ZonedDateTime } from '@internationalized/date';
import { TransactionFilters } from '@/types/TransactionTypes';

export const transactionFilterSchema = z.object({
  transactionName: z.string().optional(),
  transactionType: z
    .enum([MutualTransactionType.LOAN, MutualTransactionType.BORROW, 'all'])
    .optional(),
  transactionDate_gte: z
    .custom<ZonedDateTime>(
      (val) => {
        return val instanceof ZonedDateTime;
      },
      { message: 'Invalid ZonedDateTime format' }
    )
    .optional(),
  transactionDate_lte: z
    .custom<ZonedDateTime>(
      (val) => {
        return val instanceof ZonedDateTime;
      },
      { message: 'Invalid ZonedDateTime format' }
    )
    .optional(),
  status: z
    .enum([
      TransactionStatus.PENDING,
      TransactionStatus.ACCEPTED,
      TransactionStatus.REJECTED,
      TransactionStatus.CANCELLED,
      'all',
    ])
    .optional(),
});

export type TransactionFilterForm = z.infer<typeof transactionFilterSchema>;

export const cleanFiltersForApi = (filters: TransactionFilters) => {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value && value !== 'all')
  );
};
