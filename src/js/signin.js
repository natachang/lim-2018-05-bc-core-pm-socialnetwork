const btnLogin = document.getElementById('btn-login'),
    btnFacebook = document.getElementById('btn-facebook'),
    btnGoogle = document.getElementById('btn-google'),
    btnNext = document.getElementById('btn-next'),
    emailLog = document.getElementById('email-login'),
    passwordLog = document.getElementById('password-login');
btnNext.addEventListener('click', () => {
    location.assign('register.html');
})
btnLogin.addEventListener('click', () => {
    loginWithFirebase();
});
btnFacebook.addEventListener('click', () => {
    facebookWithFirebase();
});
btnGoogle.addEventListener('click', () => {
    googleWithFirebase();
});