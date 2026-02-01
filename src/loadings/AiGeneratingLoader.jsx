// src/loadings/AiGeneratingLoader.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../api/axios"; // Axios 인스턴스 (경로 확인!)
// formData를 AI API 요청 형식으로 변환하는 헬퍼 함수
// 이 파일이 src/utils/ 폴더에 있고, 올바르게 구현되어 있어야 합니다!
import { formatResumeDataForAI } from "../utils/resumeFormatter";

// Styled-components (기존과 동일)
const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;
const LoaderWrapper = styled.div`
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  position: fixed;
  background: rgba(224, 244, 255, 0.95); // 약간의 투명도 추가
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999; // 다른 요소들 위에 표시
`;
const Dots = styled.div`
  display: flex;
  gap: 10px;
`;
const Dot = styled.div`
  width: 18px;
  height: 18px;
  background-color: #4a90e2; // 메인 테마 색상과 유사하게
  border-radius: 50%;
  animation: ${bounce} 0.6s infinite;
  animation-delay: ${({ delay }) => delay};
`;
const Message = styled.p`
  margin-top: 30px;
  font-size: 1.2rem;
  color: #333; // 가독성 좋은 색상
  font-weight: 500; // 약간의 굵기
`;
const ErrorMessage = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: red;
  max-width: 80%;
  background-color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid red;
  text-align: center;
`;

// 텍스트 객체 (국제화 지원)
const textContent = {
  CreatingResume: {
    ko: "AI가 이력서를 분석하고 생성 중입니다...\n잠시만 기다려 주세요.",
    en: "AI is analyzing and creating your resume...\nPlease wait a moment.",
  },
  ProcessingError: { ko: "처리 중 오류 발생", en: "Error during processing" },
};

function AiGeneratingLoader({ language = "ko" }) {
  // App.js의 Route에서 language prop을 받음
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달받은 데이터
  // 예: { type: "formInput", data: formData, selectedTemplate, language, ... }
  // 또는 { type: "resumeId", data: userResumeId, originalData, selectedTemplate, language, ... }
  const inputPayload = location.state;

  const [aiSuggestion, setAiSuggestion] = useState(""); // AI가 생성한 최종 텍스트
  const [aiError, setAiError] = useState(null); // API 호출 중 에러 상태
  const [processing, setProcessing] = useState(true); // API 호출 진행 상태

  // 현재 컴포넌트의 language prop 또는 inputPayload에서 전달받은 language 사용
  const currentLanguage = inputPayload?.language || language;

  const getText = (sectionKey) => {
    return (
      textContent[sectionKey]?.[currentLanguage] ||
      textContent[sectionKey]?.ko ||
      "AI 처리 중..."
    );
  };

  useEffect(() => {
    let isMounted = true; // 컴포넌트 언마운트 시 비동기 작업 상태 업데이트 방지

    const callAiGenerationAPI = async () => {
      if (!inputPayload || !inputPayload.type || !inputPayload.data) {
        if (isMounted) {
          setAiError("AI 처리에 필요한 데이터가 올바르게 전달되지 않았습니다.");
          setProcessing(false);
        }
        return;
      }

      console.log("AiGeneratingLoader가 받은 inputPayload:", inputPayload);
      let apiResponse;

      try {
        if (inputPayload.type === "formInput") {
          // 시나리오 A: Step4Page에서 전체 formData를 받아 AI에게 전달
          const formData = inputPayload.data;
          // formData를 백엔드 API가 요구하는 sections: Map<String, String> 형태로 변환
          const sectionsForApi = formatResumeDataForAI(formData);
          console.log(
            "AI API (/generate-from-form)로 보낼 sections:",
            sectionsForApi
          );

          apiResponse = await api.post("/api/coverletter/generate-from-form", {
            sections: sectionsForApi,
            // TODO: 필요시 userId, selectedTemplate 등 추가 정보도 API 요청에 포함
            // userId: inputPayload.userId, // UserData와 연결된 UserResume을 생성/업데이트해야 한다면
            // templateId: inputPayload.selectedTemplate
          });
        } else if (inputPayload.type === "resumeId") {
          // 시나리오 C: FileScanningLoader에서 PDF 처리 후 이력서 ID를 받아옴
          const userResumeId = inputPayload.data;
          console.log(
            `AI API (/suggest-from-resume/${userResumeId}) 호출 중...`
          );

          apiResponse = await api.post(
            `/api/coverletter/suggest-from-resume/${userResumeId}`
          );
          // 이 경우, inputPayload.originalData (FileScanningLoader가 전달한 초기 formData)를
          // Step5Page로 그대로 전달하여 원본 정보로 활용 가능
        } else {
          throw new Error(
            "알 수 없는 AI 처리 요청 타입입니다: " + inputPayload.type
          );
        }

        // 공통 응답 처리
        if (isMounted) {
          if (apiResponse && apiResponse.data && apiResponse.data.letter) {
            setAiSuggestion(apiResponse.data.letter);
            console.log("AI 처리 성공! 결과:", apiResponse.data.letter);
          } else {
            setAiError(
              "AI 응답을 받았으나, 예상된 형식이 아닙니다 (응답에 letter 필드 누락)."
            );
          }
        }
      } catch (err) {
        console.error("AI API 호출 오류:", err);
        if (isMounted) {
          let message = "AI 처리 중 오류가 발생했습니다.";
          if (err.response && err.response.data) {
            message =
              err.response.data.message ||
              (typeof err.response.data === "string"
                ? err.response.data
                : message) ||
              `서버 오류 (${err.response.status})`;
          } else if (err.message) {
            // Network Error 등 axios 자체 에러
            message = err.message;
          }
          setAiError(message);
        }
      } finally {
        if (isMounted) {
          setProcessing(false); // 성공/실패 여부와 관계없이 API 처리 완료
        }
      }
    };

    callAiGenerationAPI(); // 컴포넌트 마운트 시 API 호출 실행

    return () => {
      // 클린업 함수
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputPayload]); // inputPayload가 변경될 때만 (보통 페이지 진입 시 한 번) 실행

  // API 처리 완료 후 Step5Page로 이동하는 useEffect
  useEffect(() => {
    if (!processing) {
      // API 호출이 완료되었을 때만 실행
      const timer = setTimeout(
        () => {
          if (navigate) {
            // navigate 함수 유효성 체크 (테스트 환경 등에서 없을 수 있음)
            // Step5Page로 전달할 데이터 구성
            // originalData는 AI 처리 전의 원본 데이터 (formData 또는 FileScanningLoader가 전달한 originalFormData)
            const originalDataForStep5 =
              inputPayload?.type === "formInput"
                ? inputPayload.data
                : inputPayload?.originalData || {};

            console.log("Step5Page로 전달할 최종 데이터:", {
              originalData: originalDataForStep5,
              suggestion: aiSuggestion,
              error: aiError,
              selectedTemplate: inputPayload?.selectedTemplate,
              language: inputPayload?.language || currentLanguage, // inputPayload에 없으면 현재 컴포넌트 language 사용
            });

            navigate("/step5page", {
              // App.js에 정의된 Step5Page 라우트 경로
              state: {
                originalData: originalDataForStep5,
                suggestion: aiSuggestion,
                error: aiError,
                selectedTemplate: inputPayload?.selectedTemplate,
                language: inputPayload?.language || currentLanguage,
              },
            });
          }
        },
        aiError ? 3000 : 1500
      ); // 에러 시 메시지를 좀 더 보여주고, 성공 시는 빠르게 이동

      return () => clearTimeout(timer); // 클린업
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processing, aiSuggestion, aiError, inputPayload, currentLanguage]); // navigate는 안정적이므로 제외 가능

  return (
    <LoaderWrapper>
      <Dots>
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </Dots>
      {aiError ? (
        <ErrorMessage>
          {getText("ProcessingError")}: {aiError}
        </ErrorMessage>
      ) : (
        // 메시지를 pre-wrap으로 처리하여 \n 줄바꿈 반영
        <Message style={{ whiteSpace: "pre-wrap" }}>
          {getText("CreatingResume")}
        </Message>
      )}
    </LoaderWrapper>
  );
}

export default AiGeneratingLoader;
