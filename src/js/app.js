expCorreo = /\w+@[a-z]+\.+[a-z]/;

window.onload = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('existe usuario activo');
         
            let uid = user.uid;
            let userNom = firebase.auth().currentUser.displayName;;
            let email = user.email;
            let emailVerified = user.emailVerified;
            let userPhoto = user.photoURL;

            userName.innerHTML = userNom + '<br>';
            userEmail.innerHTML = email + '<br>' + emailVerified;

            if (userPhoto != null) {
                userImage.setAttribute('src', userPhoto);
            }
            else {
                userImage.setAttribute('src', 'img/user.png');
            };


            // let isAnonymous = user.isAnonymous;
            // let uid = user.uid;
            // let providerData = user.providerData;
        } else {
            // User is signed out.
            console.log('no existe usuario activo');
        }
        console.log('user > ', user);
    });
};


writeUserData = (userId, username, email, imageUrl) => {
    firebase.database().ref('users/' + userId).set({
        id: userId,
        username: username,
        email: email,
        profile_picture: imageUrl
    })
};


window.verificationWithFirebase = () => {
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
                const user = firebase.auth().currentUser;
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



window.loginWithFirebase = () => {
    firebase.auth().signInWithEmailAndPassword(emailLog.value, passwordLog.value)
        .then(() => {
            console.log("Usuario logeado con exito");
            location.assign('wall.html');
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

    if (emailLog.value === '' || passwordLog.value === '') {
        alert(' Por favor completa tu email y password para loguearte !!');
    }
    else if (!expCorreo.test(emailLog.value)) {
        alert('El correo no es valido')
    }
};

window.logoutWithFirebase = () => {
    firebase.auth().signOut()
        .then(() => {
            console.log('Usuario finalizo su sesion');
            location.assign('index.html');
        })
        .catch((error) => {
            console.log('Error de firebase > Codigo >' + error.code);
            console.log('Error de firebase > Mensaje >' + error.message);
        })
};

window.facebookWithFirebase = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log('Facebook logueado');
            location.assign('wall.html');
            const token = result.provider.accessToken;
            const user = result.user;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch((error) => {
            console.log('error de firebase > ' + error.code);
            console.log('error de firebase, mensaje > ' + error.message);
        });
};

window.googleWithFirebase = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log('Google logueado');
            location.assign('wall.html');
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

const writeNewPost = (uid, body, username) => {
    let postData = {
        uid: uid,
        body: body,
        username: username,
    };

    const newPostKey = firebase.database().ref().child('posts').push().key;

    let updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    firebase.database().ref().update(updates);
    return newPostKey;
};

const createNewPost = () => {
    let userId = firebase.auth().currentUser.uid;
    let userNom = firebase.auth().currentUser.displayName;

    const newPost = writeNewPost(userId, post.value, userNom);
    console.log(post.value);

    let nomUsuario = document.createElement('label');
    nomUsuario.setAttribute('for', '');
    nomUsuario.setAttribute('type', 'label');

    let btnUpdate = document.createElement('input');
    btnUpdate.setAttribute('value', 'Editar');
    btnUpdate.setAttribute('type', 'button');

    let btnDelete = document.createElement('input');
    btnDelete.setAttribute('value', 'Eliminar');
    btnDelete.setAttribute('type', 'button');

    let contPost = document.createElement('div');
    let textPost = document.createElement('textarea');

    textPost.setAttribute('id', newPost);
    textPost.innerHTML = post.value; // esto se actualiza

    nomUsuario.innerHTML = userNom;
     textPost.disabled = true; 

    btnDelete.addEventListener('click', () => {
        let userId = firebase.auth().currentUser.uid;
        firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
        firebase.database().ref().child('posts/' + newPost).remove();

        while (contPost.firstChild) contPost.removeChild(contPost.firstChild);
        alert('El usuario elimino su post');
    });

    btnUpdate.addEventListener('click', () => {
        let userId = firebase.auth().currentUser.uid;
        const newUpdate = document.getElementById(newPost);
        const nuevoPost = writeNewPost(userId, newUpdate.value, userNom);

        textPost.disabled = false;
        btnUpdate.setAttribute('value', 'Guardar'); 
        btnUpdate.addEventListener('click', () => {
                 if(textPost.disabled === true){
                    textPost.disabled = false;
                    btnUpdate.setAttribute('value', 'Guardar');
                 }
            else{
                textPost.disabled = true;
                btnUpdate.setAttribute('value', 'Editar');
            }
        })

        let updatesUser = {};
        let updatesPost = {};

        updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
        updatesPost['/posts/' + newPost] = nuevoPost;

        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    });

    contPost.appendChild(nomUsuario);
    contPost.appendChild(textPost);
    contPost.appendChild(btnUpdate);
    contPost.appendChild(btnDelete);
    postArea.appendChild(contPost);
};