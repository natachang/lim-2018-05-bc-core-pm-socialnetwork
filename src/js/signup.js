const btnSignup = document.getElementById('btn-signup'),
    btnBack = document.getElementById('btn-back'),
    nameReg = document.getElementById('name-register'),
    emailReg = document.getElementById('email-register'),
    passwordReg = document.getElementById('password-register'),
    passwordVer = document.getElementById('verified-register');

const validateEmail = () => {
    if (/^\w+([\.-]?\w+)*@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/.test(emailReg.value) &&
        /^[ña-zA-Z\d]{6,}$/.test(passwordReg.value) &&
        /^[ña-zA-Z\d]{6,}$/.test(passwordVer.value) &&
        /^[ña-z ]{2,30}$/i.test(nameReg.value)) {
        registerWithFirebase(nameReg.value, emailReg.value, passwordReg.value, passwordVer.value);
    }
}

btnSignup.addEventListener('click', () => {
    if (emailReg.value.length === 0) {
        alert('Ingrese bien su correo');
    }
    else if (passwordReg.value.length >= 8 && passwordReg.value === passwordVer.value) {
        validateEmail();
        alert('El email de validacion se ha enviado a tu correo.');
    }
    else {
        alert('Las contraseñas no coinciden. Deben ser mas de 8 caracteres.')
    }
});

btnBack.addEventListener('click', () => {
    window.location.href = 'index.html';
});