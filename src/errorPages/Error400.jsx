import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #fff3cd, #fce8a8);
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
  color: #f0ad4e;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background-color: #f0ad4e;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #ec971f;
  }
`;

function Error400({ language, onChangeLanguage }) {
  const navigate = useNavigate();

  const text = {
    ko: {
      message: '잘못된 요청입니다.',
      button: '홈으로 돌아가기',
    },
    en: {
      message: 'Bad request.',
      button: 'Back to Home',
    },
  };

  const t = text[language || 'ko'];

  return (
    <>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <Wrapper>
        <Code>400</Code>
        <Message>{t.message}</Message>
        <BackButton onClick={() => navigate('/')}>{t.button}</BackButton>
      </Wrapper>
    </>
  );
}

export default Error400;
