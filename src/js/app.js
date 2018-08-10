window.onload = () => {
    initApp();
};

const initApp = () => {
    firebase.auth().onAuthStateChanged(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            console.log('user > ', user);
            console.log('existe usuario activo');

            if (user.displayName !== 'null') {
                pUser.innerHTML = `${user.displayName}`;
                pImage.innerHTML = `<img src="${user.photoURL}" class="w3-circle" style="height:80px;width:80px"/>`;
                pEmail.innerHTML = `${user.email}`;
            }

            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
            //Funcion que pinta los post en el muro
            callPostFirebase(user.uid);

        } else {
            console.log('no existe usuario activo');
        }
    });
};

// firebase.database().ref('user-posts').remove();

//Iniciando Sesion con Firebase
const loginWithFirebase = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(result => {
            const user = firebase.auth().currentUser;
            console.log('Usuario logeado con exito');
            location.assign('profile.html');
        })
        .catch(error => {
            console.log('Error de firebase > Codigo >' + error.code);
            console.log('Error de firebase > Mensaje >' + error.message);
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
            location.assign('profile.html');
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
            console.log(user);
            location.assign('profile.html');
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

//Creando usuario con email y contraseña
const registerWithFirebase = (name, email, password, valpassword) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
            verificationWithFirebase();
            // Hasta aqui sale el usuario registrado sin ningun error
            result.updateProfile({ displayName: nameReg.value });

            writeUserData(result.uid, result.displayName, result.email, result.photoURL);
            console.log('usuario creado con exito');

            firebase.database().ref().child('users/' + writeUserData.uid).push({
                id: writeUserData.uid,
                displayName: writeUserData.displayName,
                email: writeUserData.email
            });

            // location.assign('index.html');
        })
        .catch(error => {
            //Mostrar error en consola
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        });
};
//Cerrando Sesion con Firebase
const logoutWithFirebase = () => {
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

//Guardar Datos de Usuario de Login en DB
const writeUserData = (uid, username, email, imageUrl) => {
    firebase.database().ref('users/' + uid).set({
        uid: uid,
        username: username,
        email: email,
        profile_picture: imageUrl
    })
};

//Escribir nuevo Post Publico
const writeNewPost = () => {
    const usuario = firebase.auth().currentUser;
    //Area de Post
    const statePost = selectOption.value;
    const contenidoPost = postContainer.value;
    const newPostKey = firebase.database().ref().child('posts').push().key;

    let postData = {
        uid: usuario.uid,
        username: usuario.displayName,
        email: usuario.email,
        profile_picture: usuario.photoURL,
        body: contenidoPost,
        state: statePost,
        key: newPostKey,
        startCount: 0
    };

    let updates = {};

    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + usuario.uid + '/' + newPostKey] = postData;
    return firebase.database().ref().update(updates);
};

//Escribir nuevo Post Privado
const writeNewPostPrivate = () => {
    const usuario = firebase.auth().currentUser;
    //Area de Post
    const statePost = selectOption.value;
    const contenidoPost = postContainer.value;
    const newPostKey = firebase.database().ref().child('posts').push().key;

    let postData = {
        uid: usuario.uid,
        username: usuario.displayName,
        email: usuario.email,
        profile_picture: usuario.photoURL,
        body: contenidoPost,
        state: statePost,
        key: newPostKey,
        startCount: 0
    };

    let updates = {};

    updates['/user-posts/' + usuario.uid + '/' + newPostKey] = postData;
    return firebase.database().ref().update(updates);
}

//Llamando a Firebase con los Posts
const callPostFirebase = (uid) => {
    const userPost = firebase.database().ref('user-posts').child(uid);
    userPost.on("child_added", newUserPosts => {
        //Posts solo usuario - Profile
        userPostProfile(newUserPosts);
    });

    const allPost = firebase.database().ref('posts');
    allPost.on("child_added", newPosts => {
        //Posts todos los usuarios - Home
        allPostsHome(newPosts);
    });
};

//Mostrando Post en Home
const allPostsHome = (newPosts) => {

    //Si no me sale es porque el newPost es postsKey igual que abajo
    const postKey = newPosts.key;

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

    let uImage = document.createElement('img'); //Etiqueta img
    uImage.setAttribute('class', 'w3-left w3-circle w3-margin-right');
    uImage.setAttribute('width', '30');

    let uName = document.createElement('h4'); //Label de nombre

    let textPost = document.createElement('textarea'); // txt area de contPost
    textPost.setAttribute('id', postKey); //Dar el valor al ID de textPost
    textPost.innerHTML = `${newPosts.val().body}`; //Contenido del post
    textPost.disabled = true;

    //Si no me sale es porque el newPost es postsKey igual que arriba
    let btnLiked = document.createElement('input');
    btnLiked.setAttribute('id', postKey);
    btnLiked.setAttribute('class', 'w3-pink w3-button w3-margin-bottom');
    btnLiked.setAttribute('type', 'button');
    btnLiked.setAttribute('value', 'Me gusta');

    //Igual que arriba
    let countLiked = document.createElement('a');
    countLiked.setAttribute('id', postKey);
    countLiked.setAttribute('class', 'w3-pink w3-button w3-margin-bottom');
    countLiked.innerHTML = `${newPosts.val().startCount}`;

    let countClick = parseInt(`${newPosts.val().startCount}`);

    const countLikePost = () => {
        countClick += 1;
        countLiked.innerHTML = countClick;

        const newUpdate = textPost.innerText;
        const statePost = selectOption.value;
        const valuePost = newUpdate;
        const nuevoPost = {
            uid: `${newPosts.val().uid}`,
            username: `${newPosts.val().username}`,
            email: `${newPosts.val().email}`,
            profile_picture: `${newPosts.val().profile_picture}`,
            body: valuePost,
            state: statePost,
            key: postKey,
            startCount: countClick,
        };

        let updatesUser = {};
        let updatesPost = {};

        updatesPost[`/posts/${newPosts.key}`] = nuevoPost;
        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    };

    btnLiked.addEventListener('click', () => {
        countLikePost();
    });

    if (`${newPosts.val().username}` === 'undefined') {
        uName.innerHTML = `${newPosts.val().email}`;
        uImage.setAttribute('src', 'img/user.png');
    }
    else {
        uName.innerHTML = `${newPosts.val().username}`;
        uImage.setAttribute('src', `${newPosts.val().profile_picture}`);
    }

    //Aqui va los appendchild
    publicationHome.appendChild(allPost);
    allPost.appendChild(infoPost);
    allPost.appendChild(contPost);
    infoPost.appendChild(divPostOne);
    contPost.appendChild(divPostTwo);
    divPostOne.appendChild(uImage);
    divPostOne.appendChild(uName);
    divPostTwo.appendChild(textPost); //Antes contenia a ContPost
    divPostTwo.appendChild(btnLiked);
    divPostTwo.appendChild(countLiked);
};

//Mostrando Post en Profile
const userPostProfile = (newUserPosts) => {
    // id post privado
    const postKey = newUserPosts.key;

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

    let uImage = document.createElement('img'); //Etiqueta img
    uImage.setAttribute('class', 'w3-left w3-circle w3-margin-right');
    uImage.setAttribute('width', '30');

    let uName = document.createElement('h4'); //Label de nombre

    let textPost = document.createElement('textarea'); // txt area de contPost
    textPost.setAttribute('id', postKey); //Dar el valor al ID de textPost
    textPost.innerHTML = `${newUserPosts.val().body}`; //Contenido del post
    textPost.disabled = true;


    let btnUpdate = document.createElement('input'); //Boton dentro de contPost
    btnUpdate.setAttribute('id', postKey);
    btnUpdate.setAttribute('class', 'w3-blue w3-button  w3-margin-bottom');
    btnUpdate.setAttribute('value', 'Editar');
    btnUpdate.setAttribute('type', 'button');
    btnUpdate.setAttribute('style', 'margin: 15px');

    let btnDelete = document.createElement('input'); //Boton dentro de contPost
    btnDelete.setAttribute('id', postKey);
    btnDelete.setAttribute('class', 'w3-blue w3-button w3-margin-bottom');
    btnDelete.setAttribute('value', 'Eliminar');
    btnDelete.setAttribute('type', 'button');
    btnDelete.setAttribute('style', 'margin: 15px');

    const deletePost = () => {
        firebase.database().ref().child(`/posts/${newUserPosts.key}`).remove();
        firebase.database().ref().child(`/user-posts/${newUserPosts.val().uid}/${newUserPosts.key}`).remove();

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

    btnDelete.addEventListener('click', () => {
        deletePost();
    });

    const updatePost = () => {
        const usuario = firebase.auth().currentUser;
        const statePost = selectOption.value;
        const newUpdate = textPost.value;
        const nuevoPost = {
            uid: usuario.uid,
            username: usuario.displayName,
            email: usuario.email,
            profile_picture: usuario.photoURL,
            body: newUpdate,
            state: statePost,
            key: postKey,
            startCount: 0
        };

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
        updatesUser[`/user-posts/${newUserPosts.val().uid}/${newUserPosts.key}`] = nuevoPost;

        if(nuevoPost.state == 'public') {
            updatesPost[`/posts/${newUserPosts.key}`] = nuevoPost;
        }   


        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    };


    btnUpdate.addEventListener('click', () => {
        updatePost();
    });

    if (`${newUserPosts.val().username}` === 'undefined') {
        uName.innerHTML = `${newUserPosts.val().email}`;
        uImage.setAttribute('src', 'img/user.png');
    }
    else {
        uName.innerHTML = `${newUserPosts.val().username}`;
        uImage.setAttribute('src', `${newUserPosts.val().profile_picture}`);
    }

    //Aqui va los appendchild
    publicationProfile.appendChild(allPost); // Post area principal div que tendra a 2 divs dentro.
    allPost.appendChild(infoPost);
    allPost.appendChild(contPost);
    infoPost.appendChild(divPostOne);
    contPost.appendChild(divPostTwo);
    divPostOne.appendChild(uImage);
    divPostOne.appendChild(uName);
    divPostTwo.appendChild(textPost); //Antes contenia a ContPost
    divPostTwo.appendChild(btnUpdate);
    divPostTwo.appendChild(btnDelete);
};

const cleanTextarea = () => {
    postContainer.value = '';
};

const reloadPage = () => {
    window.location.reload();
};
