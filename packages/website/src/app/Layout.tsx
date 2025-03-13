import {Footer} from '../components';

export const Layout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      {children}

      <Footer />
    </div>
  );
};
