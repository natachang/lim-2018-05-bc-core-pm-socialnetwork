const btnSignup = document.getElementById('btn-signup'),
    btnBack = document.getElementById('btn-back'),
    nameReg = document.getElementById('name-register'),
    emailReg = document.getElementById('email-register'),
    passwordReg = document.getElementById('password-register'),
    passwordVer = document.getElementById('verified-register');

btnSignup.addEventListener('click', () => {
    if (emailReg.value.length === 0) {
        alert('Ingrese un correo');
    }
    else if (passwordReg.value.length <= 6) {
        alert('Ingresa una contraseña mayor a 6 caracteres');
    }
    else {
        registerWithFirebase();
        alert('El email de validacion se ha enviado a tu correo.');
    }
});

btnBack.addEventListener('click', () => {
    window.location.href = 'index.html';
});