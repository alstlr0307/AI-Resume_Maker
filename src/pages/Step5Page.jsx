// src/components/Step5.jsx
import React from "react";
import styled from "styled-components";
import Header from '../components/Header';
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  font-family: sans-serif;
  text-align: center;
`;

const InputSection = styled.div`
 background-color: white;
 border-radius: 20px;
 padding: 30px;
  box-shadow: 3px 3px 10px -3px gray;
`;

const Title = styled.h2`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: white;
  margin-top: 100px;
  margin-bottom: 30px;
`;

const Stepper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
`;

const Circle = styled.div`
  min-width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${props =>
    props.index <= props.currentStep ? '#146c94' : 'white'};
  color: ${props =>
    props.index <= props.currentStep ? 'white' : '#146c94'};
  border: 3px solid #146c94;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  text-align: center;
  padding: 5px;
  white-space: pre-line;
  box-sizing: border-box;
`;

const Line = styled.div`
  width: 30px;
  height: 5px;
  background-color: #146c94;
  margin-left: -2px;
  margin-right: -2px;
`;

const Section = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
`;

const SectionTitle = styled.h3`
  margin-bottom: 10px;
`;

const ResumeText = styled.p`
  margin: 5px 0;
`;

const Highlight = styled.strong`
  margin-right: 5px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
`;

const CompleteButton = styled.button`
  color: white;
  background-color: #146c94;
  border: 1px solid #146c94;
  border-radius:20px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 20px;

  &:hover {
    color: #146c94;
    background-color: white;
`;

const LinkText = styled.div`
  color: white;
  background-color: #146c94;
  border: 1px solid #146c94;
  border-radius:20px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 20px;

  &:hover {
    color: #146c94;
    background-color: white;
  }
`;

const PreButton=styled(LinkText)`
    margin-left: 30px;
`;

const StepButton = styled.div`
  width: 100%;
  max-width: 900px; /* 기존 800px에서 더 넓혀줌 */
  margin: 50px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const steps = ["이력서\n양식", "신상\n정보", "경력", "수정", "완성"];
const currentStep = 4; // 현재 단계

const Step5Page = () => {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <Header/>
    <Container>
      <Title>이력서 완성</Title>

        <Stepper>
          {steps.map((step, index) => (
            <Step key={step}>
              <Circle index={index} currentStep={currentStep}>
                {step}
              </Circle>
              {index < steps.length - 1 && <Line />}
            </Step>
          ))}
        </Stepper>

<InputSection>
      <Section>
        <SectionTitle>기본 정보</SectionTitle>
        <ResumeText><Highlight>이름:</Highlight>홍길동</ResumeText>
        <ResumeText><Highlight>이메일:</Highlight>hong@example.com</ResumeText>
        <ResumeText><Highlight>전화번호:</Highlight>010-1234-5678</ResumeText>
        <ResumeText><Highlight>주소:</Highlight>서울시 강남구</ResumeText>
      </Section>

      <Section>
        <SectionTitle>학력</SectionTitle>
        <ResumeText><Highlight>학교:</Highlight>OO대학교 / 컴퓨터공학 / 졸업</ResumeText>
      </Section>

      <Section>
        <SectionTitle>경력</SectionTitle>
        <ResumeText><Highlight>회사:</Highlight>ABC회사 / 프론트엔드 개발자 (2020~2023)</ResumeText>
        <ResumeText><Highlight>업무:</Highlight>웹서비스 개발 및 유지보수</ResumeText>
      </Section>

      <Section>
        <SectionTitle>자격증</SectionTitle>
        <ResumeText>정보처리기사 (2022)</ResumeText>
      </Section>

      <Section>
        <SectionTitle>외국어</SectionTitle>
        <ResumeText>영어 / TOEIC 850점</ResumeText>
      </Section>
      </InputSection>

      <ButtonWrapper>
        
      </ButtonWrapper>
      
      <StepButton>
          <PreButton onClick={() => navigate('/step4Page')}>이전</PreButton>
          <CompleteButton onClick={() => alert("이력서 저장이 완료되었습니다!")}>
          이력서 완료
        </CompleteButton>
      </StepButton>
          
    </Container>
    <Footer/>
    </PageWrapper>
  );
};

export default Step5Page;
