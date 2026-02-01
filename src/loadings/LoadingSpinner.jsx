// src/components/LoadingSpinner.jsx
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${({ full }) => (full ? '100vh' : 'auto')};
  padding: 30px 0;
`;

const Spinner = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #5cbef7;
  border-radius: 50%;
  width: ${({ size }) => size || '50px'};
  height: ${({ size }) => size || '50px'};
  animation: ${spin} 1s linear infinite;
`;

function LoadingSpinner({ size = '50px', full = false }) {
  return (
    <SpinnerWrapper full={full}>
      <Spinner size={size} />
    </SpinnerWrapper>
  );
}

export default LoadingSpinner;
