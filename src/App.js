import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

import ReviewList from "./pages/ReviewList";
import ReviewWrite from "./pages/ReviewWrite";

import AdminDashboard from "./adminPages/AdminDashboard";
import DashboardMain from "./adminPages/dashboard/Index";
import UsersPage from "./adminPages/users/UsersPage";
import ReviewsPage from "./adminPages/reviews/ReviewsPage";

import Error400 from "./errorPages/Error400";
import Error401 from "./errorPages/Error401";
import Error403 from "./errorPages/Error403";
import Error404 from "./errorPages/Error404";
import Error500 from "./errorPages/Error500";
import Error503 from "./errorPages/Error503";

import Step1Page from "./pages/Step1Page";
import Step2Page from "./pages/Step2Page";
import Step3Page from "./pages/Step3Page";
import Step4Page from "./pages/Step4Page";
import Step5Page from "./pages/Step5"; //
import AiGeneratingLoader from "./loadings/AiGeneratingLoader";
import FileScanningLoader from "./loadings/FileScanningLoader";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "ko"
  );
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // 모든 step에서 공유할 formData
  const [formData, setFormData] = useState({
    name: "", // 이름
    firstName: "", // 성
    nameEn: "", // 영문 이름
    firstNameEn: "", // 영문 성
    email: "", // 이메일
    phone: "", // 전화번호
    birthYear: "", // 생년 (년)
    birthMonth: "", // 생월 (월)
    birthDay: "", // 생일 (일)
    address: "", // 주소
    experience: [], // 경력 (Array of experiences)
    education: "", // 학력
    career: [], // 경력
    certificate: "", // 자격증
    skills: [], // 기술 (Array of skills)
    military: {
      // 군 복무 사항
      servicePeriod: "", // 복무 기간
      branch: "", // 병과
      rank: "", // 계급
      occupation: "", // 직책
      completed: "", // 복무 완료 여부
      veteranStatus: "", // 제대 여부
    },
    languageSkills: [], // 외국어 스킬 (Array of languages)
  });

  // formData 갱신 함수 (배열 및 객체 병합 방식 변경)
  const handleFormDataChange = (newData) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };

      for (const key in newData) {
        if (newData.hasOwnProperty(key)) {
          if (
            key === "military" &&
            typeof newData.military === "object" &&
            newData.military !== null
          ) {
            updatedData.military = {
              ...prevData.military,
              ...newData.military,
            };
          } else if (
            Array.isArray(prevData[key]) &&
            Array.isArray(newData[key])
          ) {
            // Step3Page 등에서 StyledTable을 통해 배열 전체를 새로 전달하는 경우
            updatedData[key] = newData[key];
          } else {
            updatedData[key] = newData[key];
          }
        }
      }
      console.log("App.js: formData 업데이트됨 ->", updatedData);
      return updatedData;
    });
    // 변경 전 데이터
    // setFormData((prevData) => ({
    //   ...prevData,
    //   ...newData,
    //   education: Array.isArray(newData.education)
    //     ? newData.education
    //     : newData.education
    //     ? [newData.education]
    //     : prevData.education,
    //   military: newData.military
    //     ? { ...prevData.military, ...newData.military }
    //     : prevData.military,
    //   skills: newData.skills || prevData.skills,
    //   languageSkills: newData.languageSkills || prevData.languageSkills,
    //   experience: newData.experience || prevData.experience,
    // }));
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage language={language} onChangeLanguage={setLanguage} />
            }
          />
          <Route
            path="/mypage"
            element={
              <MyPage language={language} onChangeLanguage={setLanguage} />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage language={language} onChangeLanguage={setLanguage} />
            }
          />
          <Route
            path="/signup"
            element={
              <SignupPage language={language} onChangeLanguage={setLanguage} />
            }
          />
          <Route
            path="/profilepage"
            element={
              <ProfilePage language={language} onChangeLanguage={setLanguage} />
            }
          />

          <Route
            path="/step1page"
            element={
              <Step1Page
                language={language}
                onChangeLanguage={setLanguage}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                formData={formData}
                handleFormDataChange={handleFormDataChange}
              />
            }
          />
          <Route
            path="/step2page"
            element={
              <Step2Page
                language={language}
                onChangeLanguage={setLanguage}
                selectedTemplate={selectedTemplate}
                formData={formData}
                handleFormDataChange={handleFormDataChange}
              />
            }
          />
          <Route
            path="/step3page"
            element={
              <Step3Page
                language={language}
                onChangeLanguage={setLanguage}
                selectedTemplate={selectedTemplate}
                formData={formData}
                handleFormDataChange={handleFormDataChange}
              />
            }
          />
          <Route
            path="/step4page"
            element={
              <Step4Page
                language={language}
                onChangeLanguage={setLanguage}
                selectedTemplate={selectedTemplate}
                formData={formData}
                handleFormDataChange={handleFormDataChange}
              />
            }
          />
          <Route
            path="/step5page"
            element={
              <Step5Page
                language={language}
                onChangeLanguage={setLanguage}
                selectedTemplate={selectedTemplate}
                formData={formData}
                handleFormDataChange={handleFormDataChange}
              />
            }
          />
          {/* PDF 스캔 로더 라우터*/}
          <Route
            path="/scan-pdf"
            element={<FileScanningLoader />}
            // FileScanningLoader는 location.state로 fileToScan, userId 등을 받음
            // language prop은 필요시 전달: element={<FileScanningLoader language={language} />}
          />

          {/* 이력서 작성 단계 */}
          <Route
            path="/loading"
            element={<AiGeneratingLoader language={language} />}
          />

          {/* 리뷰 */}
          <Route
            path="/review"
            element={
              <ReviewList language={language} onChangeLanguage={setLanguage} />
            }
          />
          <Route
            path="/review/write"
            element={
              <ReviewWrite language={language} onChangeLanguage={setLanguage} />
            }
          />

          {/* 어드민 */}
          <Route
            path="/admin"
            element={
              <AdminDashboard
                language={language}
                onChangeLanguage={setLanguage}
              />
            }
          >
            <Route
              path="dashboard"
              element={<DashboardMain language={language} />}
            />
            <Route path="users" element={<UsersPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
          </Route>

          {/* 에러 페이지 */}
          <Route path="/error/400" element={<Error400 />} />
          <Route path="/error/401" element={<Error401 />} />
          <Route path="/error/403" element={<Error403 />} />
          <Route path="/error/500" element={<Error500 />} />
          <Route path="/error/503" element={<Error503 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
