import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext'; // 전역 상태 관리

const TopSection = styled.section`
  min-height: 100vh;
  padding: 4vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
`;

const Greeting = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  margin-top: 0;
  color: #fff7d6;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: bold;
  line-height: 1.5;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
  margin-top: 1rem;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.8rem);
  font-style: italic;
  margin-top: 2rem;
  color: #f0f0f0;
`;

const ButtonWrapper = styled.div`
  margin-top: 4rem;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const WriteButton = styled.button`
  background-color: #007c99;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 40px;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  min-width: 180px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #005f73;
  }
`;

function MainTop({ language }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ 기능은 전역 상태 기반

  const text = {
    ko: {
      title: ['AI 올인원 플랫폼', '회사 맞춤 이력서를 한번에!'],
      subtitle: 'AI와 함께 자신만의 이력서를 완성해보세요',
      button: '이력서 작성하기',
      greeting: (name) =>
        name ? (
          <>
            안녕하세요, {name} 님 👋<br />
            당신의 이력서를 준비해볼까요?
          </>
        ) : (
          <>환영합니다! 👋</>
        ),
    },
    en: {
      title: ['Use the resume assistant', 'to start writing easily'],
      subtitle: '~Start writing your resume~',
      button: 'Start Resume',
      greeting: (name) =>
        name ? (
          <>
            Hello, {name}! 👋<br />
            Ready to build your resume?
          </>
        ) : (
          <>Welcome! 👋</>
        ),
    },
  };

  const t = text[language || 'ko'];

  const handleWriteClick = () => {
    if (user.loggedIn) {
      navigate('/step1page');
    } else {
      navigate('/login');
    }
  };

  return (
    <TopSection>
      {<Greeting>{t.greeting(user.username)}</Greeting>}
      <Title>
        {Array.isArray(t.title)
          ? t.title.map((line, idx) => <div key={idx}>{line}</div>)
          : t.title}
      </Title>
      <Subtitle>{t.subtitle}</Subtitle>
      <ButtonWrapper>
        <WriteButton onClick={handleWriteClick}>{t.button}</WriteButton>
      </ButtonWrapper>
    </TopSection>
  );
}

export default MainTop;
