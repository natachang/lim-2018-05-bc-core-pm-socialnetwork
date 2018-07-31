const btnSignup = document.getElementById('btn-signup'),
    btnBack = document.getElementById('btn-back'),
    nameReg = document.getElementById('name-register'),
    emailReg = document.getElementById('email-register'),
    passwordReg = document.getElementById('password-register'),
    passwordVer = document.getElementById('verified-register');

btnSignup.addEventListener('click', () => {
    if (emailReg.value.length === 0) {
        alert('Ingrese bien su correo');
    }
    else if (passwordReg.value.length >=8 && passwordReg.value === passwordVer.value) {
        registerWithFirebase();
        alert('El email de validacion se ha enviado a tu correo.');
    }
    else {
        alert('Las contraseñas no coinciden. Deben ser mas de 8 caracteres.')
    }
});

btnBack.addEventListener('click', () => {
    window.location.href = 'index.html';
});