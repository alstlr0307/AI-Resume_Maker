import React, { useState, useRef } from "react";
import styled from "styled-components";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import en from "date-fns/locale/en-US";
import ko from "date-fns/locale/ko";
import { registerLocale } from "react-datepicker"; // 추가되어야 함


const Step2Page = ({ language, onChangeLanguage, formData, handleFormDataChange }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
registerLocale("en-US", en);
registerLocale("ko", ko);
  
  const currentStep = 1;
  const locale = language === "en" ? "en-US" : "ko";

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFormDataChange({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const text = {
    steps: {
      ko: ["이력서\n양식", "신상\n정보", "경력", "수정", "완성"],
      en: ["Template", "Personal\nInfo", "Experience", "Edit", "Complete"],
    },
    title: { ko: "인적 사항 입력", en: "Enter Personal Information" },
    inputTitle: { ko: "인적 사항", en: "Personal Information" },
    photo: { ko: "+ 사진 추가", en: "+ Add Photo" },
    name: { ko: "이름", en: "First Name" },
    nameEn: { ko: "영문 이름", en: "First Name (EN)" },
    surname: { ko: "성", en: "Last Name" },
    surnameEn: { ko: "영문 성", en: "Last Name (EN)" },
    email: { ko: "이메일 주소", en: "Email Address" },
    phone: { ko: "전화번호", en: "Phone Number" },
    birth: { ko: "생년월일", en: "Date of Birth" },
    birthYear: {ko:"년", en:"Year"},
    birthMonth: {ko:"월", en:"Month"},
    birthDay: {ko:"일", en:"Day"},

    address: { ko: "주소", en: "Address" },

    military: { ko: "병역 사항", en: "Military Service" },
    
    startDatePlaceholder: {
      ko: "시작일 선택",
      en: "Start Date",
    },
    endDatePlaceholder: {
      ko: "종료일 선택",
      en: "End Date",
    },
    militaryBranch: { 
      ko: [ "육군", "공군", "해군", "해병대"], 
      en: [ "Army", "Air Force", "Navy", "Marine Corps"] 
    },
    militaryRank: { ko: "계급", en: "Rank" },
    militarySpecialty: { ko: "병과", en: "Specialty" },
    militaryStatusOptions: {
      ko: ["병역여부", "미필", "현역필", "방위필", "공익", "면제", "직업군인", "단기사병"],
      en: ["Military Status", "Not Served", "Active Duty", "Reserve", "Public Service", "Exempted", "Professional Soldier", "Short-Term Enlistee"]
    },
    veteranOptions: {
      ko: ["보훈대상", "대상", "비대상"],
      en: ["Veteran Status", "Eligible", "Not Eligible"]
    },
    noMilitary: {
      ko: "병역 사항이 없습니다.",
      en: "No military service."
    },
    notApplicable: {
      ko: "해당없음",
      en: "N/A"
    },
    requireText:{
      ko: "* 은 필수사항",
      en: "* is required"
    },
    prev: { ko: "이전", en: "Previous" },
    next: { ko: "다음", en: "Next" },
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  };

  const getMonthOptions = () => Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  const getDayOptions = () => Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  const [birthYear, setBirthYear] = useState(formData.birthYear || '년');
  const [birthMonth, setBirthMonth] = useState(formData.birthMonth || '월');
  const [birthDay, setBirthDay] = useState(formData.birthDay || '일');

  const handleNext = () => {
    if(!formData.name|| !formData.nameEn||!formData.firstName||!formData.firstNameEn
      ||!formData.email||!formData.phone ){
      alert("필수 인적사항을 입력해주세요.");
    } else if(!formData.birthYear ){
      alert("생년월일 중 생년을 입력해주세요.");
    } else if( !formData.birthMonth ){
      alert("생년월일 중 월을 입력해주세요.");
    } else if( !formData.birthDay ){
      alert("생년월일 중 일을 입력해주세요.");
    }
    else
    navigate("/step3Page", { state: { formData, language } })};

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

        <ResumeInput>
          <SectionTitleWrapper>
            <SectionTitle>{text.inputTitle[language]}</SectionTitle>
            <RequiredNote>{text.requireText[language]}</RequiredNote>
          </SectionTitleWrapper>

          <InfoSection>
            <PhotoBox onClick={handlePhotoClick}>
              {formData.photo ? (
                <PhotoPreview src={formData.photo} alt="Profile" />
              ) : (
                <label>{text.photo[language]}</label>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                hidden
              />
            </PhotoBox>

            <InputsColumn>
              <InputRow>
                *<Input
                  type="text"
                  placeholder={text.name[language]}
                  value={formData.name || ""}
                  onChange={(e) => {
                  const koreanOnly = e.target.value.replace(/[^ㄱ-ㅎ가-힣\s]/g, ""); 
                  handleFormDataChange({ ...formData, name: koreanOnly });
                }}
                />
                *<Input
                  type="text"
                  placeholder={text.nameEn[language]}
                  value={formData.firstNameEn || ""}
                  onChange={(e) => {
                    const englishOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ""); 
                    handleFormDataChange({ ...formData, firstNameEn: englishOnly });
                  }}
                />
              </InputRow>
              <InputRow marginTop="10px">
                *<Input
                  type="text"
                  placeholder={text.surname[language]}
                  value={formData.firstName || ""}
                  onChange={(e) => {
                  const koreanOnly = e.target.value.replace(/[^ㄱ-ㅎ가-힣\s]/g, ""); 
                  handleFormDataChange({ ...formData, firstName: koreanOnly });
                }}
                />
                *<Input
                  type="text"
                  placeholder={text.surnameEn[language]}
                  value={formData.nameEn || ""}
                  onChange={(e) => {
                    const englishOnly = e.target.value.replace(/[^a-zA-Z\s]/g, ""); 
                    handleFormDataChange({ ...formData, nameEn: englishOnly });
                  }}
                />
              </InputRow>
              <InputRow marginTop="10px">
                *<Input
                  type="email"
                  placeholder={text.email[language]}
                  value={formData.email || ""}
                  onChange={(e) => handleFormDataChange({ ...formData, email: e.target.value })}
                />
                *<Input
                  type="tel"
                  placeholder={text.phone[language]}
                  value={formData.phone || ""}
                  onChange={(e) => {
                    const numbersOnly = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 허용
                    handleFormDataChange({ ...formData, phone: numbersOnly });
                  }}
                />
              </InputRow>
            </InputsColumn>
          </InfoSection>

          <BirthAddressSection>
            <div>
              <BirthTitle>* {text.birth[language]}</BirthTitle>
              <Select value={birthYear} onChange={(e) => {
                setBirthYear(e.target.value);
                handleFormDataChange({ ...formData, birthYear: e.target.value });
              }}>
                <option value="">{text.birthYear[language]}</option>
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
              <Select
                value={birthMonth}
                onChange={(e) => {
                  setBirthMonth(e.target.value);
                  handleFormDataChange({ ...formData, birthMonth: e.target.value });
                }}
              >
                <option value="">{text.birthMonth[language]}</option>
                {getMonthOptions().map((month, i) => (
                  <option key={month} value={i + 1}>
                    {month}
                  </option>
                ))}
              </Select>
              <Select
                value={birthDay}
                onChange={(e) => {
                  setBirthDay(e.target.value);
                  handleFormDataChange({ ...formData, birthDay: e.target.value });
                }}
              >
                <option value="">{text.birthDay[language]}</option>
                {getDayOptions().map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Select>
            </div>

            <AddressSection>
              <AddressTitle>{text.address[language]}</AddressTitle>
              <AddressInput
                type="text"
                placeholder={text.address[language]}
                value={formData.address || ""}
                onChange={(e) => handleFormDataChange({ ...formData, address: e.target.value })}
              />
            </AddressSection>
          </BirthAddressSection>

          <MilitarySection>
            <MilitaryTitle>{text.military[language]}  
             <MilitaryBtn
                type="button"
                onClick={() => {
                  alert(`${text.noMilitary[language]}`);
                  handleFormDataChange({
                    ...formData,
                    military: {
                      serviceStart: null,
                      serviceEnd: null,
                      rank: null,
                      specialty: null,
                      branch: null,
                      served: null,
                      veteran: null,
                    },
                  });
                }}
              >
                {text.notApplicable[language]}
              </MilitaryBtn>
            </MilitaryTitle>

            <InputRow><div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
               <Input
                type="date"
                value={formData.military?.serviceStart || ""}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    military: {
                      ...formData.military,
                      serviceStart: e.target.value,
                    },
                  })
                }
                date-placeholder={text.startDatePlaceholder[language]}
              />
              ~
              <Input
                type="date"
                value={formData.military?.serviceEnd || ""}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    military: {
                      ...formData.military,
                      serviceEnd: e.target.value,
                    },
                  })
                }
                placeholder={text.endDatePlaceholder[language]}
              />
            </div>
              <Input
                type="text"
                placeholder={text.militaryRank[language]}
                value={formData.military?.rank || ""}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    military: { ...formData.military, rank: e.target.value },
                  })
                }
              />
              <Input
                type="text"
                placeholder={text.militarySpecialty[language]}
                value={formData.military?.specialty || ""}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    military: { ...formData.military, specialty: e.target.value },
                  })
                }
              />
            </InputRow>

            <InputRow marginTop="10px">
              <Select
                value={formData.military?.branch || ""}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    military: { ...formData.military, branch: e.target.value },
                  })
                }
              >
              <option value="">{language === 'ko' ? "군별" : "Branch"}</option>

              {text.militaryBranch[language].map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
              </Select>
              <Select
                value={formData.military?.served || ""}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    military: { ...formData.military, served: e.target.value },
                  })
                }
              >
              {text.militaryStatusOptions[language].map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
              </Select>

              <Select
                value={formData.military?.veteran || ""}
                onChange={(e) =>
                  handleFormDataChange({
                    ...formData,
                    military: { ...formData.military, veteran: e.target.value },
                  })
                }
              >
              {text.veteranOptions[language].map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
              </Select>
            </InputRow>
          </MilitarySection>
        </ResumeInput>

        <StepButton>
          <PreButton onClick={() => navigate('/step1Page')}>
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
};

export default Step2Page;

// 스타일 컴포넌트는 그대로 유지됩니다.


// 스타일 컴포넌트는 그대로 유지됩니다.


const PageWrapper = styled.div`background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff); min-height: 100vh; min-width:800px; display: flex; flex-direction: column;`;
const Container = styled.div`flex: 1; padding: 2rem; display: flex; flex-direction: column; align-items: center; font-family: sans-serif; text-align: center;`;
const Title = styled.h1`font-size: clamp(1.8rem, 3vw, 2.5rem); color: white; margin-top: 100px; margin-bottom: 30px;`;
const ResumeInput = styled.div`width:800px; background-color: white; padding: 20px 30px; border-radius: 20px; box-shadow: 3px 3px 10px -3px gray;`;
const InputTitle = styled.h1`margin-top: 0; font-size: 1.2rem;`;
const InfoSection = styled.div`display: flex; gap: 20px; margin-top: 30px; width: 100%; max-width: 800px;`;
const PhotoBox = styled.div`width: 120px; height: 150px; border: 1px solid #aaa; display: flex; justify-content: center; align-items: center; flex-shrink: 0; cursor: pointer;`;
const PhotoPreview = styled.img`width: 120px; height: 150px; object-fit: cover;`;
const InputsColumn = styled.div`flex: 1; margin-top: 20px;`;
const InputRow = styled.div`display: flex; gap: 10px; margin-top: ${props => props.marginTop || "0"};`;
const Input = styled.input`flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; box-sizing: border-box;`;
const Select = styled.select`flex: 1; padding: 10px 20px; border: 1px solid #ccc; border-radius: 8px; font-size: 14px; box-sizing: border-box; margin-right: 10px;`;
const BirthTitle = styled.h4`margin-bottom: 10px; margin-left: 5px; text-align: left;`;
const BirthAddressSection = styled.div`display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; width: 100%; max-width: 1000px;`;
const AddressSection = styled.div`margin-left: 20px; flex: 1; max-width: 600px;`;
const AddressTitle = styled.h4`margin-bottom: 10px; margin-left: 5px; text-align: left;`;
const AddressInput = styled(Input)`flex: 1; width: 100%; min-width: 0;`;
const MilitarySection = styled.div`width: 100%; overflow-x: auto; max-width: 100%; margin-top: 30px; text-align: left;`;
const MilitaryTitle = styled.h4`margin-bottom: 10px; margin-left: 5px;`;
const LinkText = styled.div`color: white; background-color: #146c94; border: 1px solid #146c94; border-radius: 20px; font-size: 1rem; cursor: pointer; text-decoration: none; padding: 8px 20px; &:hover { color: #146c94; background-color: white; }`;
const PreButton = styled(LinkText)`margin-left: 30px;`;
const NextButton = styled(LinkText)`text-align: left; margin-right: 30px;`;
const StepButton = styled.div`width: 100%; max-width: 900px; margin: 50px auto 0; display: flex; justify-content: space-between; align-items: center;`;
const MilitaryBtn = styled.button` padding:5px; margin-left:10px; color: white; background-color:rgb(104, 104, 105); border-radius: 10px; font-size: 0.8rem; cursor: pointer; text-decoration: none; &:hover { color:rgb(104, 104, 105); background-color: white; }`;
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
const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  border-bottom: 1px solid black;
  padding-bottom: 0.3rem;
`;

const SectionTitle = styled.h4`
  text-align: left;
  font-size: 1.2rem;
  margin: 0;
`;

const RequiredNote = styled.h6`
  font-size: 0.9rem;
  margin: 0;
  color:#146c94;
`;
