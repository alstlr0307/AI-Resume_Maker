// src/utils/resumeFormatter.js

/**
 * 개인 정보(인적 사항)를 AI에게 전달할 문자열로 포맷팅합니다.
 * @param {object} formData - 전체 이력서 데이터 객체. photo는 base64 문자열일 수 있습니다.
 * @returns {string} 포맷팅된 개인 정보 문자열
 */
const formatPersonalInfoForAI = (formData) => {
    if (!formData) return "입력된 인적 사항 정보 없음";
    
    // 이름 필드는 formData.name (성)과 formData.firstName (이름)을 조합하거나,
    // 또는 단일 필드(예: formData.fullName)를 사용할 수 있습니다.
    // 제공해주신 App.js의 formData 초기값과 Step2Page의 입력 필드를 기준으로 합니다.
    const koreanName = `${formData.name || ''} ${formData.firstName || ''}`.trim();
    const englishName = `${formData.nameEn || ''} ${formData.firstNameEn || ''}`.trim();
    
    let personalInfoString = "";
    if (koreanName) personalInfoString += `이름: ${koreanName}\n`;
    if (englishName) personalInfoString += `영문 이름: ${englishName}\n`;
    if (formData.email) personalInfoString += `이메일: ${formData.email}\n`;
    if (formData.phone) personalInfoString += `전화번호: ${formData.phone}\n`;
    if (formData.birthYear || formData.birthMonth || formData.birthDay) {
      personalInfoString += `생년월일: ${formData.birthYear || '----'}년 ${formData.birthMonth || '--'}월 ${formData.birthDay || '--'}일\n`;
    }
    if (formData.address) personalInfoString += `주소: ${formData.address}\n`;
    // 사진 정보(formData.photo)는 base64 문자열일 수 있어, AI에게 텍스트로 전달하기는 부적합하므로 여기서는 제외합니다.
    // 만약 사진 유무 정보만 전달하고 싶다면 "사진: 있음/없음" 형태로 추가할 수 있습니다.
  
    return personalInfoString.trim() || "입력된 인적 사항 정보 없음";
  };
  
  /**
   * 학력 정보를 AI에게 전달할 문자열로 포맷팅합니다.
   * formData.education는 각 행이 [졸업일, 학교명, 졸업상태, 성적] 순서의 배열을 가진 2차원 배열로 가정합니다.
   * @param {Array<Array<string>>} educationArray - 학력 정보 배열
   * @returns {string} 포맷팅된 학력 정보 문자열
   */
  const formatEducationForAI = (educationArray) => {
    if (!educationArray || !Array.isArray(educationArray) || educationArray.length === 0 || educationArray.every(row => !row || row.every(col => !col || String(col).trim() === ""))) {
      return "입력된 학력 정보 없음";
    }
    return educationArray
      .filter(row => Array.isArray(row) && row.some(col => col && String(col).trim() !== "")) // 내용이 있는 행만 필터링
      .map(edu => {
        const [graduationDate, schoolName, graduationStatus, grade] = edu; // 배열 순서 중요!
        let eduStr = `${schoolName || '학교명 정보 없음'}`;
        if (graduationDate) eduStr += ` (졸업일: ${graduationDate.replace(/-/g, ".") || '정보 없음'})`;
        if (graduationStatus) eduStr += `, 상태: ${graduationStatus || '정보 없음'}`;
        if (grade) eduStr += `, 성적: ${grade || '정보 없음'}`;
        return eduStr;
      }).join("\n");
  };
  
  /**
   * 경력 정보를 AI에게 전달할 문자열로 포맷팅합니다.
   * formData.career는 각 행이 [근무기간, 회사명, 최종직위, 담당업무] 순서의 배열을 가진 2차원 배열로 가정합니다.
   * @param {Array<Array<string>>} careerArray - 경력 정보 배열
   * @returns {string} 포맷팅된 경력 정보 문자열
   */
  const formatCareerForAI = (careerArray) => {
    if (!careerArray || !Array.isArray(careerArray) || careerArray.length === 0 || careerArray.every(row => !row || row.every(col => !col || String(col).trim() === ""))) {
      return "입력된 경력 정보 없음";
    }
    return careerArray
      .filter(row => Array.isArray(row) && row.some(col => col && String(col).trim() !== ""))
      .map(car => {
        const [employmentPeriod, companyName, finalPosition, responsibilities] = car; // 배열 순서 중요!
        return `${companyName || '회사명 정보 없음'} (${employmentPeriod || '근무기간 정보 없음'}, 직위: ${finalPosition || '직위 정보 없음'}) - 담당업무: ${responsibilities || '담당업무 정보 없음'}`;
      }).join("\n");
  };
  
  /**
   * 자격증 정보를 AI에게 전달할 문자열로 포맷팅합니다.
   * formData.certificate는 각 행이 [취득일, 자격명, 발행처] 순서의 배열을 가진 2차원 배열로 가정합니다.
   * @param {Array<Array<string>>} certificateArray - 자격증 정보 배열
   * @returns {string} 포맷팅된 자격증 정보 문자열
   */
  const formatCertificateForAI = (certificateArray) => {
    // Step4Page.jsx에서 certificateName 키는 text.certificateName.ko:"자격명" 이었고, eertificateName은 오타였음.
    // 테이블 헤더 순서: 취득일, 자격명, 발행처
    if (!certificateArray || !Array.isArray(certificateArray) || certificateArray.length === 0 || certificateArray.every(row => !row || row.every(col => !col || String(col).trim() === ""))) {
      return "입력된 자격증 정보 없음";
    }
    return certificateArray
      .filter(row => Array.isArray(row) && row.some(col => col && String(col).trim() !== ""))
      .map(cert => {
        const [dateAcquisition, certificateName, issuer] = cert; // 배열 순서 중요!
        return `${certificateName || '자격명 정보 없음'} (취득일: ${dateAcquisition ? dateAcquisition.replace(/-/g, ".") : '정보 없음'}, 발행처: ${issuer || '발행처 정보 없음'})`;
      }).join("\n");
  };
  
  /**
   * 외국어 능력을 AI에게 전달할 문자열로 포맷팅합니다.
   * formData.languageSkills는 각 행이 [언어명, 구사정도, 시험명, 점수] 순서의 배열을 가진 2차원 배열로 가정합니다.
   * @param {Array<Array<string>>} languageSkillsArray - 외국어 능력 정보 배열
   * @returns {string} 포맷팅된 외국어 능력 정보 문자열
   */
  const formatLanguageSkillsForAI = (languageSkillsArray) => {
    if (!languageSkillsArray || !Array.isArray(languageSkillsArray) || languageSkillsArray.length === 0 || languageSkillsArray.every(row => !row || row.every(col => !col || String(col).trim() === ""))) {
      return "입력된 외국어 정보 없음";
    }
    return languageSkillsArray
      .filter(row => Array.isArray(row) && row.some(col => col && String(col).trim() !== ""))
      .map(lang => {
        const [language, proficiency, testName, score] = lang; // 배열 순서 중요!
        let langStr = `${language || '언어명 정보 없음'} (구사정도: ${proficiency || '정보 없음'})`;
        if (testName || score) {
          langStr += `, 시험: ${testName || '시험명 정보 없음'} ${score || '점수 정보 없음'}점`;
        }
        return langStr;
      }).join("\n");
  };
  
  /**
   * 병역 사항을 AI에게 전달할 문자열로 포맷팅합니다.
   * formData.military는 객체였습니다. App.js 초기값 및 Step2Page 필드명 기준.
   * @param {object} militaryObj - 병역 사항 객체
   * @returns {string} 포맷팅된 병역 사항 문자열
   */
  const formatMilitaryForAI = (militaryObj) => {
    if (!militaryObj || typeof militaryObj !== 'object' || Object.values(militaryObj).every(value => !value || String(value).trim() === "")) {
      // Object.values(...).every(...) 로 모든 값이 비어있는지 확인
      return "입력된 병역 정보 없음";
    }
    const serviceStart = militaryObj.serviceStart ? militaryObj.serviceStart.replace(/-/g, ".") : "-";
    const serviceEnd = militaryObj.serviceEnd ? militaryObj.serviceEnd.replace(/-/g, ".") : "-";
    return `복무기간: ${serviceStart} ~ ${serviceEnd}\n군별: ${militaryObj.branch || '-'}\n계급: ${militaryObj.rank || '-'}\n병과(특기): ${militaryObj.specialty || '-'}\n병역여부: ${militaryObj.served || '-'}\n보훈대상: ${militaryObj.veteran || '-'}`;
  };
  
  /**
   * 기술(Skills) 정보를 AI에게 전달할 문자열로 포맷팅합니다.
   * formData.skills가 문자열 배열이라고 가정합니다. (예: ["Java", "Spring Boot", "React"])
   * @param {Array<string>} skillsArray - 기술 정보 배열
   * @returns {string} 포맷팅된 기술 정보 문자열
   */
  const formatSkillsForAI = (skillsArray) => {
    if (!skillsArray || !Array.isArray(skillsArray) || skillsArray.length === 0 || skillsArray.every(skill => !skill || String(skill).trim() === "")) {
      return "입력된 보유 기술 정보 없음";
    }
    return skillsArray.filter(skill => skill && String(skill).trim() !== "").join(", ");
  };
  
  /**
   * 주요 경험(Experience) 정보를 AI에게 전달할 문자열로 포맷팅합니다.
   * formData.experience가 객체 배열이라고 가정합니다. (예: [{activityName: "캡스톤 디자인", role: "팀장", period: "2023.03~2023.12", description: "AI 이력서 자동 생성 시스템 개발"}, ...])
   * 이 구조는 현재 Step 페이지들에서는 명확히 정의되지 않았으므로, 일반적인 형태로 가정합니다.
   * 실제 experience 데이터 구조에 맞게 수정이 필요합니다.
   * @param {Array<object>} experienceArray - 주요 경험 정보 배열
   * @returns {string} 포맷팅된 주요 경험 정보 문자열
   */
  const formatExperienceForAI = (experienceArray) => {
    if (!experienceArray || !Array.isArray(experienceArray) || experienceArray.length === 0) {
      return "입력된 주요 경험 정보 없음";
    }
    return experienceArray
      .map(exp => {
        // 아래는 experience 객체가 가질 수 있는 일반적인 필드 예시입니다. 실제 구조에 맞게 수정하세요.
        let expStr = "";
        if (exp.activityName) expStr += `활동명: ${exp.activityName}`;
        if (exp.role) expStr += ` (역할: ${exp.role})`;
        if (exp.period) expStr += `\n  기간: ${exp.period}`;
        if (exp.description) expStr += `\n  내용: ${exp.description}`;
        return expStr;
      }).filter(str => str.trim() !== "").join("\n\n"); // 각 경험은 두 줄 바꿈으로 구분
  };
  
  
  /**
   * 전체 formData를 AI API가 요구하는 sections: Map<String, String> 형태로 변환합니다.
   * @param {object} formData - Step1~Step4에서 수집된 전체 이력서 데이터
   * @returns {object} AI API 요청에 사용될 sections 객체 (Map<String, String>과 유사)
   */
  export const formatResumeDataForAI = (formData) => {
    if (!formData) {
      console.error("formatResumeDataForAI: formData가 제공되지 않았습니다.");
      return {};
    }
  
    const sections = {};
  
    // 각 Step 페이지에서 사용된 text.sectionTitles[language].KEY 값을 참고하여 항목명 일치시키거나,
    // AI가 이해하기 좋은 일반적인 항목명 사용
    sections["인적 사항"] = formatPersonalInfoForAI(formData);
    sections["학력 사항"] = formatEducationForAI(formData.education); // Step4Page의 text.sectionTitles 키와 맞춤
    sections["경력 사항"] = formatCareerForAI(formData.career);     // Step4Page의 text.sectionTitles 키와 맞춤
    sections["자격증"] = formatCertificateForAI(formData.certificate);
    sections["외국어 능력"] = formatLanguageSkillsForAI(formData.languageSkills); // "외국어" 또는 "외국어 능력"
    sections["병역 사항"] = formatMilitaryForAI(formData.military);
    
    // App.js의 formData에 skills와 experience 필드가 배열로 초기화되어 있었으므로, 포맷터 추가
    sections["보유 기술"] = formatSkillsForAI(formData.skills);
    sections["주요 경험"] = formatExperienceForAI(formData.experience);
  
  
    // TODO: 여기에 사용자가 직접 작성하는 자기소개서 주요 항목들
    // (예: 성장과정, 성격의 장단점, 지원동기, 입사 후 포부 등)이 formData에 있다면,
    // 해당 필드들도 sections 객체에 추가해야 합니다.
    // 이 항목들은 보통 긴 텍스트이므로, 별도의 포맷팅 없이 바로 값을 할당할 수 있습니다.
    // 예시:
    if (formData.growthProcess) sections["성장과정"] = formData.growthProcess;
    if (formData.personalityAdvantages) sections["성격의 장단점"] = formData.personalityAdvantages;
    if (formData.motivation) sections["지원동기"] = formData.motivation;
    if (formData.aspirations) sections["입사 후 포부"] = formData.aspirations;
    // ... 기타 자기소개 항목들 ...
  
    // 최종적으로 빈 값만 있는 섹션은 제외할 수도 있습니다 (선택적)
    // for (const key in sections) {
    //   if (sections[key] === "입력된 정보 없음" || sections[key] === "입력된 학력 정보 없음" /* 등등 */) {
    //     delete sections[key];
    //   }
    // }
  
    return sections;
  };