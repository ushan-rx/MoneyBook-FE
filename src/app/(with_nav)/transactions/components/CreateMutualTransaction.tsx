'use client';
import { ListboxWrapper } from '@/components/ListboxWrapper';
import { MutualTransactionType } from '@/enums/TransactionEnums';
import { Avatar } from '@heroui/avatar';
import { DatePicker } from '@heroui/date-picker';
import { Form } from '@heroui/form';
import { Input, Textarea } from '@heroui/input';
import { NumberInput } from '@heroui/number-input';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Radio, RadioGroup } from '@heroui/radio';
import { zodResolver } from '@hookform/resolvers/zod';
import { parseAbsoluteToLocal } from '@internationalized/date';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@heroui/button';
import TransactionPendingCard from './TransactionPendingCard';
import { CreateMutualTransactionSchema } from '@/validations/TransactionValidations';

export const users = [
  {
    id: '1',
    userName: 'Tony_Reichert',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png',
    email: 'tony.reichert@example.com',
  },
  {
    id: '2',
    userName: 'Zoey_Lang',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png',
    email: 'zoey.lang@example.com',
  },
  {
    id: '3',
    userName: 'Jane_Fisher',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png',
    email: 'jane.fisher@example.com',
  },
  {
    id: '4',
    userName: 'William_Howard',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png',
    email: 'william.howard@example.com',
  },
  {
    id: '5',
    userName: 'Kristen_Copper',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png',
    email: 'kristen.cooper@example.com',
  },
  {
    id: '6',
    userName: 'Brian_Kim',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png',
    email: 'brian.kim@example.com',
  },
  {
    id: '7',
    userName: 'Michael_Hunt',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png',
    email: 'michael.hunt@example.com',
  },
  {
    id: '8',
    userName: 'Samantha_Brooks',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png',
    email: 'samantha.brooks@example.com',
  },
  {
    id: '9',
    userName: 'Frank_Harrison',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png',
    email: 'frank.harrison@example.com',
  },
  {
    id: '10',
    userName: 'Emma_Adams',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png',
    email: 'emma.adams@example.com',
  },
  {
    id: '11',
    userName: 'Brandon_Stevens',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png',
    email: 'brandon.stevens@example.com',
  },
  {
    id: '12',
    userName: 'Megan_Richards',
    avatar: 'https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png',
    email: 'megan.richards@example.com',
  },
];

type FormValues = z.infer<typeof CreateMutualTransactionSchema>;

export default function CreateMutualTransaction() {
  // to store friend search query
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showList, setShowList] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const {
    handleSubmit,
    reset,
    control,
    formState,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(CreateMutualTransactionSchema),
    defaultValues: {
      transactionType: MutualTransactionType.LOAN,
      transactionName: '',
      date: parseAbsoluteToLocal(new Date().toISOString()),
      description: '',
      lenderID: '1',
    },
  });

  // filter friends based on search query
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return [];
    return users.filter((user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  //submit data
  const onSubmit = async (data: FormValues) => {
    if (selectedUser === null) return;
    const transactionDate = data.date.toAbsoluteString();
    data.borrowerID = selectedUser as string;
    const { date, ...sendData } = { ...data, transactionDate };
    console.log(sendData);
  };

  // reset fields when form is submitted successfully
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setSearchQuery('');
      setShowSuccess(true);
      // if (close) close();
    }
  }, [formState, isSubmitSuccessful, reset]);

  return (
    <section className='w-full'>
      {showSuccess === false ? (
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

            <Controller
              control={control}
              name='borrowerID'
              render={({
                field: { name, onChange, onBlur, ref },
                fieldState: { invalid, error },
              }) => (
                <div className='relative w-full'>
                  <Input
                    maxLength={50}
                    ref={ref}
                    isRequired
                    errorMessage={error?.message}
                    validationBehavior='aria'
                    isInvalid={invalid}
                    label='Friend'
                    labelPlacement='outside'
                    placeholder='Search by username...'
                    name={name}
                    onBlur={onBlur}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowList(true);
                      setSelectedUser(null);
                      onChange(null);
                    }}
                    onFocus={() => setShowList(true)}
                    className='w-full text-medium font-semibold'
                  />
                  {/* list to show friendlist */}
                  {showList && searchQuery && (
                    <ListboxWrapper>
                      <Listbox
                        aria-label='Friend selection'
                        classNames={{
                          base: 'max-w-full',
                          list: 'max-h-[300px] overflow-auto',
                        }}
                        items={filteredUsers}
                        variant='flat'
                        onAction={(key) => {
                          // find selected user and set to borrower field
                          const user = users.find((u) => u.id === key);
                          if (user) {
                            setSelectedUser(user.id);
                            setSearchQuery(user.userName);
                            setShowList(false);
                            onChange(user.userName);
                          }
                        }}
                      >
                        {(user) => (
                          <ListboxItem key={user.id} textValue={user.userName}>
                            <div className='flex items-center gap-2 py-1'>
                              <Avatar
                                alt={user.userName}
                                className='flex-shrink-0'
                                size='sm'
                                src={user.avatar}
                              />
                              <div className='flex flex-col'>
                                <span className='text-small'>
                                  {user.userName}
                                </span>
                                <span className='text-tiny text-default-400'>
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </ListboxItem>
                        )}
                      </Listbox>
                    </ListboxWrapper>
                  )}
                </div>
              )}
              rules={{ required: 'Friend is required.' }}
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
                  <Radio value={MutualTransactionType.LOAN}>
                    {MutualTransactionType.LOAN}
                  </Radio>
                  <Radio value={MutualTransactionType.BORROW}>
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
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Create'}
            </Button>
          </div>
        </Form>
      ) : (
        <TransactionPendingCard />
      )}
    </section>
  );
}
