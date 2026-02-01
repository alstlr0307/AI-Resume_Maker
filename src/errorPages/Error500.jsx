// src/errorPages/Error500.jsx
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #ffccd5, #ffe4e9);
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

function Error500() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Code>500</Code>
      <Message>서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.</Message>
      <BackButton onClick={() => navigate('/')}>메인으로 돌아가기</BackButton>
    </Wrapper>
  );
}

export default Error500;
