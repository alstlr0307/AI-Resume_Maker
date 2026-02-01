import React, { useState, useRef } from "react";
import styled from "styled-components";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

import resume1 from "../assets/resume01.png";
import resume2 from "../assets/resume02.png";
import resume3 from "../assets/resume03.png";
import resume4 from "../assets/resume04.png";
import resume5 from "../assets/resume05.png";
import resume6 from "../assets/resume06.png";
import resume7 from "../assets/resume07.png";
import resume8 from "../assets/resume08.png";

const resumeImages = [resume1, resume2, resume3, resume4, resume5, resume6, resume7, resume8];
const resumeDescriptions = [
  "깔끔한 흑백 레이아웃으로 기본 정보 위주로 구성된 템플릿입니다.",
  "파란색 강조 포인트가 있는 이력서로, 경력 중심에 적합합니다.",
  "사진과 자기소개가 강조된 템플릿으로 신입 이력서에 좋습니다.",
  "컬러 포인트가 있는 세련된 디자인, 포트폴리오 포함 시 적합합니다.",
  "심플하고 조용한 인상을 주는 템플릿, 무난하게 사용 가능.",
  "경력과 자격 사항을 강조한 실무형 이력서 템플릿입니다.",
  "푸른색의 강조와 한쪽 정렬된 디자인으로 깔끔한 느낌을 줍니다.",
  "짙은 푸른색의 배치와 깔끔한 디자인으로 전문적인 느낌을 줍니다.",
];

export default function Step1Page({ language, onChangeLanguage, selectedTemplate, setSelectedTemplate, formData, handleFormDataChange }) {
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const currentStep = 0;


  const text = {
    title: {
      ko: "이력서 양식 선택",
      en: "Select Resume Template",
    },
    steps: {
      ko: ["이력서\n양식", "신상\n정보", "경력", "수정", "완성"],
      en: ["Template", "Personal\nInfo", "Experience", "Edit", "Complete"],
    },
    templateLabel: {
      ko: (n) => `양식 ${n}`,
      en: (n) => `Template ${n}`,
    },
    select: {
      ko: "선택",
      en: "Select",
    },
  };

  const handleTemplateSelect = (n) => {
    setSelectedTemplate(n);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleNext = () => {
    if (selectedTemplate) {
      navigate('/step2page', { state: { selectedTemplate, language } });
    } else {
      alert('템플릿을 선택해주세요.');
    }
  };

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type !== "application/pdf") {
        alert("PDF 파일만 업로드할 수 있습니다.");
        e.target.value = ""; // 잘못된 파일 초기화
        return;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedTemplate(reader.result);
            setShowPreview(true);
        };
        reader.readAsDataURL(file);
      }
    };


  return (
    <PageWrapper>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <MainContent>
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

        <ButtonContainer>
          <AddButton onClick={handleButtonClick}>PDF파일 첨부</AddButton>
          <HiddenInput
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </ButtonContainer>

        <TemplateGrid>
          {resumeImages.map((img, index) => (
            <TemplateCard
              key={index}
              onClick={() => handleTemplateSelect(index + 1)}
              selected={selectedTemplate === index + 1}
            >
              <TemplateImage src={img} alt={`Template ${index + 1}`} />
              <Label>{text.templateLabel[language](index + 1)}</Label>
            </TemplateCard>
          ))}
        </TemplateGrid>

        <SelectedTemplateModal show={showPreview}>
          <ModalContent>
            <CloseButton onClick={handleClosePreview}>×</CloseButton>
            {/* PDF가 있으면 PDF 미리보기 */}
            {typeof selectedTemplate === "string" && selectedTemplate.startsWith("data:application/pdf") ? (
              <embed
                src={selectedTemplate}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            ) : selectedTemplate ? (
              // 이미지 템플릿 미리보기
              <>
                <ModalImage src={resumeImages[selectedTemplate - 1]} alt={`Template ${selectedTemplate}`} />
                <Label>{text.templateLabel[language](selectedTemplate)}</Label>
                <Description>{resumeDescriptions[selectedTemplate - 1]}</Description>
              </>
            ) : (
              <Description>선택된 템플릿이나 첨부 파일이 없습니다.</Description>
            )}
            <SelectButtonContainer>
              <SelectButton onClick={handleNext}>{text.select[language]}</SelectButton>
            </SelectButtonContainer>
          </ModalContent>
        </SelectedTemplateModal>

        <FooterSpacer />
      </MainContent>
      <Footer language={language} />
    </PageWrapper>
  );
}

const HiddenInput = styled.input`
  display: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AddButton = styled.button`
  margin: 10px;
  padding: 0.7rem 2rem;
  border-radius: 30px;
  border: none;
  background-color: #146c94;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-align: right;

  &:hover {
    background: white;
    color: #146c94;
  }
`;

const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  padding-top: 120px;
  max-width: 1400px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color:rgb(255, 255, 255);
  text-align: center;
  margin-bottom: 2rem;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  justify-content: center;
`;

const TemplateCard = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: ${(props) =>
    props.selected ? '0 0 0 3px #146c94' : '0 2px 8px rgba(0,0,0,0.08)'};
  padding: 1rem;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

const TemplateImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: contain;
  border-radius: 12px;
  background-color: #f6faff;
  padding: 10px;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  margin-top: 0.5rem;
`;

const SelectedTemplateModal = styled.div`
  position: fixed;
  display: ${(props) => (props.show ? 'flex' : 'none')};
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 4vh 2rem;  // ✅ 상단/하단에 여백 확보 (기존: 2rem)
  overflow-y: auto;
`;


const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 85vh;       // ✅ 전체 모달 높이 제한
  overflow: hidden;       // ✅ 내부 스크롤 제거
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;


const ModalImage = styled.img`
  width: 100%;
  max-height: 60vh;  // ✅ 화면의 60%까지만 표시
  object-fit: contain;
  border-radius: 10px;
  background: #fafafa;
  margin-bottom: 1.5rem;
`;


const Description = styled.p`
  font-size: 1.1rem;
  color: #444;
  text-align: center;
  margin: 1rem 0 1.5rem 0;
  line-height: 1.6;
  padding: 0 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: bold;
  color: #444;
  cursor: pointer;
  z-index: 1001;

  &:hover {
    color: #146c94;
  }
`;

const SelectButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const SelectButton = styled.button`
  padding: 0.7rem 2rem;
  border-radius: 10px;
  border: none;
  background-color: #146c94;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: white;
    color: #146c94;
    border: 1px solid #146c94;
  }
`;

const FooterSpacer = styled.div`
  height: 100px;
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
