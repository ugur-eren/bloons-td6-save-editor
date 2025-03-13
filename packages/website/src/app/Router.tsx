import {Landing} from '../routes';
import {Layout} from './Layout';

export const Router = () => {
  // No need for router, just return the initial component
  return (
    <Layout>
      <Landing />
    </Layout>
  );
};
