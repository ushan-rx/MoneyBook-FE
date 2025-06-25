import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { MutualTransaction } from '@/types/TransactionTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  User,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiService } from '@/lib/api';

const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter all 6 digits')
    .max(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

type OtpFormValues = z.infer<typeof otpFormSchema>;

export default function TransactionRequestCard({
  transaction,
}: {
  transaction: MutualTransaction;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [requesteeName, setRequesteeName] = useState<string | null>(null);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const requesteeId =
    transaction.borrowerID === transaction.requestedTo
      ? transaction.lenderID
      : transaction.borrowerID;

  useEffect(() => {
    const fetchRequesteeName = async () => {
      try {
        const response = await apiService.get(`/users/${requesteeId}/brief`);
        setRequesteeName(
          `${response.data.firstName} ${response.data.lastName}`
        );
      } catch (error) {
        console.error('Error fetching requestee details:', error);
      }
    };

    fetchRequesteeName();
  }, [requesteeId]);

  const handleAction = async (
    values: OtpFormValues,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await apiService.post(
        `/mutual-transactions/${transaction.transactionID}/manual`,
        {
          otp: values.otp,
          status,
        }
      );

      if (response.status === 200) {
        setSubmitStatus('success');
        form.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoan = transaction.transactionType === 'LOAN';

  return (
    <div className='m-2 max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'>
      <div
        className={`px-6 py-4 ${
          isLoan
            ? 'bg-gradient-to-r from-red-500 to-red-600'
            : 'bg-gradient-to-r from-green-500 to-green-600'
        }`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            {isLoan ? (
              <ArrowUpRight className='size-5 text-white' />
            ) : (
              <ArrowDownLeft className='size-5 text-white' />
            )}
            <span className='text-sm font-semibold uppercase tracking-wide text-white'>
              {transaction.transactionType} Request
            </span>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isLoan
                ? 'bg-red-400 text-red-100 opacity-30'
                : 'bg-green-400 text-green-100 opacity-30'
            }`}
          >
            Pending
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='p-6'>
        {/* Transaction name and amount */}
        <div className='mb-6'>
          <h3 className='mb-2 text-xl font-bold text-gray-900'>
            {transaction.transactionName}
          </h3>
          <div className='flex items-baseline space-x-1'>
            <span
              className={`text-3xl font-bold ${
                isLoan ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {formatAmount(transaction.amount)}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className='space-y-4'>
          {/* Requestee */}
          <div className='flex items-center space-x-3'>
            <div
              className={`rounded-lg p-2 ${
                isLoan ? 'bg-red-50' : 'bg-green-50'
              }`}
            >
              <User
                className={`size-4 ${
                  isLoan ? 'text-red-600' : 'text-green-600'
                }`}
              />
            </div>
            <div>
              <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                {isLoan ? 'Borrowing from' : 'Lending to'}
              </p>
              <p className='text-sm font-semibold text-gray-900'>
                {requesteeName || 'Loading...'}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className='flex items-center space-x-3'>
            <div
              className={`rounded-lg p-2 ${
                isLoan ? 'bg-red-50' : 'bg-green-50'
              }`}
            >
              <Calendar
                className={`size-4 ${
                  isLoan ? 'text-red-600' : 'text-green-600'
                }`}
              />
            </div>
            <div>
              <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                Request Date
              </p>
              <p className='text-sm font-semibold text-gray-900'>
                {formatDate(transaction.transactionDate)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className='flex items-start space-x-3'>
            <div
              className={`rounded-lg p-2 ${
                isLoan ? 'bg-red-50' : 'bg-green-50'
              } mt-0.5`}
            >
              <FileText
                className={`size-4 ${
                  isLoan ? 'text-red-600' : 'text-green-600'
                }`}
              />
            </div>
            <div className='flex-1'>
              <p className='mb-1 text-xs font-medium uppercase tracking-wide text-gray-500'>
                Description
              </p>
              <p className='text-sm leading-relaxed text-gray-700'>
                {transaction.description}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              handleAction(values, 'ACCEPTED')
            )}
            className='space-y-3'
          >
            <div className='flex items-start space-x-3'>
              <div
                className={`rounded-lg p-2 ${
                  isLoan ? 'bg-red-50' : 'bg-green-50'
                } mt-0.5`}
              >
                <Shield
                  className={`size-4 ${
                    isLoan ? 'text-red-600' : 'text-green-600'
                  }`}
                />
              </div>
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='otp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-medium uppercase tracking-wide text-gray-500'>
                        Enter OTP to Approve
                      </FormLabel>
                      <FormControl>
                        <div className='flex justify-center'>
                          <InputOTP
                            maxLength={6}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting}
                            className={`${
                              submitStatus === 'error'
                                ? '[&>div]:border-red-300 [&>div]:focus-within:border-red-500'
                                : isLoan
                                  ? '[&>div]:border-red-200 [&>div]:focus-within:border-red-500'
                                  : '[&>div]:border-green-200 [&>div]:focus-within:border-green-500'
                            }`}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSeparator />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {submitStatus === 'success' && (
                        <p className='mt-1 text-center text-xs text-green-600'>
                          ✓ Transaction approved successfully!
                        </p>
                      )}
                      {submitStatus === 'error' && (
                        <p className='mt-1 text-center text-xs text-red-600'>
                          ✗ Failed to approve transaction. Please try again.
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Action buttons */}
      <div className='border-t border-gray-100 bg-gray-50 px-6 py-4'>
        <div className='flex space-x-3'>
          <button
            type='submit'
            onClick={form.handleSubmit((values) =>
              handleAction(values, 'ACCEPTED')
            )}
            disabled={
              isSubmitting ||
              !form.formState.isValid ||
              form.watch('otp').length !== 6
            }
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
              isLoan
                ? 'bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700 disabled:hover:bg-red-600'
                : 'bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 disabled:hover:bg-green-600'
            } transform hover:-translate-y-0.5 hover:shadow-xl disabled:transform-none`}
          >
            {isSubmitting ? 'Approving...' : 'Approve'}
          </button>
          <button
            type='button'
            onClick={form.handleSubmit((values) =>
              handleAction(values, 'REJECTED')
            )}
            className='flex-1 transform rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-300 hover:shadow-md'
            disabled={isSubmitting}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
