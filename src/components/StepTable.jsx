import React, { useState } from 'react';
import styled from 'styled-components';

// 공통 스타일 Input / Select
const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  background-color: #fff;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const AddRowButton = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #146c94;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0d5477;
  }
`;

const DeleteRowButton = styled.button`
  font-weight:bold;
  text-align: center;
  margin-top: 10px;
  margin-left: 10px;
  padding: 6px 12px;
  color: rgb(203, 73, 73);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #0d5477;
  }
`;

const Input = React.memo((props) => {
  return <StyledInput {...props} />;
});
const Select = React.memo(({ options = [], ...props }) => {
  return (
    <StyledSelect {...props}>
      <option value="">선택</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </StyledSelect>
  );
});

export { Input, Select };

// 컬럼 정의
const columnConfigs = {
  languageSang:{ ko: "상", en: "High" },
  languageJoong:{ ko: "중", en: "Medium" },
  languageHa:{ ko: "하", en: "Low" },
  education: {
    ko: ['졸업일', '학교명', '졸업여부', '성적'],
    en: ['Graduation Date', 'School Name', 'Graduation Status', 'Grade'],
    keys: ['Graduation Date', 'School Name', 'Graduation Status', 'Grade'],
  },
  career: {
    ko: ['근무기간', '회사명', '최종직위', '담당업무'],
    en: ['Employment Period', 'Company Name', 'Final Position', 'Responsibilities'],
    keys: ['Employment Period', 'Company Name', 'Final Position', 'Responsibilities'],
  },
  certificate: {
    ko: ['취득일', '자격명', '발행처'],
    en: ['Date of Acquisition', 'Eertificate Name', 'Issuer'],
  },
  languageSkills: {
    ko: ['언어명', '구사정도', '시험명', '점수'],
    en: ['Language', 'Proficiency', 'Test Name', 'Score'],
  },
  military: {
    ko: ['복무기간', '군별', '계급', '병과', '병역여부', '보훈대상'],
    en: ['Service Period', 'Branch', 'Rank', 'Military Specialty', 'Service Status', 'Veteran Status'],
  },
};

// 메인 컴포넌트
const StyledTable = ({
  type,
  inputComponent,
  selectComponent,
  showMore = false,
  language = 'ko',
  value = [],
  onChange,
}) => {
  const safeValue = Array.isArray(value) ? value : [];

  // 초기값이 빈 배열이면 기본 한 행 생성
  const [internalValue, setInternalValue] = useState(() => {
    if (!Array.isArray(value) || value.length === 0) {
      return [Array(columnConfigs[type][language].length).fill("")];
    }
    return value;
  });

  // 부모 value가 변경되면 내부 값 동기화
  React.useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      setInternalValue(value);
    }
  }, [value]);

  const labels = Array.isArray(columnConfigs[type]?.[language]) ? columnConfigs[type][language] : [];

  // 행 추가
  const handleAddRow = () => {
    const newData = [...internalValue, Array(labels.length).fill("")];
    setInternalValue(newData);
    onChange?.(newData);
  };

  // 행 삭제 (최소 1줄 유지하지 않음)
  const handleDeleteRow = (rowIndex) => {
    const newData = internalValue.filter((_, idx) => idx !== rowIndex);
    setInternalValue(newData);
    onChange?.(newData);
  };

  const handleCellChange = (rowIndex, colIndex, newValue) => {
    const updatedData = internalValue.map((row, r) =>
      r === rowIndex ? row.map((cell, c) => (c === colIndex ? newValue : cell)) : row
    );
    setInternalValue(updatedData);
    onChange?.(updatedData);
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            {labels.map((label, index) => (
              <Th key={index}>{label}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {internalValue.length === 0 ? (
            <tr>
              <Td colSpan={labels.length + 1} style={{ textAlign: 'center', color: '#999' }}>
                {language === 'ko' ? '데이터가 없습니다.' : 'No data available.'}
              </Td>
            </tr>
          ) : (
            internalValue.map((row, rowIndex) => (
              <tr key={rowIndex}>
      {labels.map((_, colIndex) => {
        const name = `${type}_${rowIndex}_${colIndex}`;
        let Component = inputComponent;
        let options = [];

                // 조건: 특정 열만 select로 처리
 
                if (type === 'languageSkills' && colIndex === 1){
                  Component = selectComponent;
                  options = [columnConfigs.languageSang[language], columnConfigs.languageJoong[language], columnConfigs.languageHa[language]];
                } else if (type === 'education' && colIndex === 2) {
                  Component = selectComponent;
                  options = language === 'ko'
                    ? ['졸업', '졸업예정', '수료', '중퇴', '휴학', '재학']
                    : ['Graduated', 'Expected Graduation', 'Completed', 'Withdrawn', 'Leave of Absence', 'Enrolled'];
}

                return (
                  <Td key={colIndex}>
                    <Component
                      name={name}
                      value={safeValue[rowIndex]?.[colIndex] || ""}
                      onChange={(e) => {
                        let newValue = e.target.value;

                        if(type === 'education' && colIndex===3){
                          newValue = newValue.replace(/[^0-9./]/g, '');
                        }
                        else if((type === 'education' && colIndex===0)||
                          (type === 'certificate' && colIndex===0)
                        ){
                          newValue = newValue.replace(/[^0-9]/g, '');
                          
                          // 숫자가 4개 이상이면 4번째 뒤에 온점 추가
                          if (newValue.length > 4) {
                            newValue = newValue.slice(0, 4) + '.' + newValue.slice(4);
                          }

                          // 최대 7글자 제한
                          newValue = newValue.slice(0, 7);

                        }
                        else if (type === 'career' && colIndex === 0) {
                          newValue = newValue.replace(/[^0-9]/g, '').slice(0, 12); // 최대 12자리 (YYYYMMYYYYMM)

                          if (newValue.length >= 4 && newValue.length <= 6) {
                            // 시작 년도 뒤에 점 추가
                            newValue = newValue.slice(0, 4) + '.' + newValue.slice(4);
                          } else if (newValue.length > 6) {
                            // 시작: YYYYMM, 종료: YYYYMM
                            const start = newValue.slice(0, 6);
                            const end = newValue.slice(6, 12);
                            newValue =
                              start.slice(0, 4) + '.' + start.slice(4, 6) +
                              ' ~ ' +
                              (end.length >= 4 ? end.slice(0, 4) + '.' + end.slice(4, 6) : end);
                          }
                        }

                        handleCellChange(rowIndex, colIndex, newValue)
                      }}
                      options={options}
                      placeholder={
                      type === 'education' && colIndex === 0
                        ? (language === 'ko' ? '예: 2025.02' : 'e.g. 2025.02')
                        : type === 'education' && colIndex === 3
                        ? (language === 'ko' ? '4.5/4.5' : '4.5/4.5')
                        : type === 'career' && colIndex === 0
                        ? (language === 'ko' ? '예: 2020.02 ~ 2025.02' : 'e.g. 2020.02 ~ 2025.02')
                        : type === 'certificate' && colIndex === 0
                        ? (language === 'ko' ? '예: 2020.02' : 'e.g. 2020.02')
                        : type === 'languageSkills' && colIndex === 3
                        ? (language === 'ko' ? '예: 70/100 또는 700/1000' : 'e.g. 70/100 or 700/1000')
                        :undefined
                      }
                    />
                    </Td>
                );
              })}
                  <DeleteRowButton onClick={() => handleDeleteRow(rowIndex)}>🗑️</DeleteRowButton>
            </tr>
          ))
          )}
        </tbody>
      </Table>

      {showMore && (
        <AddRowButton onClick={handleAddRow}>
          {language === 'ko' ? '+ 더 쓰기' : '+ Add More'}
        </AddRowButton>
      )}
    </>
  );
};

export default StyledTable;
