import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <div className="mainContainer">
      {children}
    </div>
  );
}

export default Container;
