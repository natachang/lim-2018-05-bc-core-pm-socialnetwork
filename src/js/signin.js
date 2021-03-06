const btnLogin = document.getElementById('btn-login'),
    btnFacebook = document.getElementById('btn-facebook'),
    btnGoogle = document.getElementById('btn-google'),
    emailLog = document.getElementById('email-login'),
    passwordLog = document.getElementById('password-login'),
    errorEmail = document.getElementById('error-email'),
    errorPassword = document.getElementById('error-password');

const validateLogin = (email, password) => {
    const validateEmail = window.validateEmail(email),
        validatePassword = window.validatePassword(password);
    if (validateEmail && validatePassword) {
        loginWithFirebase(email, password)
        return true;
    }
    else if (!validateEmail) {
        errorEmail.innerHTML = '<p>El correo es inválido</p>';
        return false;
    }
    else if (!validatePassword) {
        errorPassword.innerHTML = '<p>La contraseña debe tener más de 8 dígitos</p>';
        return false;
    }
};

btnLogin.addEventListener('click', () => {
    errorEmail.innerHTML = '';
    errorPassword.innerHTML = '';
    validateLogin(emailLog.value, passwordLog.value);
});

btnFacebook.addEventListener('click', () => {
    facebookWithFirebase();
});

btnGoogle.addEventListener('click', () => {
    googleWithFirebase();
});

const errorLogin = (error) => {
    if (error.code === 'auth/wrong-password') {
        errorPassword.innerText = 'Su contraseña es incorrecta';
    }
    else if (error.code === 'auth/invalid-email') {
        errorEmail.innerText = 'Por favor, agregue un correo válido';
    }
    else if (error.code === 'auth/user-not-found') {
        errorEmail.innerText = 'No existe un usuario con este correo. Por favor, regístrese';
    }
};