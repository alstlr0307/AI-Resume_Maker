import styled from 'styled-components';

const CardWrapper = styled.div`
  background-color: ${({bgColor}) => bgColor || 'white'};
  border-radius: ${({radius}) => radius || '15px'};
  box-shadow: 1px 2px 10px rgba(0,0,0,0.1);
  padding: ${({padding}) => padding || '20px'};
  width: ${({width}) => width || '260px'};
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 2px 4px 12px rgba(0,0,0,0.15);
  }
`;

const CardTitle = styled.h3`
  font-size: ${({titleSize}) => titleSize || '1.1rem'};
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({titleColor}) => titleColor || '#222'};
`;

const CardText = styled.p`
  font-size: ${({textSize}) => textSize || '0.95rem'};
  color: ${({textColor}) => textColor || '#555'};
`;

function Card({ title, text, onClick, styles }) {
  return (
    <CardWrapper {...styles} onClick={onClick}>
      <CardTitle {...styles}>{title}</CardTitle>
      <CardText {...styles}>{text}</CardText>
    </CardWrapper>
  );
}

export default Card;
