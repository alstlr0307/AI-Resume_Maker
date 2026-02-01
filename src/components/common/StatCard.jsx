import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  min-width: 220px;
  text-align: center;
`;

const Label = styled.div`
  font-size: 1rem;
  color: #666;
`;

const Value = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 8px;
  color: #333;
`;

function StatCard({ label, value }) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Wrapper>
  );
}

export default StatCard;
