import styled from '@emotion/styled';
import NxWelcome from './nx-welcome';
const StyledApp = styled.div`
  // Your style here
`;
export function App() {
  return (
    <StyledApp>
      <NxWelcome title="site-retailer" />
    </StyledApp>
  );
}
export default App;
