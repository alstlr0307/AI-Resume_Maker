import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Home, LayoutDashboard, Users, MessageCircle, Settings } from 'lucide-react';

const Sidebar = styled.aside`
  width: 220px;
  min-height: 100vh;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 100px 20px 30px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SidebarLink = styled(NavLink)`
  padding: 10px 15px;
  border-radius: 10px;
  color: #444;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }

  &.active {
    background-color: #5cbef7;
    color: white;
  }
`;

const SidebarTitle = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

function AdminSidebar({ language }) {
  const text = {
    dashboard: language === 'en' ? 'Dashboard' : '대시보드',
    users: language === 'en' ? 'Users' : '회원 관리',
    reviews: language === 'en' ? 'Reviews' : '리뷰 관리',
    settings: language === 'en' ? 'Settings' : '사이트 설정',
    title: language === 'en' ? 'Admin' : '관리자 메뉴',
  };

  return (
    <Sidebar>
      <SidebarTitle>{text.title}</SidebarTitle>
      
      <SidebarLink end to="/admin">
        <Home size={20} /> {language === 'en' ? 'Admin Home' : '어드민 홈'}
      </SidebarLink>

      <SidebarLink end to="/admin/dashboard">
        <LayoutDashboard size={20} /> {text.dashboard}
      </SidebarLink>

      <SidebarLink to="/admin/users">
        <Users size={20} /> {text.users}
      </SidebarLink>

      <SidebarLink to="/admin/reviews">
        <MessageCircle size={20} /> {text.reviews}
      </SidebarLink>

      <SidebarLink to="/admin/settings">
        <Settings size={20} /> {text.settings}
      </SidebarLink>
      
    </Sidebar>
  );
}

export default AdminSidebar;
