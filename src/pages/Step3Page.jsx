import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";
import StyledTable from "../components/StepTable";

export default function Step3Page({ selectedTemplate, language, onChangeLanguage, formData, handleFormDataChange }) {
  const navigate = useNavigate();
  console.log(formData); // formData 내용 확인

  // 사용자 입력을 상태로 관리
  const [education, setLocalEducation] = useState(formData.education || "");
  const [career, setLocalCareer] = useState(formData.career || "");
  const [certificate, setLocalCertificate] = useState(formData.certificate || "");
  const [languageSkills, setLocalLanguageSkills] = useState(formData.languageSkills || "");

  const text = {
    title: {
      ko: "경력 입력",
      en: "Enter Experience",
    },
    steps: {
      ko: ["이력서\n양식", "신상\n정보", "경력", "수정", "완성"],
      en: ["Template", "Personal\nInfo", "Experience", "Edit", "Complete"],
    },
    sectionTitles: {
      ko: {
        education: "학력",
        career: "경력",
        certificate: "자격증",
        language: "외국어",
      },
      en: {
        education: "Education",
        career: "Career",
        certificate: "Certificates",
        language: "Languages",
      },
    },
    optionSelect:{
      ko:"선택",
      en:"Option",
    },
    next: {
      ko: "다음",
      en: "Next",
    },
    prev: {
      ko: "이전",
      en: "Previous",
    },
  };

  const currentStep = 2;
 
  // "다음" 버튼 클릭 시 상태 전달
  const handleNext = () => {
    // 상위 컴포넌트로 상태를 전달
    handleFormDataChange({
      education,
      career,
      certificate,
      languageSkills,
    });
    // Step4로 이동
    navigate("/step4Page", { state: { selectedTemplate, language } });
  };
  

const StyledSelect = styled.select`
  flex: 1;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  margin-right: 10px;
`;

const Select = React.memo(({ options = [], ...props }) => (
  <StyledSelect {...props}>
    <option value="">{text.optionSelect[language]}</option>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </StyledSelect>
));

  return (
    <PageWrapper>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <Container>
        <Title>{text.title[language]}</Title>

        <Stepper>
          {text.steps[language].map((step, index) => (
            <Step key={step}>
              <Circle index={index} currentStep={currentStep}>
                {step}
              </Circle>
              {index < text.steps[language].length - 1 && <Line />}
            </Step>
          ))}
        </Stepper>

        <InputSection>
          {/* 학력 */}
          <SectionTitle>{text.sectionTitles[language].education}</SectionTitle>
          <StyledTable
            type="education"
            inputComponent={Input}
            selectComponent={Select}
            showMore={true}
            language={language}
            value={education}
            onChange={setLocalEducation}
          />

          {/* 경력 */}
          <SectionTitle>{text.sectionTitles[language].career}</SectionTitle>
          <StyledTable
            type="career"
            inputComponent={Input}
            selectComponent={Select}
            showMore={true}
            language={language}
            value={career}
            onChange={setLocalCareer}
          />

          {/* 자격증 */}
          <SectionTitle>{text.sectionTitles[language].certificate}</SectionTitle>
          <StyledTable
            type="certificate"
            inputComponent={Input}
            selectComponent={Select}
            showMore={true}
            language={language}
            value={certificate}
            onChange={setLocalCertificate}
          />

          {/* 외국어 */}
          <SectionTitle>{text.sectionTitles[language].language}</SectionTitle>
          <StyledTable
            type="languageSkills"
            inputComponent={Input}
            selectComponent={Select}
            showMore={true}
            language={language}
            value={languageSkills}
            onChange={setLocalLanguageSkills}
          />
        </InputSection>

        <StepButton>
          <PreButton onClick={() => navigate("/step2Page")}>
            {text.prev[language]}
          </PreButton>
          <NextButton onClick={handleNext}>
            {text.next[language]}
          </NextButton>
        </StepButton>
      </Container>
      <Footer language={language} />
    </PageWrapper>
  );
}
 
// Styled-components
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
  font-family: sans-serif;
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: white;
  margin-top: 100px;
  margin-bottom: 30px;
`;

const Stepper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
`;

const Circle = styled.div`
  min-width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${props => props.index <= props.currentStep ? '#146c94' : 'white'};
  color: ${props => props.index <= props.currentStep ? 'white' : '#146c94'};
  border: 3px solid #146c94;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  text-align: center;
  white-space: pre-line;
  padding: 5px;
  box-sizing: border-box;
`;

const Line = styled.div`
  width: 30px;
  height: 5px;
  background-color: #146c94;
`;

const InputSection = styled.div`
  width:850px;
  background-color: white;
  padding: 0 20px 20px 20px;
  border-radius: 20px;
  box-shadow: 3px 3px 10px -3px gray;
`;

const SectionTitle = styled.h4`
  margin-top: 30px;
  text-align: left;
  font-size: 1.2rem;
  border-bottom: 1px solid black;
  padding-bottom: 0.3rem;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
`;
 
const LinkText = styled.div`
  color: white;
  background-color: #146c94;
  border: 1px solid #146c94;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  padding: 8px 20px;

  &:hover {
    color: #146c94;
    background-color: white;
  }
`;

const PreButton = styled(LinkText)`
  margin-left: 30px;
`;

const NextButton = styled(LinkText)`
  text-align: left;
  margin-right: 30px;
`;

const StepButton = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
`;
