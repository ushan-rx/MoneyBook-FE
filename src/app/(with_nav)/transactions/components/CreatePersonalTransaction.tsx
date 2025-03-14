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
import { ZonedDateTime, parseAbsoluteToLocal } from '@internationalized/date';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardBody } from '@heroui/card';
import Image from 'next/image';
import { PersonalTransactionSchema } from '@/validations/TransactionValidations';

type FormValues = z.infer<typeof PersonalTransactionSchema>;

// Transaction Categories List for select input from enum
const TransactionCategoriesList = Object.entries(TransactionCategories).map(
  ([key, label]) => ({
    key: label,
    label,
  })
);

export default function CreatePersonalTransaction() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const {
    handleSubmit,
    reset,
    control,
    formState,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(PersonalTransactionSchema),
    defaultValues: {
      userId: '1',
      transactionType: PersonalTransactionType.INCOME,
      transactionName: '',
      transactionDate: parseAbsoluteToLocal(new Date().toISOString()),
      description: '',
    },
  });

  // reset fields when form is submitted successfully
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setShowSuccess(true);
      // if (close) close();
    }
  }, [formState, isSubmitSuccessful, reset]);

  //submit data
  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <div>
      {showSuccess == false ? (
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
                  granularity='minute'
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
                  {TransactionCategoriesList.map((category) => (
                    <SelectItem key={category.key} textValue={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
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
              type='submit'
              size='md'
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Create'}
            </Button>
          </div>
        </Form>
      ) : (
        <Card className='min-h-[400px]'>
          <CardBody className='item-center flex justify-center'>
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
