import {Router} from './Router';
import {Wrapper} from './Wrapper';

export const App: React.FC = () => {
  return (
    <Wrapper>
      <div className="dark font-default">
        <Router />
      </div>
    </Wrapper>
  );
};
