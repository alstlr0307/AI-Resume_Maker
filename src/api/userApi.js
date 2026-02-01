// src/api/userApi.js
import { users } from '../testUserProfile/users';

export const fetchUsers = async () => {
  // 나중엔 axios.get('https://yourserver.com/api/users') 로 대체 예정
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 300); // 시뮬레이션용 딜레이
  });
};
