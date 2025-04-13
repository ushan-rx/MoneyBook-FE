// Definition: This file defines the layout for the pages that do not have a navigation bar.
// The layout includes a top navigation bar and a main section.
//children: Children to be shown in the main section
import React from 'react';
import TopNav from '../TopNav';

const TopNavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children} {/* Header and Body will be used as children here */}
    </>
  );
};

// **Header Component: Renders TopNav**
TopNavLayout.Header = function Header({
  children,
  topic,
}: {
  children?: React.ReactNode;
  topic: string;
}) {
  return <TopNav topic={topic}>{children}</TopNav>;
};

// **Body Component: Renders Main Content**
TopNavLayout.Body = function Body({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <section className='relative dark:bg-black'>{children}</section>
    </main>
  );
};

export default TopNavLayout;
