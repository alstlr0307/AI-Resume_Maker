// src/errorPages/Error503.jsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #e8f7ef, #c5e7d6);
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
  color: #5cb85c;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: #5cb85c;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #449d44;
  }
`;

function Error503() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Code>503</Code>
      <Message>현재 서비스 이용이 불가능합니다. 잠시 후 다시 시도해주세요.</Message>
      <BackButton onClick={() => navigate('/')}>홈으로 돌아가기</BackButton>
    </Wrapper>
  );
}

export default Error503;
