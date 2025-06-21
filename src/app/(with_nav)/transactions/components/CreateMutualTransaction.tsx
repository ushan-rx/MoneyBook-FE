'use client';
import { MutualTransactionType } from '@/enums/TransactionEnums';
import { DatePicker } from '@heroui/date-picker';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Radio, RadioGroup } from '@heroui/radio';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAbsoluteToLocal } from '@internationalized/date';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@heroui/button';
import TransactionPendingCard from './TransactionPendingCard';
import { CreateMutualTransactionSchema } from '@/validations/TransactionValidations';
import { useUserStore } from '@/store/user-store';
import { useDebounce } from 'use-debounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, apiService } from '@/lib/api';
import { addToast } from '@heroui/toast';
const FriendSearchListbox = React.lazy(() => import('./FriendSearchListbox'));

// backend friend search result DTO
export interface FriendSearchResultDto {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string; // Optional, if the user has a profile picture
}

// QR payload interface
interface QrPayload {
  transactionID: string;
  otpHash: string;
}

// interface for the created transaction response
interface MutualTransactionDto {
  transactionID: string;
  transactionName: string;
  amount: number;
  transactionDate: string;
  transactionType: string;
  borrowerID: string;
  lenderID: string;
  otp: string;
  status: string;
  qrPayload: QrPayload;
}

// infer types from validation
type FormValues = z.infer<typeof CreateMutualTransactionSchema>;

export default function CreateMutualTransaction() {
  const currentUser = useUserStore((state) => state.user);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showList, setShowList] = React.useState(false);
  const [transactionResponse, setTransactionResponse] =
    React.useState<MutualTransactionDto | null>(null);
  const [selectedFriendUserId, setSelectedFriendUserId] = React.useState<
    string | null
  >(null);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);

  const queryClient = useQueryClient();

  // Fetch friends for transaction search
  // This query will search for friends based on the debounced search query
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery({
    queryKey: ['searchFriendsForTransaction', debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
        return {
          data: [],
          timestamp: new Date().toISOString(),
          status: 200,
          message: 'Query too short',
        } as ApiResponse<FriendSearchResultDto[]>;
      }
      return await apiService.get<FriendSearchResultDto[]>('/friends/search', {
        query: debouncedSearchQuery,
      });
    },
    enabled: !!currentUser && debouncedSearchQuery.length >= 2, //only run if the conditions are met
    staleTime: 1000 * 60 * 5,
  });

  // avoids reallocating a new array on every render and
  // helps prevent unnecessary work or rendering of downstream components.
  const searchedUsers = useMemo(
    () => searchResults?.data || [],
    [searchResults]
  );

  const defaultFormValues = useMemo(
    () => ({
      transactionType: MutualTransactionType.LOAN,
      transactionName: '',
      date: parseAbsoluteToLocal(new Date().toISOString()),
      description: '',
      lenderID: currentUser?.userId || '',
      borrowerID: '', // Will be set by useEffect or remain empty if no friend selected
    }),
    [currentUser?.userId]
  );

  const {
    handleSubmit,
    reset,
    control,
    formState,
    setValue,
    getValues,
    watch,
    register,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(CreateMutualTransactionSchema),
    defaultValues: defaultFormValues,
  });

  // Register lenderID and borrowerID so RHF tracks them for validation
  useEffect(() => {
    register('lenderID');
    register('borrowerID');
  }, [register]);

  // Watch the transactionType to dynamically set lenderID and borrowerID
  const watchedTransactionType = watch('transactionType');

  // Effect to update lenderID and borrowerID based on transactionType and selectedFriendUserId
  useEffect(() => {
    const validateNow = formState.isSubmitted; // Validate only if form has been submitted or an actual value is set
    if (!currentUser?.userId) {
      setValue('lenderID', '', { shouldValidate: validateNow });
      setValue('borrowerID', '', { shouldValidate: validateNow });
      return;
    }

    // Set current user ID and friend ID based on transaction type
    const isLoan = watchedTransactionType === MutualTransactionType.LOAN;
    const currentUserId = currentUser.userId;
    const friendId = selectedFriendUserId || '';

    // Assign IDs to  roles
    const lenderId = isLoan ? currentUserId : friendId;
    const borrowerId = isLoan ? friendId : currentUserId;

    // Update form values
    setValue('lenderID', lenderId, {
      shouldValidate: validateNow || !!selectedFriendUserId,
    });
    setValue('borrowerID', borrowerId, {
      shouldValidate: validateNow || !!selectedFriendUserId,
    });
  }, [
    watchedTransactionType,
    selectedFriendUserId,
    currentUser,
    setValue,
    formState.isSubmitted,
  ]);

  const createTransactionMutation = useMutation({
    mutationFn: (payload: any) =>
      apiService.post<MutualTransactionDto>('/mutual-transactions', payload),
    onSuccess: (response) => {
      addToast({ title: 'Transaction created!', color: 'success' });
      setTransactionResponse(response.data);
      queryClient.invalidateQueries({
        queryKey: ['searchFriendsForTransaction'],
      });
      // Reset form state
      reset(defaultFormValues);
      setSearchQuery('');
      setSelectedFriendUserId(null);
      setShowList(false);
    },
    onError: (error: any) => {
      addToast({
        title: 'Failed to create transaction',
        description:
          error.response?.data?.message || 'An unexpected error occurred.',
        color: 'danger',
      });
    },
  });

  //submit data
  const onSubmit = async (data: FormValues) => {
    if (!currentUser?.userId) {
      console.error('Current user not loaded for transaction.');
      return;
    }
    const transactionDate = data.date.toAbsoluteString();
    const { date, ...formData } = data;
    const payload = {
      ...formData,
      transactionDate,
      amount: Number(formData.amount), // Ensure transction amount is number
    };
    createTransactionMutation.mutate(payload);
  };

  // connects the validation errors from the form's hidden `lenderID` and `borrowerID` fields
  // to the friend selection input UI
  let friendInputError: string | undefined = undefined;
  if (
    watchedTransactionType === MutualTransactionType.LOAN &&
    errors.borrowerID
  ) {
    friendInputError = errors.borrowerID.message;
  } else if (
    watchedTransactionType === MutualTransactionType.BORROW &&
    errors.lenderID
  ) {
    friendInputError = errors.lenderID.message;
  }

  return (
    <section className='w-full'>
      {!transactionResponse ? (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className='my-3 flex w-full flex-col gap-4'>
            <Controller
              control={control}
              name='transactionName'
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <Input
                  maxLength={50}
                  ref={ref}
                  isRequired
                  errorMessage={error?.message}
                  validationBehavior='aria'
                  isInvalid={invalid}
                  label='Transaction name'
                  labelPlacement='outside'
                  placeholder=' '
                  name={name}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  className='font-semibold'
                />
              )}
              rules={{ required: 'Transaction name is required.' }}
            />

            {/* Friend Selection Input - search and select from listbox*/}
            <div className='relative w-full'>
              <Input
                maxLength={50}
                isRequired // Visual cue, actual validation via lenderID/borrowerID
                errorMessage={friendInputError}
                validationBehavior='aria'
                isInvalid={!!friendInputError}
                label='Friend'
                labelPlacement='outside'
                placeholder='Search by name...'
                onBlur={() => {
                  setTimeout(() => {
                    // if (!selectedFriendUserId) { // Keep list if query exists and no selection yet
                    //   setShowList(false);
                    // }
                  }, 150); // Delay to allow click on listbox
                }}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedFriendUserId(null); // Clear friend selection when typing
                  setShowList(true);
                }}
                onFocus={() => {
                  if (searchQuery.length >= 2 && searchedUsers.length > 0) {
                    setShowList(true);
                  }
                }}
                className='w-full text-medium font-semibold'
              />
              {showList && debouncedSearchQuery.length >= 2 && (
                <FriendSearchListbox
                  users={searchedUsers}
                  isLoading={isSearchLoading}
                  isError={isSearchError}
                  searchQuery={debouncedSearchQuery}
                  onUserSelect={(user) => {
                    setSearchQuery(`${user.firstName} ${user.lastName}`);
                    setSelectedFriendUserId(user.userId); // Set selected friend ID
                    setShowList(false);
                  }}
                />
              )}
            </div>

            <Controller
              control={control}
              name='transactionType'
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <RadioGroup
                  label='Transaction type'
                  name={name}
                  value={value}
                  errorMessage={error?.message}
                  defaultChecked
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  orientation='horizontal'
                  isRequired
                  isInvalid={invalid}
                  size='sm'
                  classNames={{
                    wrapper: 'flex font-medium flex-row gap-10 ml-4 mt-1',
                    base: 'text-sm font-semibold my-2',
                  }}
                >
                  <Radio value={MutualTransactionType.LOAN.toUpperCase()}>
                    {MutualTransactionType.LOAN}
                  </Radio>
                  <Radio value={MutualTransactionType.BORROW.toUpperCase()}>
                    {MutualTransactionType.BORROW}
                  </Radio>
                </RadioGroup>
              )}
              rules={{ required: 'Transaction type is required.' }}
            />

            <Controller
              control={control}
              name='amount'
              render={({
                field: { name, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <NumberInput
                  name={name}
                  ref={ref}
                  isRequired
                  maxValue={9999999999}
                  className='font-semibold'
                  errorMessage={error?.message}
                  validationBehavior='aria'
                  isInvalid={invalid}
                  label='Transaction Amount: (Rs.)'
                  labelPlacement='outside'
                  placeholder=' '
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              rules={{ required: 'Amount is required.' }}
            />

            <Controller
              control={control}
              name='date'
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <DatePicker
                  name={name}
                  isInvalid={invalid}
                  className='font-semibold'
                  errorMessage={error?.message}
                  label='Transaction date'
                  ref={ref}
                  granularity='minute'
                  labelPlacement='outside'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  size='md'
                />
              )}
              rules={{ required: 'Transaction date is required.' }}
            />

            <Controller
              control={control}
              name='description'
              render={({
                field: { name, value, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <Textarea
                  ref={ref}
                  errorMessage={error?.message}
                  validationBehavior='aria'
                  className='font-semibold'
                  isInvalid={invalid}
                  label='Description'
                  labelPlacement='outside'
                  maxRows={4}
                  maxLength={100}
                  name={name}
                  variant='faded'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />
            <Button
              variant='solid'
              color='primary'
              type='submit'
              size='md'
              isLoading={createTransactionMutation.isPending}
            >
              {createTransactionMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </Form>
      ) : (
        <TransactionPendingCard
          otp={transactionResponse.otp}
          qrPayload={transactionResponse.qrPayload}
        />
      )}
    </section>
  );
}
