// SignupPage.jsx
import styled from 'styled-components';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useState, useEffect, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #79A7D3, #C3DAF5);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const JoinSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  padding: 40px 0;
`;

const JoinBox = styled.div`
  margin-top: 80px;
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  width: 360px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
`;

const PrimaryButton = styled(Button)`
  background-color: #5D9CEC;
  color: white;
  &:hover { background-color: #4A8CD4; }
`;

const SecondaryButton = styled(Button)`
  background-color: #D6E9FF;
  color: #5D9CEC;
  &:hover { background-color: #BFDDF7; }
`;

const SelectBoxWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectBox = styled.select`
  width: 100%;
  height: 40px;
  padding: 10px;
  padding-right: 30px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%234A8CD4'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  cursor: pointer;

  &:disabled {
    background-color: #f5f5f5;
    color: #aaa;
    background-image: none;
  }
`;

const EmailCheckButton = styled.button`
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 15px;
  background-color: #5D9CEC;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4A8CD4; // 원하는 hover 색상
  }

  &:disabled {
    background-color: #A9CCE3;
    cursor: not-allowed;
  }
`;

function SignupPage({ language = 'ko', onChangeLanguage }) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [birthYear, setBirthYear] = useState('');
const [birthMonth, setBirthMonth] = useState('');
const [birthDay, setBirthDay] = useState('');
const [birth, setBirth] = useState(''); // ✅ 반드시 포함
  const [address, setAddress] = useState('');

  const [validationMessages, setValidationMessages] = useState({
    firstName: '', lastName: '', password: '', confirm: '', birth: '', address: ''
  });

  const [emailMessage, setEmailMessage] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const dropdownRef = useRef(null);
  const domainOptions = ['gmail.com', 'naver.com', 'daum.net', 'custom'];

  const text = {
    ko: {
      title: '회원가입', firstName: '이름', lastName: '성',
      emailIdPlaceholder: '이메일 아이디', domainPlaceholder: '도메인 선택',
      directInput: '직접입력', password: '비밀번호', confirm: '비밀번호 재확인',
      birth: '생년월일 (예: 1990.01.01)', address: '주소',
      signup: '회원가입', toLogin: '로그인 페이지로', mismatch: '비밀번호가 일치하지 않습니다.',
    }
  };

  const t = text[language];

  const handleKoreanInput = (setter) => (e) =>
    setter(e.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, ''));

  const renderDomainLabel = (value) => value === 'custom' ? t.directInput : value;

  const handleEmailCheck = async () => {
    const fullEmail = emailId.trim() + '@' + (emailDomain === 'custom' ? customDomain.trim() : emailDomain);

    if (!emailId.trim()) {
      setEmailMessage('이메일 아이디를 입력해주세요.');
      setIsEmailAvailable(false);
      return;
    }

    if (!emailDomain || (emailDomain === 'custom' && !customDomain.trim())) {
      setEmailMessage('도메인을 선택하거나 입력해주세요.');
      setIsEmailAvailable(false);
      return;
    }

    setEmailMessage('');
    setIsCheckingEmail(true);

    try { // 백엔드랑 연동할때 사용할 코드
  const res = await api.post('/api/user/check-email', { email: fullEmail });
  if (res.data.available) {
    setEmailMessage('사용이 가능한 아이디입니다.');
    setIsEmailAvailable(true);
  } else {
    setEmailMessage('이미 사용 중인 이메일입니다.');
    setIsEmailAvailable(false);
  }
} catch (err) {
  setEmailMessage('이메일 확인 중 오류가 발생했습니다.');
  setIsEmailAvailable(false);
}
    
  };


  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      setBirth(`${birthYear}.${birthMonth.padStart(2, '0')}.${birthDay.padStart(2, '0')}`);
    }
  }, [birthYear, birthMonth, birthDay]);
  

  const handleSignup = async () => {
    const messages = {};

    if (!firstName.trim()) messages.firstName = '이름을 입력해주세요.';
    if (!lastName.trim()) messages.lastName = '성을 입력해주세요.';
    if (!password) {
      messages.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 8 || password.length > 20) {
      messages.password = '비밀번호는 8자 이상 입력해주세요.';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      messages.password = '특수문자를 포함해주세요.';
    }
    if (!confirm) {
      messages.confirm = '비밀번호를 재확인해주세요.';
    } else if (password !== confirm) {
      messages.confirm = '비밀번호가 일치하지 않습니다.';
    }
    if (!birth.trim()) messages.birth = '생년월일을 입력해주세요.';
    if (!address.trim()) messages.address = '주소를 입력해주세요.';

    if (!emailId.trim()) {
      setEmailMessage('이메일 아이디를 입력해주세요.');
    } else if (!emailDomain || (emailDomain === 'custom' && !customDomain.trim())) {
      setEmailMessage('도메인을 선택하거나 입력해주세요.');
    } else {
      setEmailMessage('');
    }

    setValidationMessages(messages);
    if (Object.keys(messages).length > 0 || emailMessage) return;

    if (password !== confirm) {
      alert(t.mismatch);
      return;
    }

    const fullEmail = emailId.trim() + '@' + (emailDomain === 'custom' ? customDomain.trim() : emailDomain);

    const payload = { firstName, lastName, email: fullEmail, password, birth, address };

    try {
      console.log('Sending request to backend...');
      const response = await api.post('/api/user/register', payload);
      console.log('Response from server:', response);
      alert(response.data); // 성공 메시지
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('회원가입 실패:', error);
      console.error('Error details:', error.response?.data);
      alert('회원가입 실패: ' + (error.response?.data || '서버 오류'));
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Wrapper>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <JoinSection>
        <JoinBox>
          <h2>{t.title}</h2>

          {/* 이름 */}
          <div style={{ minHeight: '22px', textAlign: 'left' }}>
            {validationMessages.firstName && <span style={{ fontSize: '13px', color: 'red' }}>{validationMessages.firstName}</span>}
          </div>
          <Input type="text" placeholder={t.firstName} value={firstName} onChange={handleKoreanInput(setFirstName)} />

          {/* 성 */}
          <div style={{ minHeight: '22px', textAlign: 'left' }}>
            {validationMessages.lastName && <span style={{ fontSize: '13px', color: 'red' }}>{validationMessages.lastName}</span>}
          </div>
          <Input type="text" placeholder={t.lastName} value={lastName} onChange={handleKoreanInput(setLastName)} />

          {/* 이메일 유효성 메시지 */}
          <div style={{ minHeight: '22px', textAlign: 'left' }}>
            {emailMessage && (
              <span style={{ fontSize: '13px', color: isEmailAvailable ? 'green' : 'red' }}>
                {emailMessage}
              </span>
            )}
          </div>

          {/* 이메일 입력 영역 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0' }}>
            <Input type="text" placeholder={t.emailIdPlaceholder} value={emailId}
              onChange={(e) => setEmailId(e.target.value)} style={{ width: '47%' }} />
            <span style={{ fontWeight: 'bold', fontSize: '22px', color: '#333' }}>@</span>
            {emailDomain === 'custom' ? (
              <Input type="text" placeholder={t.domainPlaceholder} value={customDomain}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomDomain(val);
                  if (val.trim() === '') setEmailDomain('');
                }}
                onBlur={() => {
                  if (customDomain.trim() === '') setEmailDomain('');
                }}
                style={{ width: '45%' }}
              />
            ) : (
              <div style={{ position: 'relative', width: '45%' }} ref={dropdownRef}>
                <Input type="text" value={emailDomain || ''} placeholder={t.domainPlaceholder}
                  readOnly onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }} />
                <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    position: 'absolute', right: 6, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', fontSize: '20px', cursor: 'pointer', color: '#5D9CEC'
                  }}>▼</button>
                {dropdownOpen && (
                  <ul style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    border: '1px solid #ccc', borderRadius: '5px',
                    background: 'white', listStyle: 'none', margin: 0, padding: 0, zIndex: 999
                  }}>
                    {domainOptions.map((domain) => (
                      <li key={domain}
                        onClick={() => {
                          setEmailDomain(domain);
                          setCustomDomain('');
                          setDropdownOpen(false);
                        }}
                        style={{
                          padding: '8px', cursor: 'pointer',
                          backgroundColor: 'white', userSelect: 'none'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f0ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {renderDomainLabel(domain)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* 이메일 중복 확인 버튼 */}
          <EmailCheckButton
            type="button"
            onClick={handleEmailCheck}
            disabled={isCheckingEmail}
          >
            {isCheckingEmail ? '확인 중...' : '이메일 중복 확인'}
          </EmailCheckButton>


          {/* 비밀번호 */}
          <div style={{ minHeight: '22px', textAlign: 'left' }}>
            {validationMessages.password && <span style={{ fontSize: '13px', color: 'red' }}>{validationMessages.password}</span>}
          </div>
          <div style={{ position: 'relative' }}>
            <Input type={showPassword ? 'text' : 'password'} placeholder={t.password} value={password}
              onChange={(e) => setPassword(e.target.value)} maxLength={20} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {!showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {/* 비밀번호 재확인 */}
          <div style={{ minHeight: '22px', textAlign: 'left' }}>
            {validationMessages.confirm && <span style={{ fontSize: '13px', color: 'red' }}>{validationMessages.confirm}</span>}
          </div>
          <div style={{ position: 'relative' }}>
            <Input type={showConfirmPassword ? 'text' : 'password'} placeholder={t.confirm} value={confirm}
              onChange={(e) => setConfirm(e.target.value)} maxLength={20} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
              {!showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          {/* 생년월일 유효성 메시지 */}
<div style={{ minHeight: '22px', textAlign: 'left' }}>
  {validationMessages.birth && (
    <span style={{ fontSize: '13px', color: 'red' }}>{validationMessages.birth}</span>
  )}
</div>

{/* 생년월일 드롭다운 */}
<div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
  {/* 년 */}
  <SelectBoxWrapper style={{ flex: 1 }}>
  <SelectBox value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
  <option value="">년</option>
  {Array.from({ length: 51 }, (_, i) => new Date().getFullYear() - i)
  .reverse()
  .map((year) => (
    <option key={year} value={year}>{year}</option>
))}
  </SelectBox>
</SelectBoxWrapper>

  {/* 월 */}
  <SelectBoxWrapper style={{ flex: 1 }}>
    <SelectBox value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)}>
      <option value="">월</option>
      {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map((month) => (
        <option key={month} value={month}>{month}</option>
      ))}
    </SelectBox>
  </SelectBoxWrapper>

  {/* 일 */}
  <SelectBoxWrapper style={{ flex: 1 }}>
  <SelectBox
    value={birthDay}
    onChange={(e) => setBirthDay(e.target.value)}
    disabled={!birthMonth} // ✅ 월이 선택되지 않으면 비활성화
  >
    <option value="">일</option>

    {birthMonth && (
      Array.from({ length: getDaysInMonth(birthYear || 2024, parseInt(birthMonth)) }, (_, i) => (
        <option key={i + 1} value={i + 1}>{i + 1}</option>
      ))
    )}
  </SelectBox>
</SelectBoxWrapper>


</div>

          {/* 주소 */}
          <div style={{ minHeight: '22px', textAlign: 'left' }}>
            {validationMessages.address && <span style={{ fontSize: '13px', color: 'red' }}>{validationMessages.address}</span>}
          </div>
          <Input type="text" placeholder={t.address} value={address} onChange={(e) => setAddress(e.target.value)} />

          <PrimaryButton onClick={handleSignup}>{t.signup}</PrimaryButton>
          <SecondaryButton onClick={() => navigate('/login')}>{t.toLogin}</SecondaryButton>
        </JoinBox>
      </JoinSection>
    </Wrapper>
  );
}

export default SignupPage;
