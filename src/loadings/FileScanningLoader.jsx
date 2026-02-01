// src/loadings/FileScanningLoader.jsx
import React, { useEffect, useState } from "react"; // React 임포트
import styled, { keyframes } from "styled-components";
import api from "../api/axios"; // 👈 Axios 인스턴스 경로를 확인해주세요!
import { useNavigate, useLocation } from "react-router-dom";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #e0f4ff; /* 또는 선호하는 로딩 배경색 */
  text-align: center;
  position: fixed; /* 전체 화면을 덮도록 */
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 9999; /* 다른 요소들 위에 오도록 */
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 8px solid #d3eefa;
  border-top: 8px solid #4aa1e0;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.p`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #444;
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

function FileScanningLoader() {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true); // API 호출 진행 상태를 명시적으로 관리

  useEffect(() => {
    let isMounted = true; // 컴포넌트 언마운트 시 비동기 작업 취소용 플래그

    const processUploadedFile = async () => {
      // 이전 페이지(예: Step1Page)에서 navigate state로 전달받은 데이터
      const {
        fileToScan, // 사용자가 선택한 File 객체
        userId, // 사용자 ID
        language, // 현재 언어 설정
        selectedTemplate, // 선택된 템플릿 정보 (PDF 경로에서는 null일 수 있음)
        originalFormData, // PDF 업로드 전 다른 단계에서 수집된 formData
      } = location.state || {}; // location.state가 없을 경우를 대비한 기본값

      if (!isMounted) return; // 이미 언마운트되었다면 아무것도 안 함

      // 필수 데이터 유효성 검사
      if (!fileToScan || !(fileToScan instanceof File)) {
        setError(
          "스캔할 PDF 파일이 올바르게 전달되지 않았습니다. 이전 페이지로 돌아가세요."
        );
        setProcessing(false);
        return;
      }

      if (!userId) {
        setError(
          "사용자 ID가 전달되지 않았습니다. 로그인이 필요할 수 있습니다."
        );
        setProcessing(false);
        return;
      }

      // 서버로 보낼 FormData 객체 생성
      const formDataApi = new FormData();
      formDataApi.append("file", fileToScan);
      formDataApi.append("userId", String(userId)); // 백엔드가 Long 타입을 기대해도 FormData는 문자열로 전송

      try {
        console.log(
          `FileScanningLoader: PDF 업로드 및 스캔 시작 - userId=${userId}, fileName=${fileToScan.name}`
        );

        // 백엔드 API 호출 (PDF 업로드 및 텍스트 추출)
        const response = await api.post("/api/resumes/upload", formDataApi);

        if (isMounted) {
          const uploadedResume = response.data; // 백엔드에서 반환된 UserResume 객체
          console.log(
            "FileScanningLoader: PDF 업로드 및 스캔 성공:",
            uploadedResume
          );

          // 성공 후 AiGeneratingLoader (경로: /loading)로 이동
          // 업로드된 이력서 ID와 필요한 다른 정보들을 state로 전달
          navigate("/loading", {
            state: {
              type: "resumeId", // AiGeneratingLoader에게 어떤 타입의 데이터인지 알려줌
              data: uploadedResume.id, // 새로 생성/수정된 UserResume의 ID
              language: language,
              selectedTemplate: selectedTemplate,
              originalData: originalFormData || {}, // 기존에 입력된 다른 form 데이터
            },
          });
        }
      } catch (err) {
        console.error("FileScanningLoader: PDF 업로드 및 스캔 오류:", err);
        if (isMounted) {
          let message = "이력서 파일 처리 중 오류가 발생했습니다.";
          if (err.response && err.response.data) {
            message =
              err.response.data.message ||
              (typeof err.response.data === "string"
                ? err.response.data
                : message) ||
              err.response.statusText ||
              `서버 오류 (${err.response.status})`;
          } else if (err.message) {
            message = err.message; // 예: Network Error
          }
          setError(message);
          setProcessing(false);
        }
      }
    };

    if (location.state) {
      // location.state가 있을 때만 파일 처리 시도
      processUploadedFile();
    } else {
      if (isMounted) {
        setError(
          "파일 정보를 찾을 수 없습니다. 이전 페이지에서 다시 시도해주세요."
        );
        setProcessing(false);
        // 선택적: 데이터가 없을 경우 몇 초 후 자동으로 이전 페이지로 이동
        // setTimeout(() => { if (isMounted && navigate) navigate(-1); }, 3000);
      }
    }

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 플래그 설정
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]); // location.state가 변경될 때마다 useEffect 실행 (보통 페이지 진입 시 한 번)

  // API 처리(성공 또는 실패) 후 페이지 이동을 위한 useEffect
  // processing 상태가 false (즉, API 호출 완료)가 되고, 에러가 있다면 잠시 에러를 보여준 후 이동하거나
  // 성공 시에는 이미 navigate가 호출되었으므로, 이 부분은 에러 발생 시 특정 페이지로 이동 등에 활용 가능
  useEffect(() => {
    if (!processing && error) {
      // 예시: 에러가 있다면 3초 후 이전 페이지로 이동
      const timer = setTimeout(() => {
        if (navigate) navigate(-1); // 또는 특정 에러 페이지로 이동 navigate('/error-page');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [processing, error, navigate]);

  return (
    <LoaderWrapper>
      <Spinner />
      {error ? (
        <ErrorMessage>오류 : {error}</ErrorMessage>
      ) : (
        <Message>이력서를 스캔하고 분석 중입니다...</Message> // 메시지 변경
      )}
    </LoaderWrapper>
  );
}

export default FileScanningLoader;
