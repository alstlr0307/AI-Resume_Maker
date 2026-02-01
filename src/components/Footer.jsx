import styled from 'styled-components';

const FooterWrapper = styled.footer`
  background-color: #2f2f2f;
  color: white;
  text-align: center;
  padding: 20px 10px;
  font-size: clamp(0.8rem, 1vw, 1rem);
  line-height: 1.5;
`;


function Footer({ language }) {
    const text = {
      ko: '대표전화 : 031-467-4700 | Copyright 학사뉴 ALL RIGHTS RESERVED',
      en: 'Tel: +82-31-467-4700 | Copyright BachelorNew ALL RIGHTS RESERVED',
    };
  
    return (
      <FooterWrapper>
        <p>13916 경기도 안양시 동안구 임곡로 29 (대림대학교)</p>
        <p>{text[language]}</p>
      </FooterWrapper>
    );
  }
  

export default Footer;
