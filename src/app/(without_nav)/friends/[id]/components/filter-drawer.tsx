'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  type TransactionFilterForm,
  transactionFilterSchema,
} from '@/validations/filter-transaction';
import type { TransactionFilters } from '@/types/TransactionTypes';
import {
  MutualTransactionType,
  TransactionStatus,
} from '@/enums/TransactionEnums';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerFooter,
  DrawerBody,
} from '@heroui/drawer';
import { Search, Filter, X } from 'lucide-react';
import { DatePicker } from '@heroui/date-picker';
import { Form } from '@heroui/form';
import { ZonedDateTime, parseAbsoluteToLocal } from '@internationalized/date';

interface FilterDrawerProps {
  onFiltersChange: (filters: TransactionFilters) => void;
  currentFilters: TransactionFilters;
}

export function FilterDrawer({
  onFiltersChange,
  currentFilters,
}: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<TransactionFilterForm>({
    resolver: zodResolver(transactionFilterSchema),
    defaultValues: {
      transactionName: currentFilters.transactionName || '',
      transactionType: currentFilters.transactionType || 'all',
      status: currentFilters.status || 'all',
    },
  });

  const onSubmit = (data: TransactionFilterForm) => {
    const apiReadyFilters: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(data)) {
      if (value) {
        if (value instanceof ZonedDateTime) {
          apiReadyFilters[key] = value.toAbsoluteString();
        } else if (value !== 'all') {
          apiReadyFilters[key] = value;
        }
      }
    }

    onFiltersChange(apiReadyFilters as TransactionFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    reset({
      transactionName: '',
      transactionType: 'all',
      status: 'all',
    });
    onFiltersChange({});
    setIsOpen(false);
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  const typeOptions = [
    { value: 'all', label: 'All transactions' },
    { value: MutualTransactionType.LOAN, label: 'Money you loaned' },
    { value: MutualTransactionType.BORROW, label: 'Money you borrowed' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: TransactionStatus.PENDING, label: 'Pending' },
    { value: TransactionStatus.ACCEPTED, label: 'Accepted' },
    { value: TransactionStatus.REJECTED, label: 'Rejected' },
    { value: TransactionStatus.CANCELLED, label: 'Cancelled' },
  ];

  return (
    <>
      <Button
        variant={hasActiveFilters ? 'solid' : 'bordered'}
        className='fixed bottom-6 right-4 z-20 size-14 rounded-full bg-primary-400 text-blue-50 shadow-lg'
        onPress={() => setIsOpen(true)}
      >
        {hasActiveFilters ? (
          <Search className='size-6' />
        ) : (
          <Filter className='size-6' />
        )}
      </Button>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement='bottom'
        className='h-[85vh]'
      >
        <DrawerContent>
          <DrawerHeader>
            <h6>Search & Filter</h6>
          </DrawerHeader>
          <DrawerBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className='my-3 flex w-full flex-col gap-4'>
                <Controller
                  name='transactionName'
                  control={control}
                  render={({
                    field: { name, value, onChange, onBlur, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <Input
                      ref={ref}
                      id='transactionName'
                      label='Search'
                      placeholder='Search by topic or description...'
                      startContent={<Search className='size-5' />}
                      labelPlacement='outside'
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      name={name}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />

                <Controller
                  name='transactionType'
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <Select
                      ref={ref}
                      name={name}
                      onBlur={onBlur}
                      id='transactionType'
                      label='Transaction Type'
                      items={typeOptions}
                      labelPlacement='outside'
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      selectedKeys={value ? [value] : []}
                      onChange={(e) => onChange(e.target.value)}
                    >
                      {(type) => (
                        <SelectItem key={type.value}>{type.label}</SelectItem>
                      )}
                    </Select>
                  )}
                />

                <Controller
                  name='status'
                  control={control}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, error },
                  }) => (
                    <Select
                      ref={ref}
                      name={name}
                      onBlur={onBlur}
                      id='status'
                      label='Transaction Status'
                      items={statusOptions}
                      labelPlacement='outside'
                      isInvalid={invalid}
                      errorMessage={error?.message}
                      selectedKeys={value ? [value] : []}
                      onChange={(e) => onChange(e.target.value)}
                    >
                      {(status) => (
                        <SelectItem key={status.value}>
                          {status.label}
                        </SelectItem>
                      )}
                    </Select>
                  )}
                />

                <div className='grid w-full grid-rows-2 gap-4'>
                  <Controller
                    name='transactionDate_gte'
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, error },
                    }) => (
                      <DatePicker
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        id='transactionDate_gte'
                        label='From Date'
                        labelPlacement='outside'
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        value={value}
                        onChange={onChange}
                        granularity='minute'
                      />
                    )}
                  />

                  <Controller
                    name='transactionDate_lte'
                    control={control}
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, error },
                    }) => (
                      <DatePicker
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        id='transactionDate_lte'
                        label='To Date'
                        labelPlacement='outside'
                        isInvalid={invalid}
                        errorMessage={error?.message}
                        value={value}
                        onChange={onChange}
                        granularity='minute'
                      />
                    )}
                  />
                </div>
              </div>
            </Form>
          </DrawerBody>
          <DrawerFooter>
            <div className='flex gap-3'>
              <Button
                variant='bordered'
                onPress={clearFilters}
                startContent={<X className='size-4' />}
                fullWidth
              >
                Clear All
              </Button>
              <Button
                onPress={() => handleSubmit(onSubmit)()}
                startContent={<Filter className='size-4' />}
                fullWidth
              >
                Apply Filters
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
