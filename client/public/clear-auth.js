// Script para limpar autenticação e redirecionar para login
localStorage.removeItem('isAuthenticated');
localStorage.removeItem('userEmail');
alert('Autenticação limpa! Redirecionando para login...');
window.location.href = '/login';