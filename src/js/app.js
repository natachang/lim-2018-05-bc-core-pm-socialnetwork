// expCorreo = /\w+@[a-z]+\.+[a-z]/;

let database = firebase.database();

window.onload = () => {
    firebase.auth().onAuthStateChanged(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            console.log('user > ', user);
            console.log('existe usuario activo');
            showUserWithFirebase(user);
        } else {
            console.log('no existe usuario activo');
        }
    });
};

//Muestra el usuario activo
const showUserWithFirebase = (user) => {

    let uid = firebase.auth().currentUser.uid;
    let username = firebase.auth().currentUser.displayName;
    let usermail = firebase.auth().currentUser.email;
    let userphoto = firebase.auth().currentUser.photoURL;
    console.log(username);

    if (username === null && userphoto === null) {
        nomUser.innerHTML = 'Usuarix';
        imgUser.setAttribute('src', 'img/user.png');
        emailUser.innerHTML = usermail;
    }
    else {
        nomUser.innerHTML = username;
        imgUser.setAttribute('src', userphoto);
        emailUser.innerHTML = usermail;
    };

    //Para que el post se mantenga en el muro
    // const divt = document.createElement('div');
    // const pintarObj = (obj) => {
    //     console.log(obj)
    //     const postis = Object.keys(obj);
    //     postis.map(item => {
    //         console.log(obj[item].body)
    //         const p = document.createElement('p');
    //         p.innerHTML = obj[item].body;
    //         divt.appendChild(p);
    //     })
    // }

    // var post = firebase.database().ref('/posts').once('value')
    //     .then(function (snapshot) {
    //         pintarObj(snapshot.val())
    //     }).catch(error => {
    //         console.error(`Esto fue un dirty Error ${error}`)
    //     })
    // postArea.appendChild(divt);

};

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

//Creando usuario con email y contraseña
window.registerWithFirebase = (name, email, password, valpassword) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
            const user = firebase.auth().currentUser;
            console.log('usuario creado con exito');
            verificationWithFirebase();
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch(error => {
            //Mostrar error en consola
            if (error.code === 'auth/email-already-in-use') {
                errorEmail.innerText = 'El correo ya esta en uso. Ingrese otro';
            }
            else if (error.code === 'auth/invalid-email') {
                adviceEmailRegister.innerText = 'Por favor, agregue un correo válido';
            }
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        });
};

window.loginWithFirebase = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
            const user = firebase.auth().currentUser;
            console.log('Usuario logeado con exito');
            location.assign('home.html');
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch(error => {
            console.log('Error de firebase > Codigo >' + error.code);
            console.log('Error de firebase > Mensaje >' + error.message);
        })
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
            location.assign('home.html');
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch(error => {
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
        .then(result => {
            console.log('Google logueado');
            const user = result.user;
            const token = result.credential.accessToken;
            console.log(user);
            location.assign('home.html');
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);;
            console.log(error.email);
            console.log(error.credential);
        });
};

//Guardar Datos de Usuario de Login en DB
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
        nombreUser.innerHTML = username;
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

    const deletePost = () => {

        firebase.database().ref().child('/user-posts/' + uid + '/' + newPost).remove();
        firebase.database().ref().child('posts/' + newPost).remove();

        //Hacer el remove al div que tiene info-post y cont-post
        //Aqui solo hace al cont post ya que era un solo div dentro de post area.
        swal({
            title: "Estas seguro?",
            text: "Una vez eliminado el post, no se recuperará!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    while (allPost.firstChild) allPost.removeChild(allPost.firstChild);
                    swal("Eliminaste tu post!", {
                        icon: "success",
                    });
                } else {
                    swal("Tu post no se elimino!");
                }
            });

    };

    const updatePost = () => {
        const newUpdate = document.getElementById(newPost);
        const nuevoPost = writeNewPost(uid, newUpdate.value, username);

        if (textPost.disabled === true) {
            textPost.disabled = false;
            btnUpdate.setAttribute('value', 'Guardar');
        }
        else {
            textPost.disabled = true;
            btnUpdate.setAttribute('value', 'Editar');
        }

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
