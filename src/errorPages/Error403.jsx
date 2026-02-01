// src/errorPages/Error403.jsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #f9d6d5, #f7c0bd);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #333;
  text-align: center;
`;

const Code = styled.h1`
  font-size: 8rem;
  margin: 0;
  color: #d9534f;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: #d9534f;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

function Error403() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Code>403</Code>
      <Message>접근 권한이 없습니다.</Message>
      <BackButton onClick={() => navigate('/')}>홈으로 돌아가기</BackButton>
    </Wrapper>
  );
}

export default Error403;
