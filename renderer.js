document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  window.electronAPI.login(username, password);
});

window.electronAPI.onLoginResult((result) => {
  alert(result.success ? '登录成功' : '登录失败：' + result.message);
});