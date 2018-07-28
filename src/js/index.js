expCorreo = /\w+@[a-z]+\.+[a-z]/;

window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('existe usuario activo');

            mainWall.style.display = 'block';
            mainLogin.style.display = 'none';

            let displayName = user.displayName;
            let email = user.email;
            let emailVerified = user.emailVerified;
            let userPhotoURL = user.photoURL
            userImage.setAttribute('src', userPhotoURL);
            // let isAnonymous = user.isAnonymous;
            // let uid = user.uid;
            // let providerData = user.providerData;

            userName.innerHTML = 'Bienvenidx ' + displayName + 'Email: ' + email + 'Verified: ' + emailVerified;
        } else {
            // User is signed out.
            console.log('no existe usuario activo');
            mainWall.style.display = 'none';
            mainLogin.style.display = 'block';
        }
        console.log('user > ', user);
    });
};

writeUserData = (userId, name, email, imageUrl) => {
    firebase.database().ref('users/' + userId).set({
        username: name,
        email: email,
        profile_picture: imageUrl
    })
};

const verificationWithFirebase = () => {
    const user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {
        console.log('Enviando correo >>>');
    }).catch(function (error) {
        console.log(error);
    });
};

window.registerWithFirebase = () => {
    firebase.auth().createUserWithEmailAndPassword(emailReg.value, passwordReg.value)
        .then(() => 
            verificationWithFirebase(),
            (result) => {
            console.log('usuario creado con exito');
            const user = result.user;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                errorEmail.innerText = 'El correo ya esta registrado. Ingrese otro';
            }
            else if (error.code === 'auth/invalid-email') {
                adviceEmailRegister.innerText = 'Por favor, agregue un correo válido';
            }
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        });
        if (emailReg.value === '' || passwordReg === '') {
            alert(' Por favor completa tu email y password para registrarte');
        }
};

const loginWithFirebase = () => {
    firebase.auth().signInWithEmailAndPassword(emailLog.value, passwordLog.value)
        .then(() => {
            console.log("Usuario logeado con exito");
        })
        .catch((error) => {
            if (error.code === 'auth/wrong-password') {
                errorAdvice.innerText = 'Su contraseña es incorrecta';
            }
            else if (error.code === 'auth/user-not-found') {
                errorEmail.innerText = 'No existe un usuario con este correo';
            }
            console.log('Error de firebase > Codigo >' + error.code);
            console.log('Error de firebase > Mensaje >' + error.message);
        })

        if (emailLog. value === '' || passwordLog.value === '') {
            alert(' Por favor completa tu email y password para loguearte !!');
        }
        else if (!expCorreo.test(emailLog.value)) {
            alert('El correo no es valido')
        }
};

const logoutWithFirebase = () => {
    firebase.auth().signOut()
        .then(() => {
            console.log('Usuario finalizo su sesion');
            mainWall.style.display = 'none';
            mainLogin.style.display = 'block';
        })
        .catch((error) => {
            console.log('Error de firebase > Codigo >' + error.code);
            console.log('Error de firebase > Mensaje >' + error.message);
        })
};

const facebookWithFirebase = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log('Facebook logueado');
            const token = result.provider.accessToken;
            const user = result.user;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch((error) => {
            console.log('error de firebase > ' + error.code);
            console.log('error de firebase, mensaje > ' + error.message);
        });
};

const googleWithFirebase = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log('Google logueado')
            const user = result.user;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);;
            console.log(error.email);
            console.log(error.credential);
        });
};

const writeNewPost = (uid, body) => {
    let postData = {
        uid: uid,
        body : body,
    };

    const newPostKey = firebase.database().ref().child('posts').push().key;

    let updates ={ };

    updates['/posts/' + newPostKey] = postData;

    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    firebase.database().ref().update(updates);
    return newPostKey;
};