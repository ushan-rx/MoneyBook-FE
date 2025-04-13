import {
  MutualTransactionType,
  TransactionStatus,
} from '@/enums/TransactionEnums';

export interface MutualTransaction {
  transactionID: string;
  transactionName: string;
  description?: string;
  amount: number;
  transactionDate: string; // ISO 8601 format
  transactionType: MutualTransactionType;
  borrowerID: string;
  lenderID: string;
  status: TransactionStatus;
}
