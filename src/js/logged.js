//Iniciando Sesion con Firebase
const loginWithFirebase = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
            const user = firebase.auth().currentUser;
            console.log('Usuario logeado con exito', result);
            location.assign('perfil.html');
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
            location.assign('perfil.html');
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
            location.assign('perfil.html');
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
    var actionCodeSettings = {
        url: 'https://jslyne.github.io/lim-2018-05-bc-core-pm-socialnetwork/src/perfil.html',
        handleCodeInApp: false
    };

    const user = firebase.auth().currentUser;
    user.sendEmailVerification(actionCodeSettings)
        .then(() => {
            console.log('>>Enviando correo<<');
        })
        .catch(error => {
            console.log(error);
        });
};

//Creando usuario con email y contraseña
const registerWithFirebase = (name, email, password, valpassword) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
            verificationWithFirebase();
            // Hasta aqui sale el usuario registrado sin ningun error
            result.updateProfile({ displayName: nameReg.value,  profile_picture: 'https://www.shareicon.net/data/2016/09/01/822712_user_512x512.png'});

            writeUserData(result.uid, result.displayName, result.email, result.photoURL);
            console.log('usuario creado con exito');

            firebase.database().ref().child('users/' + writeUserData.uid).push({
                id: writeUserData.uid,
                displayName: writeUserData.displayName,
                email: writeUserData.email,
                profile_picture: writeUserData.photoURL,
            });
        })
        .catch(error => {
            errorRegister(error);
            //Mostrar error en consola
            console.log("Error de firebase > Codigo >" + error.code);
        });
};