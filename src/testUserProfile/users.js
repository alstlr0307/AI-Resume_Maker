// src/testUserProfile/users.js
export const users = [
  {
    id: 1,
    username: '리준환',
    password: '1234',
    email: 'isNaN@naver.com',
    status: 'active',
    createdAt: '2025-04-01',
  },
  {
    id: 2,
    username: '리민영',
    password: '1234',
    email: 'lee@gmail.com',
    status: 'inactive',
    createdAt: '2025-04-02',
  },
  {
    id: 3,
    username: '송가네',
    password: '1234',
    email: 'song@naver.com',
    status: 'active',
    createdAt: '2025-04-03',
  },
  {
    id: 4,
    username: '민식킴',
    password: '1234',
    email: 'um.gmail.com',
    status: 'active',
    createdAt: '2025-04-05',
  },
  {
    id: 999,
    username: '관리자',
    password: '1234',
    email: 'admin',
    role: 'admin', // ✅ 관리자 구분용
    status: 'active',
    createdAt: '2025-04-06',
  },
];
