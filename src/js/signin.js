const btnLogin = document.getElementById('btn-login'),
    btnFacebook = document.getElementById('btn-facebook'),
    btnGoogle = document.getElementById('btn-google'),
    emailLog = document.getElementById('email-login'),
    passwordLog = document.getElementById('password-login');

btnLogin.addEventListener('click', () => {
    if (emailLog.value === '' || passwordLog.value === '') {
        swal(' Por favor completa tu email y password para loguearte !!');
    }
    else {
        loginWithFirebase(emailLog.value, passwordLog.value);
    }
});

btnFacebook.addEventListener('click', () => {
    facebookWithFirebase();
});

btnGoogle.addEventListener('click', () => {
    googleWithFirebase();
});