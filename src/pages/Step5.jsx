import React, { useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import html2pdf from "html2pdf.js";

// ====== styled-components ======
const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
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
  max-width: 900px; /* 기존 800px에서 더 넓혀줌 */
  margin: 50px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ResumeWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 30px 40px;
  font-family: "Noto Sans KR", sans-serif;
  color: #333;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto 30px auto;
`;
const Section = styled.div`
  margin-bottom: 25px;
  text-align: left;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;
const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #146c94;
  border-bottom: 2px solid #146c94;
  padding-bottom: 8px;
  margin-bottom: 15px;
  display: inline-block;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 0.9rem;
  th,
  td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f7f9fc;
    font-weight: 500;
    white-space: nowrap;
  }
`;
const ResumeTextLine = styled.div`
  // 추가: 기존 resume-text-line 클래스 대신 사용
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 6px;
  color: #444;
  strong {
    font-weight: 500;
    color: #333;
    margin-right: 8px;
  }
`;

const AiSuggestionText = styled.div`
  white-space: pre-wrap;
  text-align: left;
  padding: 10px 0;
  line-height: 1.7;
  font-size: 0.95rem;
  color: #333;
`;

// ▼▼▼ 여기에 AiSuggestionWrapper와 AiSectionTitle 정의를 추가하세요 ▼▼▼
const AiSuggestionWrapper = styled(Section)`
  // 기존 Section 스타일을 기반으로 확장
  margin-top: 30px; // 위쪽 여백 추가
  padding: 20px; // 내부 여백 추가
  background-color: #f0f8ff; // 약간 다른 배경색 (AliceBlue)
  border: 1px solid #4a90e2; // 파란색 계열 테두리로 구분
  border-radius: 8px; // 모서리 둥글게

  // 만약 className="resume-section"을 사용하고 싶다면,
  // 이 컴포넌트를 사용하는 곳에서 <AiSuggestionWrapper className="resume-section ai-suggestion-section"> 처럼
  // 클래스네임을 추가하고, 외부 CSS에서 .ai-suggestion-section 에 대한 추가 스타일을 정의할 수도 있습니다.
`;

const AiSectionTitle = styled(SectionTitle)`
  // 기존 SectionTitle 스타일을 기반으로 확장
  color: #0056b3; // AI 섹션 제목 색상을 약간 다르게
  border-bottom-color: #4a90e2; // 밑줄 색상도 통일
`;
// ▲▲▲ 여기까지 추가 ▲▲▲

// 텍스트 객체 (기존 ResumePreview.jsx의 것 사용, AI 섹션 제목 추가)
const textContent = {
  // 변수명 text -> textContent
  title: { ko: "이력서 최종본 및 AI 제안", en: "Final Resume & AI Suggestion" },
  steps: {
    ko: ["이력서\n양식", "신상\n정보", "경력", "수정", "최종 확인"],
    en: ["Template", "Personal\nInfo", "Experience", "Modify", "Final Review"],
  },
  sectionTitles: {
    ko: {
      personal: "기본 사항",
      education: "학력 사항",
      career: "경력 사항",
      certificate: "자격증",
      language: "외국어 능력",
      military: "병역 사항",
      skills: "보유 기술",
      experience: "주요 경험 및 활동", // App.js formData에 맞춰 추가
      aiSuggestion: "AI 자기소개서 작성 제안", // ⭐ AI 섹션 제목 추가
    },
    en: {
      /* ... 영어 번역 ... */
    },
  },
  downloadPDF: { ko: "PDF 다운로드", en: "Download PDF" }, // 버튼 텍스트 수정
  retryAI: { ko: "AI 제안 다시받기", en: "Regenerate AI Suggestion" }, // 버튼 텍스트 수정
};

// ====== 컴포넌트 시작 ======
// props로 App.js에서 전달하는 language, onChangeLanguage 등을 받을 수 있습니다.
// 하지만 핵심 데이터는 location.state에서 가져옵니다.
const ResumePreview = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // AiGeneratingLoader에서 전달받은 state 우선 사용
  const receivedState = location.state || {};
  const originalData = receivedState.originalData || {}; // AI 처리 전 formData
  const aiSuggestion = receivedState.suggestion; // AI 수정 제안 텍스트
  const aiError = receivedState.error;
  // language와 selectedTemplate은 state에 없으면 App.js의 props(또는 기본값) 사용
  const language = receivedState.language || props.language || "ko";
  const selectedTemplate =
    receivedState.selectedTemplate || props.selectedTemplate || 1;

  const currentStep = 4; // "최종 확인" 단계

  // 템플릿별 CSS 동적 로드
  useEffect(() => {
    const id = "dynamic-resume-style";
    let styleSheet = document.getElementById(id);
    if (styleSheet) styleSheet.remove();

    styleSheet = document.createElement("link");
    styleSheet.id = id;
    styleSheet.rel = "stylesheet";
    styleSheet.type = "text/css";
    styleSheet.href = `/resumePreview/${selectedTemplate}.css`; // public 폴더 내 경로
    document.head.appendChild(styleSheet);

    return () => {
      if (styleSheet && document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, [selectedTemplate]);

  const getText = (sectionKey, subKey) => {
    const sectionContent = textContent[sectionKey];
    const langData = sectionContent?.[language] || sectionContent?.ko;
    if (typeof langData === "string") return langData;
    return subKey ? langData?.[subKey] || "" : langData || "";
  };

  const downloadPDF = () => {
    const element = document.getElementById("pdf-download-area"); // ID 수정
    if (element) {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: "SARAM_이력서_최종.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          logging: true,
          useCORS: true,
          scrollY: -window.scrollY,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        //페이지 나누기 관련 옵션 (내용이 길어질 경우 자동으로 페이징)
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      html2pdf().from(element).set(opt).save();
    } else {
      console.error(
        "PDF 다운로드 대상 영역('pdf-download-area')을 찾을 수 없습니다."
      );
    }
  };

  const retryPayload = receivedState.retryPayloadForAiLoader || {
    type: Object.keys(originalData).length > 0 ? "formInput" : "unknown",
    data:
      receivedState.type === "resumeId" &&
      receivedState.data &&
      receivedState.type !== "formInput"
        ? receivedState.data
        : originalData,
    originalData: receivedState.type === "resumeId" ? originalData : undefined,
    selectedTemplate: selectedTemplate,
    language: language,
  };

  // originalData (formData)에서 필요한 값들 안전하게 추출
  // App.js의 formData 초기값 및 Step 페이지들의 입력 필드명을 기준으로 합니다.
  const {
    name = "",
    firstName = "",
    nameEn = "",
    firstNameEn = "",
    email = "",
    phone = "",
    birthYear = "",
    birthMonth = "",
    birthDay = "",
    address = "",
    photo = null,
    education = [],
    career = [],
    certificate = [],
    languageSkills = [],
    military = {},
    skills = [],
    experience = [],
    // 만약 사용자가 직접 작성한 자기소개서 항목(예: 성장과정, 지원동기)이 originalData에 있다면 여기서 추출
    // selfIntroduction = "", motivation = ""
  } = originalData;

  const age = birthYear
    ? new Date().getFullYear() - parseInt(birthYear) + 1
    : "";

  // AI 처리 중 에러가 있었다면 먼저 표시
  if (aiError) {
    return (
      <PageWrapper>
        <Header language={language} onChangeLanguage={props.onChangeLanguage} />
        <MainContent>
          <Title>AI 처리 오류</Title>
          <Stepper>
            {" "}
            {/* Stepper JSX는 간결하게 유지 */}
            {getText("steps").map((step, index) => (
              <Step key={index}>
                <Circle index={index} currentStep={currentStep}>
                  {step}
                </Circle>
                {index < getText("steps").length - 1 && <Line />}
              </Step>
            ))}
          </Stepper>
          <ResumeWrapper
            style={{ textAlign: "center", color: "red", padding: "30px" }}
          >
            <SectionTitle>오류 발생</SectionTitle>
            <p>{aiError}</p>
            <StepButton style={{ justifyContent: "center", marginTop: "20px" }}>
              <PreButton
                onClick={() => {
                  if (!retryPayload.type || !retryPayload.data) {
                    alert(
                      "AI 재시도를 위한 정보가 부족합니다. 이력서 작성 첫 단계로 이동합니다."
                    );
                    navigate("/step1page");
                  } else {
                    navigate("/loading", { state: retryPayload });
                  }
                }}
              >
                {getText("retryAI")}
              </PreButton>
            </StepButton>
          </ResumeWrapper>
        </MainContent>
        <Footer language={language} />
      </PageWrapper>
    );
  }

  // 표시할 원본 데이터가 없다면 (AI 제안도 없다고 가정)
  if (Object.keys(originalData).length === 0 && !aiSuggestion) {
    return (
      <PageWrapper>
        <Header language={language} onChangeLanguage={props.onChangeLanguage} />
        <MainContent>
          <Title>데이터를 불러오는 중...</Title> {/* 또는 "데이터 없음" */}
          <p>
            표시할 이력서 정보가 없거나 로딩 중입니다. 문제가 지속되면 처음부터
            다시 시도해 주세요.
          </p>
          <button onClick={() => navigate("/step1page")}>
            이력서 작성 시작
          </button>
        </MainContent>
        <Footer language={language} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header language={language} onChangeLanguage={props.onChangeLanguage} />
      <MainContent>
        <Title>{getText("title")}</Title>
        <Stepper>
          {getText("steps").map((step, index) => (
            <Step key={index}>
              <Circle index={index} currentStep={currentStep}>
                {step}
              </Circle>
              {index < getText("steps").length - 1 && <Line />}
            </Step>
          ))}
        </Stepper>
        {/* 이력서 내용 전체를 감싸는 div에 ID 부여 */}
        <ResumeWrapper
          id="pdf-download-area"
          className={`resume-template-${selectedTemplate}`}
        >
          {/* Left Column: 사진, 기본사항, 자격증 등 */}
          <div className="resume-left">
            {photo && <img src={photo} alt="사진" className="resume-photo" />}
            <div className="resume-name">
              {firstName} {name}
            </div>
            {nameEn && firstNameEn && (
              <div className="resume-name-en">
                {nameEn} {firstNameEn}
              </div>
            )}

            <div className="resume-section">
              <div className="resume-section-title">
                {getText("sectionTitles", "personal")}
              </div>
              <div className="resume-text-line">이메일: {email || "-"}</div>
              <div className="resume-text-line">전화번호: {phone || "-"}</div>
              <div className="resume-text-line">
                생년월일: {birthYear || "-"}.{birthMonth || "-"}.
                {birthDay || "-"} {age && `(만 ${age}세)`}
              </div>
              <div className="resume-text-line">주소: {address || "-"}</div>
            </div>

            {Array.isArray(certificate) &&
              certificate.length > 0 &&
              certificate.some(
                (row) => Array.isArray(row) && row.some((col) => col)
              ) && (
                <div className="resume-section">
                  <div className="resume-section-title">
                    {getText("sectionTitles", "certificate")}
                  </div>
                  {certificate.map((row, i) => (
                    <div className="resume-text-line" key={i}>
                      {/* 자격명: row[1], 취득일: row[0], 발행처: row[2] (실제 데이터 순서 확인!) */}
                      {(row && row[1]) || "-"} (취득일:{" "}
                      {row && row[0] ? String(row[0]).replace(/-/g, ".") : "-"},
                      발행처: {(row && row[2]) || "-"})
                    </div>
                  ))}
                </div>
              )}
            {/* 보유 기술 */}
            {Array.isArray(skills) &&
              skills.length > 0 &&
              skills.some((skill) => skill && String(skill).trim() !== "") && (
                <div className="resume-section">
                  <div className="resume-section-title">
                    {getText("sectionTitles", "skills")}
                  </div>
                  <div className="resume-text-line">{skills.join(", ")}</div>
                </div>
              )}
          </div>{" "}
          {/* End of resume-left */}
          <div className="resume-right">
            {/* 학력 사항 */}
            {Array.isArray(education) &&
              education.length > 0 &&
              education.some(
                (row) => Array.isArray(row) && row.some((col) => col)
              ) && (
                <div className="resume-section">
                  <div className="resume-section-title">
                    {getText("sectionTitles", "education")}
                  </div>
                  <Table className="resume-table">
                    <thead>
                      <tr>
                        <th>졸업일(예정일)</th>
                        <th>학교명</th>
                        <th>졸업여부</th>
                        <th>학점/만점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {education.map((row, i) => (
                        <tr key={i}>
                          {(row || []).map((col, j) => (
                            <td key={j}>
                              {String(col || "-").replace(/-/g, ".")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

            {/* 경력 사항 */}
            {Array.isArray(career) &&
              career.length > 0 &&
              career.some(
                (row) => Array.isArray(row) && row.some((col) => col)
              ) && (
                <div className="resume-section">
                  <div className="resume-section-title">
                    {getText("sectionTitles", "career")}
                  </div>
                  <Table className="resume-table">
                    <thead>
                      <tr>
                        <th>근무기간</th>
                        <th>회사명</th>
                        <th>최종직위</th>
                        <th>담당업무</th>
                      </tr>
                    </thead>
                    <tbody>
                      {career.map((row, i) => (
                        <tr key={i}>
                          {(row || []).map((col, j) => (
                            <td key={j}>
                              {String(col || "-").replace(/-/g, ".")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

            {/* 주요 경험 및 활동 */}
            {Array.isArray(experience) && experience.length > 0 && (
              <div className="resume-section">
                <div className="resume-section-title">
                  {getText("sectionTitles", "experience")}
                </div>
                {experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: "10px" }}>
                    <ResumeTextLine>
                      <strong>{exp.activityName || "활동명 없음"}</strong>{" "}
                      {exp.role && `(${exp.role})`}
                    </ResumeTextLine>
                    {exp.period && (
                      <ResumeTextLine>
                        <strong>기간:</strong> {exp.period.replace(/-/g, ".")}
                      </ResumeTextLine>
                    )}
                    {/* 내용은 여러 줄일 수 있으므로 pre-wrap 처리된 ResumeTextLine 또는 div 사용 */}
                    {exp.description && (
                      <div
                        className="resume-text-line"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        <strong>내용:</strong> {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 병역 사항 */}
            {military &&
              Object.values(military).some(
                (val) => val && String(val).trim() !== ""
              ) && (
                <div className="resume-section">
                  <div className="resume-section-title">
                    {getText("sectionTitles", "military")}
                  </div>
                  <ResumeTextLine>
                    <strong>복무기간:</strong>{" "}
                    {(military.serviceStart || "-").replace(/-/g, ".")} ~{" "}
                    {(military.serviceEnd || "-").replace(/-/g, ".")}
                  </ResumeTextLine>
                  <ResumeTextLine>
                    <strong>군별:</strong> {military.branch || "-"} /{" "}
                    <strong>계급:</strong> {military.rank || "-"} /{" "}
                    <strong>병과(특기):</strong> {military.specialty || "-"}
                  </ResumeTextLine>
                  <ResumeTextLine>
                    <strong>병역여부:</strong> {military.served || "-"} /{" "}
                    <strong>보훈대상:</strong> {military.veteran || "-"}
                  </ResumeTextLine>
                </div>
              )}

            {/* 외국어 능력 */}
            {Array.isArray(languageSkills) &&
              languageSkills.length > 0 &&
              languageSkills.some(
                (row) => Array.isArray(row) && row.some((col) => col)
              ) && (
                <div className="resume-section">
                  <div className="resume-section-title">
                    {getText("sectionTitles", "language")}
                  </div>
                  <Table className="resume-table">
                    <thead>
                      <tr>
                        <th>언어</th>
                        <th>구사정도</th>
                        <th>시험명</th>
                        <th>점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {languageSkills.map((row, i) => (
                        <tr key={i}>
                          {(row || []).map((col, j) => (
                            <td key={j}>{col || "-"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

            {/* ▼ AI 자기소개서 제안 섹션 (외국어 또는 마지막 사용자 입력 섹션 아래) ▼ */}
            {aiSuggestion && (
              <AiSuggestionWrapper className="resume-section ai-suggestion-section">
                {" "}
                {/* className 추가하여 외부 CSS와 연동 가능 */}
                <AiSectionTitle>
                  {getText("sectionTitles", "aiSuggestion")}
                </AiSectionTitle>
                <AiSuggestionText>{aiSuggestion}</AiSuggestionText>
              </AiSuggestionWrapper>
            )}
            {/* ▲ AI 자기소개서 제안 섹션 끝 ▲ */}

            {/* TODO: 사용자가 직접 작성한 자기소개서 항목들(성장과정, 지원동기 등)이 있다면 여기에 표시 */}
            {/* 예시: 
            {originalData.selfIntroduction && (
              <Section className="resume-section">
                <SectionTitle>자기소개 (사용자 작성)</SectionTitle>
                <ResumeTextLine style={{whiteSpace: 'pre-wrap'}}>{originalData.selfIntroduction}</ResumeTextLine>
              </Section>
            )}
            */}
          </div>{" "}
          {/* End of resume-right */}
        </ResumeWrapper>{" "}
        {/* End of id="pdf-download-area" div */}
        <StepButton>
          <PreButton
            onClick={() => {
              if (!retryPayload.type || !retryPayload.data) {
                alert(
                  "AI 재시도를 위한 정보가 부족하여 이력서 작성 첫 단계로 이동합니다."
                );
                navigate("/step1page");
              } else {
                navigate("/loading", { state: retryPayload });
              }
            }}
          >
            {getText("retryAI")}
          </PreButton>
          <NextButton onClick={downloadPDF}>
            {getText("downloadPDF")}
          </NextButton>
        </StepButton>
      </MainContent>
      <Footer language={language} />
    </PageWrapper>
  );
};

export default ResumePreview;
