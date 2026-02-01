import styled from 'styled-components';
import resume1 from '../assets/resume1.png';
import resume04 from '../assets/resume04.png';

const MiddleSection = styled.section`
  min-height: 100vh;
  padding: 6vh 5vw 6vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: transparent;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 3vw, 3rem);
  margin-bottom: 2rem;
  position: relative;

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 3px;
    margin: 10px auto 0;
    background-color: #5397f0;
    border-radius: 2px;
  }
`;

const ResumeContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(30px, 5vw, 60px);
  margin-top: 30px;
`;

const ResumeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ResumeImg = styled.img`
  width: clamp(280px, 32vw, 500px);
  height: auto;
  border-radius: 10px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ResumeLabel = styled.p`
  margin-top: 12px;
  font-size: 1rem;
  color: #333;
`;

function MainMiddle({ language }) {
  const text = {
    ko: '이력서 비교',
    en: 'Resume Comparison',
  };

  const labels = {
    ko: ['대기업 실제  예시', '작성될 이력서 예시'],
    en: ['Original Resume', 'Generated Resume'],
  };

  return (
    <MiddleSection>
      <SectionTitle>{text[language]}</SectionTitle>
      <ResumeContainer>
        <ResumeBox>
          <ResumeImg src={resume1} alt="이력서1" />
          <ResumeLabel>{labels[language][0]}</ResumeLabel>
        </ResumeBox>
        <ResumeBox>
          <ResumeImg src={resume04} alt="이력서2" />
          <ResumeLabel>{labels[language][1]}</ResumeLabel>
        </ResumeBox>
      </ResumeContainer>
    </MiddleSection>
  );
}

export default MainMiddle;
