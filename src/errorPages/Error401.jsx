// src/errorPages/Error401.jsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #e2eafc, #d4e4f7);
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
  color: #5bc0de;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: #5bc0de;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #31b0d5;
  }
`;

function Error401() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Code>401</Code>
      <Message>로그인이 필요합니다.</Message>
      <BackButton onClick={() => navigate('/login')}>로그인하기</BackButton>
    </Wrapper>
  );
}

export default Error401;
