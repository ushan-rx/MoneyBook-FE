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

// FriendSummary interface defines the structure for a summary of a friend to be displayed in the UI
export interface FriendSummary {
  friendName: string;
  balance: number;
  totalLent: number;
  totalBorrowed: number;
  friendsSince: string;
  avatar?: string;
  friendID: string;
}

// TransactionFilters interface defines the structure for filtering mutual transactions(with friends)
export interface TransactionFilters {
  search?: string;
  type?: MutualTransactionType | 'ALL';
  dateFrom?: string;
  dateTo?: string;
  status?: TransactionStatus | 'ALL';
}
