// src/components/LanguageSelector.jsx
import styled from 'styled-components';
import korea from '../assets/korea.png';
import usa from '../assets/usa.png';

const LanguageBox = styled.div`
  position: absolute;
  top: 65px;
  right: 70px;
  width: 160px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  z-index: 150;
  padding: 10px;
`;

const LangItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }
`;

const Flag = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 3px;
`;

const LangName = styled.span`
  font-size: 1rem;
`;

function LanguageSelector({ onSelect }) {
  return (
    <LanguageBox>
      <LangItem onClick={() => onSelect('ko')}>
        <Flag src={korea} alt="한국어" />
        <LangName>한국어</LangName>
      </LangItem>
      <LangItem onClick={() => onSelect('en')}>
        <Flag src={usa} alt="영어" />
        <LangName>English</LangName>
      </LangItem>
    </LanguageBox>
  );
}

export default LanguageSelector;
