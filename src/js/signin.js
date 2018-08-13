const btnLogin = document.getElementById('btn-login'),
    btnFacebook = document.getElementById('btn-facebook'),
    btnGoogle = document.getElementById('btn-google'),
    emailLog = document.getElementById('email-login'),
    passwordLog = document.getElementById('password-login'),
    errorEmail = document.getElementById('error-email'),
    errorPassword = document.getElementById('error-password');

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