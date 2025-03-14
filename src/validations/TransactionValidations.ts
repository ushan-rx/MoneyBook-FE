import {
  MutualTransactionType,
  PersonalTransactionType,
  TransactionCategories,
} from '@/enums/TransactionEnums';
import { ZonedDateTime } from '@internationalized/date';
import { z } from 'zod';

const CreateMutualTransactionSchema = z.object({
  amount: z
    .number({ message: 'Transaction amount must be a number' })
    .positive({ message: 'Transaction amount must be a positive number' }),
  transactionName: z
    .string()
    .nonempty({ message: 'Transaction name must be at least 3 characters' })
    .min(3, { message: 'Transaction name must be at least 3 characters' }),
  description: z
    .string()
    .max(100, { message: 'Description must be less than 100 characters' })
    .optional(),
  transactionType: z.enum(
    Object.values(MutualTransactionType) as [
      MutualTransactionType,
      ...MutualTransactionType[],
    ],
    { message: 'Transaction type is Incorrect' }
  ),
  date: z.custom<ZonedDateTime>(
    (val) => {
      return val instanceof ZonedDateTime;
    },
    { message: 'Invalid DateTime format' }
  ),
  borrowerID: z.string({ message: 'Friend is required' }).nonempty(),
  lenderID: z.string().nonempty(),
});

const PersonalTransactionSchema = z.object({
  transactionName: z
    .string()
    .nonempty({ message: 'Transaction name must be at least 3 characters' })
    .min(3, { message: 'Transaction name must be at least 3 characters' }),
  transactionType: z.enum(
    Object.values(PersonalTransactionType) as [
      PersonalTransactionType,
      ...PersonalTransactionType[],
    ],
    { message: 'Transaction type is Incorrect' }
  ),
  transactionAmount: z
    .number({ message: 'Transaction amount must be a number' })
    .positive({ message: 'Transaction amount must be a positive number' }),
  category: z.enum(
    Object.values(TransactionCategories) as [
      TransactionCategories,
      ...TransactionCategories[],
    ],
    {
      message: 'Transaction Category is Incorrect',
    }
  ),
  description: z
    .string()
    .max(100, { message: 'Description must be less than 100 characters' })
    .optional(),
  transactionDate: z.custom<ZonedDateTime>(
    (val) => {
      return val instanceof ZonedDateTime;
    },
    { message: 'Invalid ZonedDateTime format' }
  ),
  userId: z.string().nonempty(),
});

export { CreateMutualTransactionSchema, PersonalTransactionSchema };
