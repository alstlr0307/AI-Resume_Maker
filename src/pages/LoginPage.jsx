// src/pages/LoginPage.jsx
import styled from 'styled-components';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../contexts/AuthService';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 추가
import { createGlobalStyle } from 'styled-components';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, #79A7D3, #C3DAF5);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const LoginSection = styled.div`
  flex: 1;
  padding-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
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

  &:hover {
    background-color: #4A8CD4;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #D6E9FF;
  color: #5D9CEC;

  &:hover {
    background-color: #BFDDF7;
  }
`;

const PasswordWrapper = styled.div`
  width: 90%;
  margin: 10px auto;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
`;

const PasswordInput = styled.input`
  flex: 1;
  border: none;
  font-size: 16px;
  padding: 10px;
  outline: none;
  background: transparent;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 10px;
`;


const GlobalStyle = createGlobalStyle`
  /* Edge & IE (ms) */
  input::-ms-reveal {
    display: none;
  }

  /* WebKit (Chrome, Safari) */
  input::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
  }

  input[type="password"]::-webkit-textfield-decoration-container {
    display: none;
  }

  /* Firefox (기본 아이콘 없음) */
`;

function LoginPage({ language, onChangeLanguage }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 추가

  const auth = useAuth();

  const text = {
    ko: {
      title: '로그인',
      email: '이메일',
      password: '비밀번호',
      login: '로그인',
      signup: '회원 가입',
      error: '이메일 또는 비밀번호가 잘못되었습니다.',
    },
    en: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      signup: 'Sign Up',
      error: 'Invalid email or password.',
    },
  };

  const t = text[language || 'ko'];

  const handleLogin = async () => {
      try {
        const { token } = await login(email, password); // 서버 요청
        console.log("Token received:", token); // 토큰 값 확인

        if (token) {
          // 로그인 성공 시 JWT 토큰을 localStorage에 저장
          console.log("Saving token to localStorage...");
          localStorage.setItem("token", token); // 토큰 저장
          console.log("Token saved:", localStorage.getItem("token")); // 저장된 토큰 확인

          const response = await api.get("/api/data");
          const { username, isAdmin } = response.data;

          auth.setUser({
            loggedIn: true,
            isAdmin,
            username
          });

          if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error(error);
        alert(t.error);
      }
  };

  return (
    <Wrapper>
      <GlobalStyle /> {/* ✅ 여기 추가 */}
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <LoginSection>
        <LoginBox>
          <h2>{t.title}</h2>
          <Input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div style={{ position: 'relative', width: '90%', margin: '10px 0', marginLeft: '4px' }}>
  <Input
    type={showPassword ? 'text' : 'password'}
    placeholder={t.password}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ paddingRight: '40px', margin: 0 }} // ✅ 스타일 조정
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: 'absolute',
      right: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0
    }}
  >
    {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
  </button>
</div>


          <PrimaryButton onClick={handleLogin}>{t.login}</PrimaryButton>
          <SecondaryButton onClick={() => navigate('/signup')}>
            {t.signup}
          </SecondaryButton>
        </LoginBox>
      </LoginSection>
    </Wrapper>
  );
}

export default LoginPage;
