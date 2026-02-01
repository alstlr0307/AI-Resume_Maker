import React, { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import AiGeneratingLoader from "../loadings/AiGeneratingLoader"; // 경로 예시

export default function Step4Page({
  selectedTemplate,
  language = "ko",
  formData,
  onChangeLanguage,
  handleFormDataChange,
}) {
  //const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false);
  const navigate = useNavigate();
  //const fileInputRef = useRef(null);
  //const militaryRefs = useRef({});
  const currentStep = 3;

  // const Modal = ({ children, onClose }) => {
  //   // 모달 배경 클릭 시 닫히게 (선택사항)
  //   const handleOverlayClick = (e) => {
  //     if (e.target === e.currentTarget) {
  //       onClose && onClose();
  //     }
  //   };

  //   return <ModalOverlay onClick={handleOverlayClick}>{children}</ModalOverlay>;
  // };

  // const handleStartGenerating = () => {
  //   //setIsGeneratingModalOpen(true);

  //   // 3초 후에 모달 닫고 다음 페이지 이동 (GeneratingPage 역할 대신 여기서 처리)
  //   setTimeout(() => {
  //     setIsGeneratingModalOpen(false);
  //     // 필요한 데이터 넘기기
  //     const resumeData = {
  //       /* Step4Page에서 준비한 데이터 */
  //     };
  //     navigate("/step5Page", { state: { selectedTemplate, language } });
  //   }, 3000);
  // };

  const handleNavigateToAiLoader = () => {
    // 데이터 로깅
    console.log("Step4 -> /loading으로 전달할 데이터", {
      formData: formData, // 이력서 데이터
      selectedTemplate: selectedTemplate, // 템플릿 선택
      language: language, // 언어
    });

    // 데이터 전달
    navigate("/loading", {
      // App.js에 정의된 AiGeneratingLoader 라우트 경로
      state: {
        type: "formInput", // 데이터 타입
        data: formData, // 이력서 데이터
        selectedTemplate: selectedTemplate, // 템플릿 선택
        language: language, // 언어
      },
    });
  };

  const text = {
    title: { ko: "경력 입력", en: "Enter Experience" },
    steps: {
      ko: ["이력서\n양식", "신상\n정보", "경력", "수정", "완성"],
      en: ["Template", "Personal\nInfo", "Experience", "Edit", "Complete"],
    },
    sectionTitles: {
      ko: {
        personal: "인적 사항",
        education: "학력",
        career: "경력",
        certificate: "자격증",
        language: "외국어",
        military: "병역 사항",
      },
      en: {
        personal: "Personal Information",
        education: "Education",
        career: "Career",
        certificate: "Certificates",
        language: "Languages",
        military: "Military Service",
      },
    },
    nullText: {
      ko: {
        education: "입력된 학력 정보가 없습니다.",
        career: "입력된 경력 정보가 없습니다.",
        certificate: "입력된 자격증 정보가 없습니다.",
        language: "입력된 외국어 정보가 없습니다.",
        military: "입력된 병역 정보가 없습니다.",
        photo: "사진없음",
      },
      en: {
        education: "No education information has been entered.",
        career: "No career information has been entered.",
        certificate: "No certificate information has been entered.",
        language: "No language skills have been entered.",
        military: "No military information has been entered.",
        photo: "No photo",
      },
    },
    next: { ko: "이력서 생성", en: "Create Resume" },
    prev: { ko: "이전", en: "Previous" },
    title: { ko: "신상 정보 입력", en: "Enter Personal Information" },
    inputTitle: { ko: "신상정보", en: "Personal Details" },

    photo: { ko: "+ 사진 추가", en: "+ Add Photo" },
    name: { ko: "이름", en: "First Name" },
    nameEn: { ko: "영문 이름", en: "First Name (EN)" },
    surname: { ko: "성", en: "Last Name" },
    surnameEn: { ko: "영문 성", en: "Last Name (EN)" },
    email: { ko: "이메일 주소", en: "Email Address" },
    phone: { ko: "전화번호", en: "Phone Number" },
    birth: { ko: "생년월일", en: "Date of Birth" },
    address: { ko: "주소", en: "Address" },

    military: { ko: "병역 사항", en: "Military Service" },
    militaryService: { ko: "복무기간", en: "Service Period" },
    militaryBranch: { ko: "군별", en: "Branch" },
    militaryRank: { ko: "계급", en: "Rank" },
    militarySpecialty: { ko: "병과", en: "Military Specialty" },
    militaryServiceStatus: { ko: "병역여부", en: "Service Status" },
    militaryVeteranStatus: { ko: "보훈대상", en: "Veteran Status" },

    graduationDate: { ko: "졸업일", en: "Graduation Date" },
    schoolName: { ko: "학교명", en: "School Name" },
    graduationStatus: { ko: "졸업여부", en: "Graduation Status" },
    grade: { ko: "성적", en: "Grade" },

    employmentPeriod: { ko: "근무기간", en: "Employment Period" },
    companyName: { ko: "회사명", en: "Company Name" },
    finalPosition: { ko: "최종직위", en: "Final Position" },
    responsibilities: { ko: "담당업무", en: "Responsibilities" },

    dateAcquisition: { ko: "취득일", en: "Date of Acquisition" },
    certificateName: { ko: "자격명", en: "Eertificate Name" },
    Issuer: { ko: "발행처", en: "Issuer" },

    language: { ko: "언어명", en: "Language" },
    proficiency: { ko: "구사정도", en: "Proficiency" },
    testName: { ko: "시험명", en: "Test Name" },
    score: { ko: "점수", en: "Score" },
  };

  const getText = (section, key) => {
    const langData = text[section]?.[language] || text[section]?.ko;
    if (typeof langData === "string") return langData;
    return key ? langData?.[key] || "" : langData || "";
  };
  useEffect(() => {
    console.log("📦 formData 값 확인:", formData);
  }, [formData]);

  return (
    <PageWrapper>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <Container>
        <Title>{getText("title")}</Title>

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

        <ResumeInput>
          <SectionTitle>{getText("sectionTitles", "personal")}</SectionTitle>
          <InputRow>
            <PhotoBox>
              {formData.photo ? (
                <PhotoPreview src={formData.photo} alt="Profile" />
              ) : (
                <label>{getText("nullText", "photo")}</label>
              )}
            </PhotoBox>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flex: 1,
                marginTop: "13px",
              }}
            >
              <LabeledDisplay>
                <span>{getText("surname")}</span>
                <TextDisplay>{formData.firstName || ""}</TextDisplay>
              </LabeledDisplay>
              <LabeledDisplay>
                <span>{getText("name")}</span>
                <TextDisplay>{formData.name || ""}</TextDisplay>
              </LabeledDisplay>
              <LabeledDisplay>
                <span>{getText("email")}</span>
                <TextDisplay>{formData.email || ""}</TextDisplay>
              </LabeledDisplay>
              <LabeledDisplay>
                <span>{getText("birth")}</span>
                <TextDisplay>{formData.birthYear || ""}</TextDisplay>
                <TextDisplay>{formData.birthMonth || ""}</TextDisplay>
                <TextDisplay>{formData.birthDay || ""}</TextDisplay>
              </LabeledDisplay>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                flex: 1,
                marginTop: "13px",
              }}
            >
              <LabeledDisplay>
                <span>{getText("surnameEn")}</span>
                <TextDisplay>{formData.firstNameEn || ""}</TextDisplay>
              </LabeledDisplay>
              <LabeledDisplay>
                <span>{getText("nameEn")}</span>
                <TextDisplay>{formData.nameEn || ""}</TextDisplay>
              </LabeledDisplay>
              <LabeledDisplay>
                <span>{getText("phone")}</span>
                <TextDisplay>{formData.phone || ""}</TextDisplay>
              </LabeledDisplay>
              <LabeledDisplay>
                <span>{getText("address")}</span>
                <TextDisplay>{formData.address || ""}</TextDisplay>
              </LabeledDisplay>
            </div>
          </InputRow>
        </ResumeInput>

        <InputSection>
          <SectionTitle>{getText("sectionTitles", "military")}</SectionTitle>
          {formData.military &&
          Object.values(formData.military).some(
            (value) => value && value.trim() !== ""
          ) ? (
            <Table>
              <thead>
                <tr>
                  <Th>{getText("militaryService")}</Th>
                  <Th>{getText("militaryBranch")}</Th>
                  <Th>{getText("militaryRank")}</Th>
                  <Th>{getText("militarySpecialty")}</Th>
                  <Th>{getText("militaryServiceStatus")}</Th>
                  <Th>{getText("militaryVeteranStatus")}</Th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <Td>
                    <ValueBox>
                      {(formData.military.serviceStart || "-").replace(
                        /-/g,
                        "."
                      )}{" "}
                      ~{" "}
                      {(formData.military.serviceEnd || "-").replace(/-/g, ".")}
                    </ValueBox>
                  </Td>
                  <Td>
                    <ValueBox>{formData.military.branch || "-"}</ValueBox>
                  </Td>
                  <Td>
                    <ValueBox>{formData.military.rank || "-"}</ValueBox>
                  </Td>
                  <Td>
                    <ValueBox>{formData.military.specialty || "-"}</ValueBox>
                  </Td>
                  <Td>
                    <ValueBox>{formData.military.served || "-"}</ValueBox>
                  </Td>
                  <Td>
                    <ValueBox>{formData.military.veteran || "-"}</ValueBox>
                  </Td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <div>{getText("nullText", "military")}</div>
          )}

          <SectionTitle>{getText("sectionTitles", "education")}</SectionTitle>
          {Array.isArray(formData.education) &&
          formData.education.some((row) => row.some((col) => col)) ? (
            <Table>
              <thead>
                <tr>
                  <Th>{getText("graduationDate")}</Th>
                  <Th>{getText("schoolName")}</Th>
                  <Th>{getText("graduationStatus")}</Th>
                  <Th>{getText("grade")}</Th>
                </tr>
              </thead>
              <tbody>
                {formData.education.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((col, colIdx) => (
                      <Td key={colIdx}>
                        <ValueBox>{col || "-"}</ValueBox>
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>{getText("nullText", "education")}</div>
          )}

          <SectionTitle>{getText("sectionTitles", "career")}</SectionTitle>
          {Array.isArray(formData.career) &&
          formData.career.some((row) => row.some((col) => col)) ? (
            <Table>
              <thead>
                <tr>
                  <Th>{getText("employmentPeriod")}</Th>
                  <Th>{getText("companyName")}</Th>
                  <Th>{getText("finalPosition")}</Th>
                  <Th>{getText("responsibilities")}</Th>
                </tr>
              </thead>
              <tbody>
                {formData.career.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((col, colIdx) => (
                      <Td key={colIdx}>
                        <ValueBox>{col || "-"}</ValueBox>
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>{getText("nullText", "career")}</div>
          )}

          <SectionTitle>{getText("sectionTitles", "certificate")}</SectionTitle>
          {Array.isArray(formData.certificate) &&
          formData.certificate.some((row) => row.some((col) => col)) ? (
            <Table>
              <thead>
                <tr>
                  <Th>{getText("dateAcquisition")}</Th>
                  <Th>{getText("certificateName")}</Th>
                  <Th>{getText("Issuer")}</Th>
                </tr>
              </thead>
              <tbody>
                {formData.certificate.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((col, colIdx) => (
                      <Td key={colIdx}>
                        <ValueBox>{col || "-"}</ValueBox>
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div>{getText("nullText", "certificate")}</div>
          )}

          <SectionTitle>{getText("sectionTitles", "language")}</SectionTitle>
          {Array.isArray(formData.languageSkills) &&
          formData.languageSkills.some((row) => row.some((col) => col)) ? (
            <Table>
              <thead>
                <tr>
                  <Th>{getText("language")}</Th>
                  <Th>{getText("proficiency")}</Th>
                  <Th>{getText("testName")}</Th>
                  <Th>{getText("score")}</Th>
                </tr>
              </thead>
              <tbody>
                {formData.languageSkills.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((col, colIdx) => (
                      <Td key={colIdx}>
                        <ValueBox>{col || "-"}</ValueBox>
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div style={{ marginBottom: "30px" }}>
              {getText("nullText", "language")}
            </div>
          )}
        </InputSection>

        <StepButton>
          <PreButton onClick={() => navigate("/step3page")}>
            {getText("prev")}
          </PreButton>
          <NextButton onClick={handleNavigateToAiLoader}>
            {getText("next")}
          </NextButton>
          {/* {isGeneratingModalOpen && (
            <Modal>
              <AiGeneratingLoader
                selectedTemplate={selectedTemplate}
                language={language}
              />
            </Modal>
          )} */}
        </StepButton>
      </Container>
      <Footer language={language} />
    </PageWrapper>
  );
}

// Styled-components 생략 가능 — Step2와 동일하게 유지하시면 됩니다.

// Styled-components
// 텍스트 출력용 스타일

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);

  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 999;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
`;

const Th = styled.th`
  border: 1px solid #ccc;
  padding: 12px;
  background-color: #fafafa;
  text-align: center;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 12px;
  text-align: center;
`;

const ValueBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px 12px;
  background-color: #fff;
  color: #333;
`;
const TextDisplay = styled.div`
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f5f5f5;
  text-align: left;
  white-space: pre-wrap;
`;
const PhotoPreview = styled.img`
  width: 120px;
  height: 150px;
  object-fit: cover;
`;

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
  min-width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.index <= props.currentStep ? "#146c94" : "white"};
  color: ${(props) => (props.index <= props.currentStep ? "white" : "#146c94")};
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
  width: 850px;
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

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: ${(props) => props.marginTop || "0"};
`;

const InfoSection = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 30px;
  width: 100%;
  max-width: 800px;
`;

const PhotoBox = styled.div`
  width: 120px;
  height: 150px;
  border: 2px solid #aaa;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const ResumeInput = styled.div`
  width: 830px;
  background-color: white;
  padding: 0 20px 30px 30px;
  border-radius: 20px;
  box-shadow: 3px 3px 10px -3px gray;
  margin-bottom: 30px;
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

const LabeledDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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
