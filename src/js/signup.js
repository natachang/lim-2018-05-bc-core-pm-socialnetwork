const btnSignup = document.getElementById('btn-signup'),
    nameReg = document.getElementById('name-register'),
    emailReg = document.getElementById('email-register'),
    passwordReg = document.getElementById('password-register'),
    passwordVer = document.getElementById('verified-register'),
    errorEmail = document.getElementById('error-email'),
    errorPassword = document.getElementById('error-password'),
    errorName = document.getElementById('error-name'),
    iconVerificationName = document.getElementById('icon-verification-name'),
    iconVerificationEmail = document.getElementById('icon-verification-email');

btnSignup.addEventListener('click', (error, email) => {

    if (nameReg.value.length === 0) {
        errorName.innerHTML = 'Ingresa un nombre por favor';
    }
    else if (nameReg.value.length !== 0) {
        iconVerificationName.innerHTML = '✅';
        errorName.innerHTML = '';
    }
    if (emailReg.value.length === 0 || error.code === 'auth/invalid-email') {
        errorEmail.innerHTML = 'Ingrese bien su correo';
    }
    else if (emailReg.value.length !== 0 && /^([a-zA-Z0-9._-]{3,})+@([a-zA-Z0-9.-]{5,})+\.([a-zA-Z]{2,})+$/.test(email)) {
        iconVerificationEmail.innerHTML = '✅';
        errorEmail.innerHTML = '';
    }
    if (passwordReg.value.length >= 8 && passwordReg.value === passwordVer.value) {
        registerWithFirebase(nameReg.value, emailReg.value, passwordReg.value, passwordVer.value);
        cleanRegister();
        alert('El email de validacion se ha enviado a tu correo');
    }
    else {
        errorPassword.innerHTML = 'Las contraseñas no coinciden. Deben ser mas de 8 caracteres';
    }
});

const errorRegister = (error) => {
    if (error.code === 'auth/email-already-in-use') {
        errorEmail.innerText = 'Ya existe un usuario con este correo. Por favor, ingrese otro';
    } else if (error.code === 'auth/invalid-email') {
        errorEmail.innerText = 'Por favor, agregue un correo válido';
    } else if (error.code === 'auth/weak-password') {
        errorPassword.innerText = 'Ingresa una contraseña con más de 6 caracteres';
    }
};

const cleanRegister = () => {
    nameReg.value = '';
    emailReg.value = '';
    passwordReg.value = '';
    passwordVer.value = '';
};