window.onload = () => {
    initApp();
};

const initApp = () => {
    firebase.auth().onAuthStateChanged(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            console.log('user > ', user);
            console.log('existe usuario activo');
            showUserWithFirebase(user);
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        } else {
            console.log('no existe usuario activo');
        }
    });
};

//Muestra el usuario activo
const showUserWithFirebase = (user) => {
    let username = user.displayName;
    let usermail = user.email;
    let userphoto = user.photoURL;
    console.log(username);

    // nomUser.innerHTML = username;
    // imgUser.setAttribute('src', userphoto);
    // emailUser.innerHTML = usermail;

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
            verificationWithFirebase();
            // Hasta aqui sale el usuario registrado sin ningun error
            result.updateProfile({ displayName: nameReg.value });
            // document.getElementById('name-register')

            writeUserData(result.uid, result.displayName, result.email, result.photoURL);
            console.log('usuario creado con exito');
        
            firebase.database().ref().child('users/' + writeUserData[result.uid]).push({
                id: writeUserData[uid],
                displayName: writeUserData[displayName],
                email: writeUserData[email]
            });

            // location.assign('index.html');
        })
        .catch(error => {
            //Mostrar error en consola
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
    allPost.setAttribute('class', 'w3-container w3-card w3-white w3-round w3-margin');

    let infoPost = document.createElement('div'); //Div que guarda img y nombre
    infoPost.setAttribute('class', 'col-sm-3');

    let contPost = document.createElement('div'); //Div que guarda a publicacion
    contPost.setAttribute('class', 'col-sm-9');

    let divPostOne = document.createElement('div');
    divPostOne.setAttribute('class', 'well');

    let divPostTwo = document.createElement('div');
    divPostTwo.setAttribute('class', 'well');

    let imageUser = document.createElement('img'); //Etiqueta img
    imageUser.setAttribute('class', 'w3-left w3-circle w3-margin-right');
    imageUser.setAttribute('width', '30');
    imageUser.setAttribute('src', userphoto);

    let nombreUser = document.createElement('h4'); //Label de nombre
    nombreUser.setAttribute('id', 'nombreUser');

    let textPost = document.createElement('textarea'); // txt area de contPost
    textPost.setAttribute('id', newPost); //Dar el valor al ID de textPost

    let btnUpdate = document.createElement('input'); //Boton dentro de contPost
    btnUpdate.setAttribute('value', 'Editar');
    btnUpdate.setAttribute('type', 'button');
    btnUpdate.setAttribute('class', 'w3-button w3-theme-d1 w3-margin-bottom');

    let btnDelete = document.createElement('input'); //Boton dentro de contPost
    btnDelete.setAttribute('value', 'Eliminar');
    btnDelete.setAttribute('type', 'button');
    btnDelete.setAttribute('class', 'w3-button w3-theme-d2 w3-margin-bottom');

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
    divPostOne.appendChild(imageUser);
    divPostOne.appendChild(nombreUser);
    divPostTwo.appendChild(textPost); //Antes contenia a ContPost
    divPostTwo.appendChild(btnUpdate);
    divPostTwo.appendChild(btnDelete);
};
