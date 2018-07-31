expCorreo = /\w+@[a-z]+\.+[a-z]/;

let database = firebase.database();

window.onload = () => {
    firebase.auth().onAuthStateChanged(() => {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            console.log('user > ', user);
            console.log('existe usuario activo');
            showUserWithFirebase();
        } else {
            console.log('no existe usuario activo');
        }
    });
};

const showUserWithFirebase = () => {
    const user = firebase.auth().currentUser;
    let uid = firebase.auth().currentUser.uid;
    let username = firebase.auth().currentUser.displayName;
    let usermail = firebase.auth().currentUser.email;
    let userphoto = firebase.auth().currentUser.photoURL;

    console.log(username);

    // if (username !== null && userphoto !== null) {
    //     nomUser.innerHTML = username;
    //     imgUser.setAttribute('src', userphoto);
    // }
    // else {
    //     nomUser.innerHTML = usermail;
    //     imgUser.setAttribute('src', 'img/user.png');
    // };

    writeUserData(user.uid, user.displayName, user.email, user.photoURL);
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
        .then((result) => {
            verificationWithFirebase();
            const user = result.user;
            console.log('usuario creado con exito');

            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                errorEmail.innerText = 'El correo ya esta en uso. Ingrese otro';
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
        .then((result) => {
            const user = result.user;
            console.log('Usuario logeado con exito');
            location.assign('wall.html');

            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })

        .catch((error) => {
            if (error.code === 'auth/wrong-password') {
                errorAdvice.innerText = 'Su contraseña es incorrecta';
            }
            else if (error.code === 'auth/user-not-found') {
                errorEmail.innerText = 'No existe un usuario con este correo';
            };
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
    provider.addScope('email');
    provider.addScope('user_friends');
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            var user = result.user;
            var credential = result.credential;
            var operationType = result.operationType;
            console.log('Facebook logueado');
            location.assign('wall.html');
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
    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log('Google logueado');
            console.log(result);
            var token = result.credential.accessToken;
            const user = result.user;
            console.log(user);
            location.assign('wall.html');
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);;
            console.log(error.email);
            console.log(error.credential);
        });
};

// //Cambio de Contraseña
// const resetPassword = (email) => {
//     firebase.auth().sendPasswordResetEmail(email)
//         .then(() => {
//         })
//         .catch((error) => {
//         })
// };

//Guardar Datos de Usuario de Login
const writeUserData = (uid, username, email, imageUrl) => {
    firebase.database().ref('users/' + uid).set({
        uid: uid,
        username: username,
        email: email,
        profile_picture: imageUrl
    })
};

//Escribir nuevo Post
const writeNewPost = (uid, body, username) => {

    let postData = {
        uid: uid,
        body: body,
        username: username,
        // startCount: 0,
    };

    const newPostKey = firebase.database().ref().child('posts').push().key;

    let updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    firebase.database().ref().update(updates);
    return newPostKey;
    console.log(newPostKey);
};

//Crear nuevo Post
const createNewPost = () => {
    let uid = firebase.auth().currentUser.uid;
    let username = firebase.auth().currentUser.displayName;
    let usermail = firebase.auth().currentUser.email;
    let userphoto = firebase.auth().currentUser.photoURL;

    const newPost = writeNewPost(uid, post.value, username);
    console.log(post.value);

    let allPost = document.createElement('div'); //Div principal que ira dentro de postarea
    allPost.setAttribute('class', 'row');

    let infoPost = document.createElement('div'); //Div que guarda img y nombre
    infoPost.setAttribute('class', 'col-sm-3');

    let contPost = document.createElement('div'); //Div que guarda a publicacion
    contPost.setAttribute('class', 'col-sm-9');

    let divPostOne = document.createElement('div');
    divPostOne.setAttribute('class', 'well');

    let divPostTwo = document.createElement('div');
    divPostTwo.setAttribute('class', 'well');

    let nombreUser = document.createElement('p'); //Label de nombre
    nombreUser.setAttribute('id', 'nombreUser');

    let imageUser = document.createElement('img'); //Etiqueta img
    imageUser.setAttribute('class', 'img-circle');
    imageUser.setAttribute('height', '35');
    imageUser.setAttribute('width', '35');
    imageUser.setAttribute('src', userphoto);

    let textPost = document.createElement('textarea'); // txt area de contPost
    textPost.setAttribute('id', newPost); //Dar el valor al ID de textPost

    let btnUpdate = document.createElement('input'); //Boton dentro de contPost
    btnUpdate.setAttribute('value', 'Editar');
    btnUpdate.setAttribute('type', 'button');

    let btnDelete = document.createElement('input'); //Boton dentro de contPost
    btnDelete.setAttribute('value', 'Eliminar');
    btnDelete.setAttribute('type', 'button');

    console.log(nombreUser);
    
    if (username !== null && userphoto !== null) {
        nombreUser.innerHTML= username;
        imageUser.setAttribute('src', userphoto);
    }
    else {
        nombreUser.innerHTML = usermail;
        imageUser.setAttribute('src', 'img/user.png');
    }

    nombreUser.innerHTML = username; //Nombre usuario del post
    console.log(imageUser);

    textPost.innerHTML = post.value; //Contenido del post
    textPost.disabled = true;


 firebase.database().ref().child('posts')
.on('value', function(snapshot) {

    //createNewPost();
}); 

    const deletePost = () => {

        firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
        firebase.database().ref().child('posts/' + newPost).remove();

        //Hacer el remove al div que tiene info-post y cont-post
        //Aqui solo hace al cont post ya que era un solo div dentro de post area
        while (allPost.firstChild) allPost.removeChild(allPost.firstChild);
        alert('El usuario elimino su post');
    };

    const updatePost = () => {
        const newUpdate = document.getElementById(newPost);
<<<<<<< HEAD
        const nuevoPost = writeNewPost(userId, newUpdate.value, userNom);
        
        textPost.disabled = false;
        btnUpdate.setAttribute('value', 'Guardar');

        btnUpdate.addEventListener('click', () => {
            if (textPost.disabled === true) {
                textPost.disabled = false;
                btnUpdate.setAttribute('value', 'Guardar');
            }
            else {
                textPost.disabled = true;
                btnUpdate.setAttribute('value', 'Editar');
            }
        })

=======
        const nuevoPost = writeNewPost(uid, newUpdate.value, username);

        if (textPost.disabled === true) {
            textPost.disabled = false;
            btnUpdate.setAttribute('value', 'Guardar');
        }
        else {
            textPost.disabled = true;
            btnUpdate.setAttribute('value', 'Editar');
        }
>>>>>>> 741a1f1a7e41fab9da41a217f70bb0ab384d3c3c

        let updatesUser = {};
        let updatesPost = {};
        updatesUser['/user-posts/' + uid + '/' + newPost] = nuevoPost;
        updatesPost['/posts/' + newPost] = nuevoPost;

        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    };

    btnDelete.addEventListener('click', () => {
        deletePost();
    });

    btnUpdate.addEventListener('click', () => {
        updatePost();
    });

    //Aqui va los appendchild
    postArea.appendChild(allPost); // Post area principal div que tendra a 2 divs dentro.
    allPost.appendChild(infoPost);
    allPost.appendChild(contPost);
    infoPost.appendChild(divPostOne);
    contPost.appendChild(divPostTwo);
    divPostOne.appendChild(nombreUser);
    divPostOne.appendChild(imageUser);
    divPostTwo.appendChild(textPost); //Antes contenia a ContPost
    divPostTwo.appendChild(btnUpdate);
    divPostTwo.appendChild(btnDelete);
};