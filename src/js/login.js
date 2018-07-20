const btnRegister = document.getElementById('btnRegister');

const registerWithFirebase = () => {
    const emailReg = document.getElementById('emailRegister').value;
    const passwordReg = document.getElementById('passwordRegister').value;

    firebase.auth().createUserWithEmailAndPassword(emailReg, passwordReg)
        .then(() => {
            verificationWithFirebase();
        })
        .catch((error) => {
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        });
};

const loginWithFirebase = () => {
    const emailLog = document.getElementById('emailLogin').value;
    const passwordLog = document.getElementById('passwordLogin').value;

    firebase.auth().signInWithEmailAndPassword(emailLog, passwordLog)
        .then(() => {
            console.log("Usuario logeado con exito");
        })
        .catch((error) => {
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        })
};

//Observa si existe el usuario
const observationWithFirebase = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('existe usuario activo');
            showWithFirebase(user);
            // User is signed in.
            // let displayName = user.displayName;
            // let email = user.email;
            // console.log(user.emailVerified);
            // let emailVerified = user.emailVerified;
            // let photoURL = user.photoURL;
            // let isAnonymous = user.isAnonymous;
            // let uid = user.uid;
            // let providerData = user.providerData;
        } else {
            // User is signed out.
            contenido.innerHTML = `
            `;
            console.log('no existe usuario activo');
        }
    });
};
observationWithFirebase();

const showWithFirebase = (user) => {
    const contenido = document.getElementById('contenido');
    if (user.emailVerified) {
        mainLogin.style.display = 'none';
        contenido.innerHTML = `
        <article class="content mt-5">
            <div class="alert alert-success" role="alert">
            <h4 class="alert-heading">Bienvenido ${user.email}</h4>
            <p>Ingresaste a la Red Social</p>
            </div>
            <button id="btnLogout" class="btn btn-danger" onclick="logoutWithFirebase()">Cerrar Sesion</button>
        </article>
        `;
    }
    //Caso contrario que me salga un alert
};

const logoutWithFirebase = () => {
    firebase.auth().signOut()
        .then(() => {
            mainLogin.style.display = 'block';
            console.log("Usuario finalizo su sesion");
        })
        .catch((error) => {
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        })
};

const verificationWithFirebase = () => {
    const user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {
        // Email sent.
        console.log('Enviando correo...');
    }).catch(function (error) {
        // An error happened.
        console.log(error);
    });
};

const logFacebookWithFirebase = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
        .then(() => {
            console.log('Tiene que llamar al contenido');
        })
        .catch((error) => {
            console.log('error de firebase > ' + error.code);
            console.log('error de firebase, mensaje > ' + error.message);
        });
};

btnRegister.addEventListener('click', () => {
    alert('El email de validacion se ha enviado a tu correo.');
    // window.location.href = 'login.html';
})