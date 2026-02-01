import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import MainTop from '../components/MainTop';
import MainMiddle from '../components/MainMiddle';
import MainBottom from '../components/MainBottom';
import Footer from '../components/Footer';

const PageWrapper = styled.div`
  background: linear-gradient(to bottom, #88ccf9, #b6e4ff, #d9f3ff, #f1fbff);
  width: 100%;
  position: relative;
  scroll-behavior: smooth;
`;

const HighlightBanner = styled.div`
  background-color: #fffbcc;
  color: #333;
  text-align: center;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 1rem;
`;

const ScrollTopBtn = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #5cbef7;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 50px;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: 0.3s ease;
  z-index: 999;

  &:hover {
    background-color: #3daee6;
  }
`;

function MainPage({ language, onChangeLanguage }) {
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bannerText = {
    ko: '지금 바로 AI와 함께 이력서를 시작해보세요!',
    en: 'Start building your resume with AI right now!',
  };

  return (
    <PageWrapper>
      <Header language={language} onChangeLanguage={onChangeLanguage} />
      <HighlightBanner>{bannerText[language]}</HighlightBanner>
      <MainTop language={language} />
      <MainMiddle language={language} />
      <MainBottom language={language} />
      <Footer language={language} />
      {showScrollBtn && <ScrollTopBtn onClick={handleScrollTop}>TOP</ScrollTopBtn>}
    </PageWrapper>
  );
}

export default MainPage;
