const btnSignup = document.getElementById('btn-signup'),
    nameReg = document.getElementById('name-register'),
    emailReg = document.getElementById('email-register'),
    passwordReg = document.getElementById('password-register'),
    passwordVer = document.getElementById('verified-register'),
    errorName = document.getElementById('error-name'),
    errorEmail = document.getElementById('error-email'),
    errorPassword = document.getElementById('error-password'),
    errorVerificar = document.getElementById('error-verificar');

const validateRegister = (name, email, password, valpassword) => {
    const validateName = window.validateName(name),
        validateEmail = window.validateEmail(email),
        validatePassword = window.validatePassword(password),
        validateVerificar = window.validateVerificar(valpassword);

    if (validateEmail && validateName && validatePassword === validateVerificar) {
        registerWithFirebase(name, email, password, valpassword)
        return true;
    }
    else if (!validateName) {
        errorName.innerHTML = '<p>Ingresa bien tu nombre.</p>';
        return false;
    }
    else if (!validateEmail) {
        errorEmail.innerHTML = '<p>El correo es inválido</p>';
        return false;
    }
    else if (!validatePassword) {
        errorPassword.innerHTML = '<p>La contraseña debe tener más de 8 dígitos</p>';
        return false;
    }
    else if (!validatePassword !== !validateVerificar) {
        errorVerificar.innerHTML = '<p>Las contraseñas deben ser iguales</p>';
        return false;
    }
};

btnSignup.addEventListener('click', () => {
    errorName.innerHTML = '';
    errorEmail.innerHTML = '';
    errorPassword.innerHTML = '';
    errorVerificar.innerHTML = '';

    validateRegister(nameReg.value, emailReg.value, passwordReg.value, passwordVer.value);
});

const errorRegister = (error) => {
    if (error.code === 'auth/email-already-in-use') {
        errorEmail.innerText = 'Ya existe un usuario con este correo. Por favor, ingrese otro';
    } else if (error.code === 'auth/invalid-email') {
        errorEmail.innerText = 'Por favor, agregue un correo válido';
    } else if (error.code === 'auth/weak-password') {
        errorPassword.innerText = 'Ingresa una contraseña con más de 8 caracteres';
    }
};

const cleanRegister = () => {
    nameReg.value = '';
    emailReg.value = '';
    passwordReg.value = '';
    passwordVer.value = '';
};