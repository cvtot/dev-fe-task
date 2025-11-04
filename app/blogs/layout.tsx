import React, { Fragment } from 'react';
import type { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'Blogs',
  description: 'Explore blogs with insights and resources',
};

const Layout: React.FC<Props> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

export default Layout;
