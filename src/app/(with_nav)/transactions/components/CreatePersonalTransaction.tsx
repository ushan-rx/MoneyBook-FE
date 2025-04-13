'use client';
import {
  PersonalTransactionType,
  TransactionCategories,
} from '@/enums/TransactionEnums';
import { Button } from '@heroui/button';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { RadioGroup, Radio } from '@heroui/radio';
import { Select, SelectItem } from '@heroui/select';
import { DatePicker } from '@heroui/date-picker';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardBody } from '@heroui/card';
import Image from 'next/image';
import { PersonalTransactionSchema } from '@/validations/TransactionValidations';
import { useUserStore } from '@/store/user-store';
import LoadingDots from '@/components/LoadingDots';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

// Form Values Type infered from zod schema
type FormValues = z.infer<typeof PersonalTransactionSchema>;

// Transaction Categories List for select input from an enum object with key value pairs
const TransactionCategoriesList = Object.entries(TransactionCategories).map(
  ([key, label]) => ({
    key: label,
    label,
  })
);

export default function CreatePersonalTransaction() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const { isLoading, user } = useUserStore();

  const createTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await api.post('/personal-transactions/create', data);
        return response.data;
      } catch (error) {
        // Re-throw the error to be handled in onError
        throw error;
      }
    },
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error: any) => {
      console.error('Transaction creation failed:', error);
      // Extract backend response structure from axios error
      const apiResponse = error.response?.data;

      if (apiResponse) {
        if (apiResponse.data && typeof apiResponse.data === 'object') {
          // Field-specific validation errors are in the data property
          setErrors(apiResponse.data);
        } else if (apiResponse.message) {
          // General error message
          setErrors({ _form: apiResponse.message });
        } else {
          // Fallback error message
          setErrors({
            _form: apiResponse.error || 'Failed to create transaction',
          });
        }
      } else {
        // Network or other errors
        setErrors({ _form: error.message || 'Network error occurred' });
      }
    },
  });

  // form hook with zod resolver
  const {
    handleSubmit,
    reset,
    control,
    formState,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(PersonalTransactionSchema),
    defaultValues: {
      userId: user?.userId || '',
      transactionType: PersonalTransactionType.INCOME,
      transactionName: '',
      transactionDate: parseAbsoluteToLocal(new Date().toISOString()), // to set default date to current date
      description: '',
    },
  });

  // reset fields when form is submitted successfully
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setShowSuccess(true);
    }
  }, [formState, isSubmitSuccessful, reset]);

  //submit data
  const onSubmit = async (data: FormValues) => {
    if (user != null) {
      // Format: "2025-04-03T09:58:39.841+05:30[Asia/Colombo]" → "2025-04-03T09:58:39.841+05:30"
      // Convert to ISO-8601 format without timezone name in brackets
      const dateString = data.transactionDate.toAbsoluteString();
      const formattedDate = dateString.replace('Z', '+05:30');
      const transactionData = {
        ...data,
        userID: user.userId,
        description: data.description || '',
        transactionDate: formattedDate,
        category: data.category.toUpperCase(),
      };
      createTransactionMutation.mutate(transactionData);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <LoadingDots />
      </div>
    );
  }

  return (
    <div>
      {showSuccess == false ? (
        <Form onSubmit={handleSubmit(onSubmit)} validationErrors={errors}>
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
              rules={{ required: 'Name is required.' }}
            />
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
                  <Radio value={PersonalTransactionType.INCOME}>
                    {' '}
                    {PersonalTransactionType.INCOME}
                  </Radio>
                  <Radio value={PersonalTransactionType.EXPENSE}>
                    {PersonalTransactionType.EXPENSE}
                  </Radio>
                </RadioGroup>
              )}
              rules={{ required: 'Transaction type is required.' }}
            />
            <Controller
              control={control}
              name='transactionAmount'
              render={({
                field: { name, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <NumberInput
                  ref={ref}
                  maxValue={9999999999}
                  isRequired
                  className='font-semibold'
                  errorMessage={error?.message}
                  validationBehavior='aria'
                  isInvalid={invalid}
                  label='Transaction Amount: (Rs.)'
                  labelPlacement='outside'
                  placeholder=' '
                  name={name}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
              rules={{ required: 'Amount is required.' }}
            />
            <Controller
              control={control}
              name='transactionDate'
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
                  granularity='minute' // change this to change date time mode
                  labelPlacement='outside'
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  size='md'
                />
              )}
            />
            <Controller
              control={control}
              name='category'
              render={({
                field: { onChange, value, name, ref },
                fieldState: { invalid, error },
              }) => (
                <Select
                  ref={ref}
                  name={name}
                  className='max-w-xs font-semibold'
                  selectedKeys={value ? [value] : []}
                  onChange={(e) => onChange(e.target.value)}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  label='Transaction Category'
                  labelPlacement='outside'
                  placeholder='Select Category'
                  variant='bordered'
                >
                  {TransactionCategoriesList.map(
                    (
                      category // map through the categories list
                    ) => (
                      <SelectItem key={category.key} textValue={category.key}>
                        {category.label}
                      </SelectItem>
                    )
                  )}
                </Select>
              )}
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
              size='md'
              type='submit'
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Create'}
            </Button>
          </div>
        </Form>
      ) : (
        // this is success component to show when form is submitted successfully
        <Card className='min-h-[400px]'>
          <CardBody className='flex justify-center'>
            <header className='mt-3 flex flex-col items-center justify-center gap-4'>
              <Image
                className=''
                alt='transaction done'
                src={'/doneTransaction.svg'}
                width={150}
                height={150}
              />
              <h2 className='text-center text-xl font-semibold dark:text-slate-50'>
                Transaction Created Successfully
              </h2>
            </header>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
