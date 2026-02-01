// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import profileImg from '../assets/profile1.jpg';

// 스타일 정의
const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 100px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: white;
  margin-bottom: 30px;
  font-weight: bold;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
`;

const InfoCard = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid black;
`;

const Label = styled.div`
  font-weight: bold;
  color: #333;
  width: 120px;
  white-space: nowrap;
`;

const Value = styled.div`
  color: #333;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-bottom: 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-right: 10px;
`;

const DeleteButton = styled(Button)`
  background-color: #3399ff;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  max-width: 800px;
  margin: 20px auto 0 auto;
`;

const Input = styled.input`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  font-size: 1rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
`;

const formatPhoneInput = (value) => {
  const onlyNums = value.replace(/[^0-9]/g, '');
  if (onlyNums.length <= 3) return onlyNums;
  if (onlyNums.length <= 7) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
};

// 메인 컴포넌트
const ProfilePage = ({ language = 'ko', onChangeLanguage }) => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [profileImagePreview, setProfileImagePreview] = useState(profileImg);

  useEffect(() => {
    const mockData = {
      name: '고냥이',
      birthday: '2025-04-01',
      gender: '여',
      email: 'daelim@email.com',
      phone: '010-1234-1234',
      home: '대림대 전산관 5층 디지털미디어실습실',
      company: '안양시청',
      military: '면제',
      education: {
        schoolName: '대림대학교',
        schoolType: '학사',
        graduationStatus: '졸업',
        major: '컴퓨터 정보학부',
      },
      experience: '프론트엔드 인턴 (2024.01 ~ 2024.06)',
      certificate: '정보처리기사',
      languageSkills: '영어 (중), 일본어 (초)',
      profileImage: profileImg,
    };
    setProfileData(mockData);
    setFormData(mockData);
    setProfileImagePreview(mockData.profileImage);
    setLoading(false);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // education 안의 각 필드 변경 함수
  const handleEducationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value,
      },
    }));
  };

  const handleEditToggle = () => {
    if (editMode) {
      setProfileData({ ...formData, profileImage: profileImagePreview });
    }
    setEditMode(!editMode);
  };

  const handleDeleteAccount = () => {
    if (passwordInput.trim()) {
      alert('회원 탈퇴 완료되었습니다.');
      setShowDeleteModal(false);
    } else {
      alert('비밀번호를 입력해주세요.');
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImagePreview(imageUrl);
      handleChange('profileImage', imageUrl);
    }
  };

  const renderField = (label, field) => {
    const isEmail = field === 'email';
    const isPhone = field === 'phone';

    const placeholderMap = {
      email: 'example@domain.com',
      phone: '010-1234-5678',
    };

    return (
      <InfoRow key={field}>
        <Label>{label}</Label>
        {editMode ? (
          field === 'birthday' ? (
            <Input
              type="date"
              value={formData[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          ) : field === 'gender' ? (
            <Select value={formData[field]} onChange={(e) => handleChange(field, e.target.value)}>
              <option value="남">남</option>
              <option value="여">여</option>
            </Select>
          ) : field === 'military' ? (
            <Select value={formData[field]} onChange={(e) => handleChange(field, e.target.value)}>
              <option value="미필">미필</option>
              <option value="현역필">현역필</option>
              <option value="방위필">방위필</option>
              <option value="공익">공익</option>
              <option value="면제">면제</option>
              <option value="직업군인">직업군인</option>
              <option value="단기사병">단기사병</option>
            </Select>
          ) : isPhone ? (
            <Input
              type="tel"
              value={formData[field]}
              onChange={(e) => handleChange(field, formatPhoneInput(e.target.value))}
              placeholder={placeholderMap.phone}
            />
          ) : isEmail ? (
            <Input
              type="email"
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholderMap.email}
            />
          ) : (
            <Input
              type="text"
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          )
        ) : (
          <Value>{profileData[field]}</Value>
        )}
      </InfoRow>
    );
  };

  if (loading || !profileData) return null;

  return (
    <PageWrapper>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <Content>
        <Title>프로필 페이지</Title>

        <InfoCard>
          <SectionTitle>기본 정보</SectionTitle>
          <InfoRow>
            <label htmlFor="profile-upload">
              <ProfileImage
                src={editMode ? profileImagePreview : profileData.profileImage}
                alt="프로필"
                style={{ cursor: editMode ? 'pointer' : 'default' }}
              />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfileImageChange}
            />
            {editMode ? (
              <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
            ) : (
              <Value>{profileData.name}</Value>
            )}
          </InfoRow>
          {renderField('생년월일', 'birthday')}
          {renderField('성별', 'gender')}
        </InfoCard>

        <InfoCard>
          <SectionTitle>연락처</SectionTitle>
          {renderField('이메일', 'email')}
          {renderField('전화번호', 'phone')}
        </InfoCard>

        <InfoCard>
          <SectionTitle>주소 및 회사</SectionTitle>
          {renderField('주소', 'home')}
          {renderField('회사', 'company')}
        </InfoCard>

        <InfoCard>
          <SectionTitle>군 복무</SectionTitle>
          {renderField('군 복무 여부', 'military')}
        </InfoCard>

        <InfoCard>
          <SectionTitle>학력</SectionTitle>
          {editMode ? (
            <>
              <InfoRow>
                <Label>학교 이름</Label>
                <Input
                  type="text"
                  value={formData.education.schoolName || ''}
                  onChange={(e) => handleEducationChange('schoolName', e.target.value)}
                  placeholder="학교명을 입력하세요"
                />
              </InfoRow>

              <InfoRow>
                <Label>학교 종류</Label>
                <Select
                  value={formData.education.schoolType || ''}
                  onChange={(e) => handleEducationChange('schoolType', e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="초등학교">초등학교</option>
                  <option value="중학교">중학교</option>
                  <option value="고등학교">고등학교</option>
                  <option value="대학교(전문학사)">대학교(전문학사)</option>
                  <option value="대학교(학사)">대학교(학사)</option>
                  <option value="대학교(석사)">대학교(석사)</option>
                  <option value="대학교(박사)">대학교(박사)</option>
                </Select>
              </InfoRow>

              <InfoRow>
                <Label>졸업 유무</Label>
                <Select
                  value={formData.education.graduationStatus || ''}
                  onChange={(e) => handleEducationChange('graduationStatus', e.target.value)}
                >
                  <option value="">선택하세요</option>
                  <option value="졸업">졸업</option>
                  <option value="휴학">휴학</option>
                  <option value="졸업예정">졸업예정</option>
                  <option value="재학">재학</option>
                </Select>
              </InfoRow>

              <InfoRow>
                <Label>전공</Label>
                <Input
                  type="text"
                  value={formData.education.major || ''}
                  onChange={(e) => handleEducationChange('major', e.target.value)}
                  placeholder="전공을 입력하세요"
                />
              </InfoRow>
            </>
          ) : (
            <>
              <InfoRow>
                <Label>학교</Label>
                <Value>
                  {profileData.education.schoolName}{' '}
                  {profileData.education.schoolType && `(${profileData.education.schoolType})`}
                </Value>
              </InfoRow>
              <InfoRow>
                <Label>졸업 유무</Label>
                <Value>{profileData.education.graduationStatus}</Value>
              </InfoRow>
              <InfoRow>
                <Label>전공</Label>
                <Value>{profileData.education.major}</Value>
              </InfoRow>
            </>
          )}
        </InfoCard>

        <InfoCard>
          <SectionTitle>경력</SectionTitle>
          {renderField('경력', 'experience')}
        </InfoCard>

        <InfoCard>
          <SectionTitle>자격증</SectionTitle>
          {renderField('자격증', 'certificate')}
        </InfoCard>

        <InfoCard>
          <SectionTitle>언어 능력</SectionTitle>
          {renderField('언어 능력', 'languageSkills')}
        </InfoCard>

        <ButtonWrapper>
          <Button onClick={handleEditToggle}>{editMode ? '저장' : '수정'}</Button>
          {!editMode && (
            <DeleteButton onClick={() => setShowDeleteModal(true)}>회원 탈퇴</DeleteButton>
          )}
        </ButtonWrapper>

        {showDeleteModal && (
          <ModalOverlay onClick={() => setShowDeleteModal(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <h3>회원 탈퇴</h3>
              <p>비밀번호를 입력하세요:</p>
              <Input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <Button onClick={handleDeleteAccount} style={{ marginTop: '20px', width: '100%' }}>
                탈퇴하기
              </Button>
            </ModalBox>
          </ModalOverlay>
        )}
      </Content>
      <Footer />
    </PageWrapper>
  );
};

export default ProfilePage;
