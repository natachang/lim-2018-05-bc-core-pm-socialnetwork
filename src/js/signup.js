const btnSignup = document.getElementById('btn-signup'),
    nameReg = document.getElementById('name-register'),
    emailReg = document.getElementById('email-register'),
    passwordReg = document.getElementById('password-register'),
    passwordVer = document.getElementById('verified-register'),
    errorEmail = document.getElementById('error-email'),
    errorPassword = document.getElementById('error-password');

btnSignup.addEventListener('click', () => {
    if (emailReg.value.length === 0) {
        alert('Ingrese bien su correo');
    }
    else if (passwordReg.value.length >= 8 && passwordReg.value === passwordVer.value) {
        registerWithFirebase(nameReg.value, emailReg.value, passwordReg.value, passwordVer.value);
        cleanRegister();
<<<<<<< HEAD
        swal({
            title: 'El email de validacion se ha enviado a tu correo'
        })
            .then((sendEmail) => {
                if (sendEmail) {
                    verificationWithFirebase();
                }
                else {
                    alert('Las contraseñas no coinciden. Deben ser mas de 8 caracteres.')
                }

            })
=======
        swal("El email de validacion se ha enviado a tu correo.", "info");
    }
    else {
        alert('Las contraseñas no coinciden. Deben ser mas de 8 caracteres.')
>>>>>>> b1b5b315323baeea38faf14564b0ce933549996b
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