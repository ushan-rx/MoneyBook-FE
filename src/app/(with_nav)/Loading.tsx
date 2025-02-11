import { Spinner } from '@heroui/spinner';

export default function Loading() {
  return (
    <div className='flex items-center justify-center text-center'>
      <Spinner />
    </div>
  );
}
