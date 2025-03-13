import {StrictMode} from 'react';

export const Wrapper: React.FC<React.PropsWithChildren> = ({children}) => {
  return <StrictMode>{children}</StrictMode>;
};
