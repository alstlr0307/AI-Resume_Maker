// src/errorPages/Error404.jsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #79A7D3, #C3DAF5);
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
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: #5D9CEC;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #4A8CD4;
  }
`;

function Error404() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Code>404</Code>
      <Message>페이지를 찾을 수 없습니다 😿</Message>
      <BackButton onClick={() => navigate('/')}>메인으로 돌아가기</BackButton>
    </Wrapper>
  );
}

export default Error404;
