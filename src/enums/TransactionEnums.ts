enum TransactionCategories {
  TRANSPORT = 'Transport',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  FOOD = 'Food',
  EDUCATION = 'Education',
  ENTERTAINMENT = 'Entertainment',
  LOAN = 'Loan',
  BILLS = 'Bills',
  INVESTMENT = 'Investment',
  BORROW = 'Borrow',
  SALARY = 'Salary',
  GIFT = 'Gift',
  RENT = 'Rent',
  INSURANCE = 'Insurance',
  TAX = 'Tax',
  SAVINGS = 'Savings',
  DONATION = 'Donation',
  INTEREST = 'Interest',
  BONUS = 'Bonus',
  OTHERS = 'Others',
}

enum TransactionStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
}

enum PersonalTransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

enum MutualTransactionType {
  LOAN = 'LOAN',
  BORROW = 'BORROW',
}

export {
  TransactionCategories,
  TransactionStatus,
  PersonalTransactionType,
  MutualTransactionType,
};
