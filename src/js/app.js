expCorreo = /\w+@[a-z]+\.+[a-z]/;

window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('existe usuario activo');

            let uid = user.uid;
            let userNom = firebase.auth().currentUser.displayName;;
            let email = user.email;
            let emailVerified = user.emailVerified;
            let userPhoto = user.photoURL;
            // let isAnonymous = user.isAnonymous;
            // let providerData = user.providerData;

            userName.innerHTML = userNom + '<br>';
            userEmail.innerHTML = email + '<br>' + emailVerified;

            if (userPhoto != null) {
                userImage.setAttribute('src', userPhoto);
            }
            else {
                userImage.setAttribute('src', 'img/user.png');
            };

        } else {
            // User is signed out.
            console.log('no existe usuario activo');
        }
        console.log('user > ', user);
    });
};

//Guardar Datos de Usuario de Login
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
                const user = firebase.auth().currentUser;
                console.log('usuario creado con exito');
                writeUserData(user.uid, user.displayName, user.email, user.photoURL);
                // if (user.displayName === null) {
                //     userName = nameReg.value
                // }
                // else {
                //     userName = user.displayName;
                // }
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

// //Cambio de Contraseña
// const resetPassword = (email) => {
//     firebase.auth().sendPasswordResetEmail(email)
//         .then(() => {
//         })
//         .catch((error) => {
//         })
// };

//Escribir nuevo Post
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

//Crear nuevo Post
const createNewPost = () => {
    let userId = firebase.auth().currentUser.uid;
    let userNom = firebase.auth().currentUser.displayName;
    // let userPhoto = firebase.auth().currentUser.photoURL;

    const newPost = writeNewPost(userId, post.value, userNom);
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

    let nameUser = document.createElement('label'); //Label de nombre

    // let imgUser = document.createElement('img'); //Etiqueta img

    let textPost = document.createElement('textarea'); // txt area de contPost
    textPost.setAttribute('id', newPost); //Dar el valor al ID de textPost

    let btnUpdate = document.createElement('input'); //Boton dentro de contPost
    btnUpdate.setAttribute('value', 'Editar');
    btnUpdate.setAttribute('type', 'button');

    let btnDelete = document.createElement('input'); //Boton dentro de contPost
    btnDelete.setAttribute('value', 'Eliminar');
    btnDelete.setAttribute('type', 'button');

    nameUser.innerHTML = userNom; //Nombre usuario del post
    // imgUser.innerHTML = userPhoto; //Imagen usuario del post
    textPost.innerHTML = post.value; //Contenido del post
    textPost.disabled = true;

    const deletePost = () => {
        let userId = firebase.auth().currentUser.uid;

        firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
        firebase.database().ref().child('posts/' + newPost).remove();

        //Hacer el remove al div que tiene info-post y cont-post
        //Aqui solo hace al cont post ya que era un solo div dentro de post area
        while (allPost.firstChild) allPost.removeChild(allPost.firstChild);
        alert('El usuario elimino su post');
    };

    const updatePost = () => {
        let userId = firebase.auth().currentUser.uid;
        const newUpdate = document.getElementById(newPost);

        const nuevoPost = writeNewPost(userId, newUpdate.value, userNom);
        // const nuevoPost = {
        //     uid: uid,
        //     username: username,
        //     body: newUpdate.value,
        // };

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


        let updatesUser = {};
        let updatesPost = {};

        updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
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
    divPostOne.appendChild(nameUser);
    // divPostOne.appendChild(imgUser);
    divPostTwo.appendChild(textPost); //Antes contenia a ContPost
    divPostTwo.appendChild(btnUpdate);
    divPostTwo.appendChild(btnDelete);
};
