import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import changeLangIcon from '../assets/changelanguage.png';
import logo from '../assets/AirLogo02.png';
import profileIcon from '../assets/profile.png';
import menuIcon from '../assets/menu.png';
import koreaFlag from '../assets/korea.png';
import usaFlag from '../assets/usa.png';
import MenuSidebar from './MenuSidebar';

const HeaderWrapper = styled.header`
  background-color: #5cbef7;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 200;
  width: 100%;
  left: 0;
  right: 0;
  box-sizing: border-box;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const LangDropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 80px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 10px 0;
  z-index: 300;
`;

const LangItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  gap: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }

  img {
    width: 24px;
    height: 24px;
  }

  span {
    font-size: 1rem;
  }
`;

const Logo = styled.div`
 cursor: pointer;
`;

function Header({ onChangeLanguage, language }) {
  const [isClosing, setIsClosing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const langRef = useRef(null);

  const handleNavigation = (url) => {
    setIsClosing(true);
    setTimeout(() => {
      window.location.href = url;
    }, 400); // 애니메이션 길이와 동일한 시간 설정
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedMenuBtn = menuButtonRef.current?.contains(e.target);
      const clickedMenuPanel = menuRef.current?.contains(e.target);

      if (menuOpen && !clickedMenuBtn && !clickedMenuPanel) {
        setMenuOpen(false);
      }

      if (langOpen && langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen, langOpen]);

  const handleLanguageChange = (lang) => {
    localStorage.setItem('language', lang);
    onChangeLanguage(lang);
    setLangOpen(false);
  };

  return (
    <>
      <HeaderWrapper>
          <Logo onClick={() => handleNavigation('/')}>
          <img
            src={logo}
            style={{
              margin:0,
              padding:0,
              width: '80px',
              height: '30px',
            }}
          />
          </Logo>
        <IconGroup>
          <div ref={langRef}>
            <Icon
              src={changeLangIcon}
              alt="언어 변경"
              onClick={() => setLangOpen(!langOpen)}
            />
            {langOpen && (
              <LangDropdown>
                <LangItem onClick={() => handleLanguageChange('ko')}>
                  <img src={koreaFlag} alt="한국어" />
                  <span>한국어</span>
                </LangItem>
                <LangItem onClick={() => handleLanguageChange('en')}>
                  <img src={usaFlag} alt="English" />
                  <span>English</span>
                </LangItem>
              </LangDropdown>
            )}
          </div>

          <Icon
            src={profileIcon}
            alt="내 프로필"
            onClick={() => (window.location.href = '/mypage')}
          />

          <Icon
            src={menuIcon}
            alt="메뉴"
            ref={menuButtonRef}
            onClick={() => setMenuOpen((prev) => !prev)}
          />
        </IconGroup>
      </HeaderWrapper>

      <MenuSidebar isOpen={menuOpen} innerRef={menuRef} language={language} onClose={() => setMenuOpen(false)}/>
    </>
  );
}

export default Header;
