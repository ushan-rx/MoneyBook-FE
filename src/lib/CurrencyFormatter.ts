export default function formatCurrency(
  amount: number,
  currencyCode: string,
  locale?: string
): string {
  const usedLocale = locale || navigator.language; // Use provided locale or browser's locale

  try {
    return (
      'Rs.' +
      amount
        .toLocaleString(usedLocale, {
          style: 'currency',
          currency: currencyCode,
        })
        .split('LKR')[1]
    );
  } catch (error) {
    console.error('Error formatting currency:', error);
    return (
      'Rs.' +
      amount.toLocaleString(usedLocale, {
        style: 'decimal',
      })
    );
  }
}
