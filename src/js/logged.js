//Iniciando Sesion con Firebase
const loginWithFirebase = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
            const user = firebase.auth().currentUser;
            console.log('Usuario logeado con exito', result);
            location.assign('splash.html');
        })
        .catch(error => {
            errorLogin(error);
            console.log('Error de firebase > Codigo >' + error.code);
        })
};

//Iniciando con Facebook
const facebookWithFirebase = () => {
    const providerFb = new firebase.auth.FacebookAuthProvider();
    providerFb.addScope('email');
    providerFb.addScope('user_friends');
    providerFb.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(providerFb)
        .then(result => {
            var user = result.user;
            var credential = result.credential;
            var operationType = result.operationType;
            console.log('Facebook logueado');
            location.assign('splash.html');
        })
        .catch(error => {
            console.log('error de firebase > ' + error.code);
            console.log('error de firebase, mensaje > ' + error.message);
        });
};

//Iniciando con Google
const googleWithFirebase = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });

    firebase.auth().signInWithPopup(provider)
        .then(result => {
            console.log('Google logueado');
            const user = result.user;
            const token = result.credential.accessToken;
            console.log(user, token);
            location.assign('splash.html');
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);;
            console.log(error.email);
            console.log(error.credential);
        });
};

//Verificando usuario
const verificationWithFirebase = () => {
    const user = firebase.auth().currentUser;
    user.sendEmailVerification()
        .then(() => {
            console.log('>>Enviando correo<<');
        })
        .catch(error => {
            console.log(error);
        });
};

const registerWithFirebase = (name, email, password, valpassword) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
            verificationWithFirebase();
            result.updateProfile({ displayName: nameReg.value });

            writeUserData(result.uid, result.displayName, result.email, result.photoURL);
            firebase.database().ref().child('users/' + writeUserData.uid).push({
                id: writeUserData.uid,
                displayName: writeUserData.displayName,
                email: writeUserData.email
            });
            // location.assign('login.html');
        })
        .catch(error => {
            errorRegister(error);
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        });
};