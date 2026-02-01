// src/adminPages/users/UsersPage.jsx
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  padding: 40px;
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 260px;
`;

const FilterButton = styled.button`
  padding: 8px 14px;
  background-color: #e0f7fa;
  border: 1px solid #00acc1;
  color: #007c91;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #b2ebf2;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const UserCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isApproved' && prop !== 'isAdmin',
})`
  background: ${(props) => {
    if (props.isAdmin) return '#d0f0c0'; 
    if (props.isApproved) return 'white'; 
    return '#ffe0e0'; 
  }};
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
`;

const ApproveButton = styled(ActionButton)`
  background-color: #157aac;
  color: white;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
  color: white;
`;

const RoleButton = styled(ActionButton)`
  background-color: #f1c40f;
  color: black;
`;

function UsersPage() {
  const [search, setSearch] = useState('');
  const [userList, setUserList] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 안 됐거나 관리자가 아니면 홈으로 리디렉션
    if (!user.loggedIn || !user.isAdmin) {
      alert("접근 권한이 없습니다.");
      navigate('/');
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
    const response = await api.get('/api/user');
    setUserList(response.data);
  } catch (err) {
    console.error('Error fetching users:', err.message);
  }
  };

  const approveUser = async (userNo) => {
    try {
    await api.post(`/api/user/approve-user/${userNo}`);
    alert('승인되었습니다!');
    fetchUsers();
  } catch (err) {
    console.error('Error approving user:', err.message);
    alert('승인 실패');
  }
  };

  const deleteUser = async (userNo) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
  try {
    await api.delete(`/api/user/delete/${userNo}`);
    alert('삭제되었습니다!');
    fetchUsers();
  } catch (err) {
    console.error('Error deleting user:', err.message);
    alert('삭제 실패');
  }
  };

  const toggleRole = async (userNo, currentIsAdmin) => {
  try {
    await api.post(`/api/user/role/${userNo}`, { isAdmin: !currentIsAdmin });
    alert('역할이 변경되었습니다!');
    fetchUsers();
  } catch (err) {
    console.error('역할 변경 실패:', err.message);
    alert('역할 변경 실패');
  }
};

  const filteredUsers = userList.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(search.toLowerCase()) || user.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'ADMIN' && user.isAdmin) ||
      (filter === 'USER' && !user.isAdmin) ||
      (filter === 'NOT_APPROVED' && !user.isApproved);
    return matchesSearch && matchesFilter;
  });

  return (
    <Wrapper>
      <TopBar>
        <Title>회원 관리</Title>
        <FilterWrapper>
          <FilterButton onClick={() => setFilter('ALL')}>전체</FilterButton>
          <FilterButton onClick={() => setFilter('ADMIN')}>관리자</FilterButton>
          <FilterButton onClick={() => setFilter('USER')}>유저</FilterButton>
          <FilterButton onClick={() => setFilter('NOT_APPROVED')}>미승인</FilterButton>
          <SearchInput
            type="text"
            placeholder="이름 또는 이메일 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </FilterWrapper>
      </TopBar>

      <UserList>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <UserCard key={user.userNo} isApproved={user.isApproved} isAdmin={user.isAdmin}>
              <div>
                <div><strong>{user.userName}</strong> ({user.userEmail})</div>
                <div>상태: {user.isApproved ? '승인됨' : '미승인'}</div>
              </div>
              <ButtonGroup>
                {/* ✅ 승인된 사용자만 역할 변경 버튼 보이게 */}
                {user.isApproved && (
                  <RoleButton onClick={() => toggleRole(user.userNo, user.isAdmin)}>
                  {user.isAdmin ? '관리자' : '유저'}
                  </RoleButton>
                )}

                {/* ✅ 미승인된 사용자만 승인 버튼 보이게 */}
                {!user.isApproved && (
                  <ApproveButton onClick={() => approveUser(user.userNo)}>승인</ApproveButton>
                )}

                {/* ✅ 삭제 버튼은 모두 보이게 */}
                <DeleteButton onClick={() => deleteUser(user.userNo)}>삭제</DeleteButton>
              </ButtonGroup>
            </UserCard>
          ))
        ) : (
          <div>검색 결과가 없습니다.</div>
        )}
      </UserList>
    </Wrapper>
  );
}

export default UsersPage;