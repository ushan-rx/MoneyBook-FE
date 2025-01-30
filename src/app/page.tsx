import Image from 'next/image';

export default function Home() {
  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] place-items-center gap-2 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
      <main className='row-start-2 flex flex-col items-center gap-4 sm:items-start'>
        <Image
          className='dark:invert'
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />
        <p className='text-center text-lg font-bold sm:text-left'>
          Welcome to the Hero UI (Next UI) + Shadcn UI Starter Project
        </p>
        <div className='flex flex-col gap-2'>
          {/* Information Section */}
          <div className='space-y-2 rounded-lg p-4 shadow-md sm:p-8'>
            <h2 className='text-lg font-bold'>Important Information</h2>
            <ul className='list-disc pl-5 text-sm leading-6'>
              <li>
                Components from both Hero UI and Shadcn UI work fine together,
                but there are some incompatibilities in their default styles.
              </li>
              <li>
                These issues arise when using the same default component from
                both libraries on one page. Try to avoid this scenario.
              </li>
              <li>
                A default theme system is being developed to ensure both
                libraries work seamlessly. If you create your own theme, this
                won't be an issue.
              </li>
              <li>
                This project is new, so there might be unknown bugs. If you
                encounter any, please make an issue or email me at{' '}
                <a
                  href='mailto:ushan.r.senarathna@gmail.com'
                  className='text-blue-500 underline'
                >
                  ushan.r.senarathna@gmail.com
                </a>
                .
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
