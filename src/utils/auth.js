// src/utils/auth.js

export function getUsers() {
    const users = localStorage.getItem('dummyUsers');
    return users ? JSON.parse(users) : [];
  }
  
  export function saveUser(newUser) {
    const users = getUsers();
    users.push(newUser);
    localStorage.setItem('dummyUsers', JSON.stringify(users));
  }
  
  export function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
  }
  
  export function validateLogin(email, password) {
    const user = findUserByEmail(email);
    if (!user) return null;
    return user.password === password ? user : null;
  }
  