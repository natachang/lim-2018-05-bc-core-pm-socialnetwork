window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userInformation(user);
            writeUserData(user.uid, user.displayName, user.email, user.photoURL);
        }
        else {
            console.log('Usuario no logeado');
        }
        console.log('User > ' + JSON.stringify(user));
        callPublicPost(user.uid);
        callPrivatePost(user.uid);
    });
};

//Cerrando Sesion con Firebase
const logoutWithFirebase = () => {
    firebase.auth().signOut()
        .then(() => {
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
        username: username,
        email: email,
        profile_picture: imageUrl
    });
};

//Imprimir Post en Home
const printPublicHome = (newPostPublic) => {
    const postKey = newPostPublic.key;
    let allPost = document.createElement('div');
    allPost.setAttribute('class', 'w3-container w3-card w3-white w3-round w3-margin');

    let infoPost = document.createElement('div');
    infoPost.setAttribute('class', 'col-sm-3');

    let contPost = document.createElement('div');
    contPost.setAttribute('class', 'col-sm-9');

    let divPostOne = document.createElement('div');
    divPostOne.setAttribute('class', 'well');

    let divPostTwo = document.createElement('div');
    divPostTwo.setAttribute('class', 'well');

    let uImage = document.createElement('img');
    uImage.setAttribute('class', 'w3-left w3-circle w3-margin-right');
    uImage.setAttribute('width', '30');
    uImage.setAttribute('src', `${newPostPublic.val().profile_picture}`);

    let uName = document.createElement('h4');
    uName.innerHTML = `${newPostPublic.val().username}`;

    let textPost = document.createElement('textarea');
    textPost.setAttribute('id', postKey);
    textPost.setAttribute('class', 'default');
    textPost.innerHTML = `${newPostPublic.val().body}`;
    textPost.disabled = true;

    let btnLiked = document.createElement('input');
    btnLiked.setAttribute('id', postKey);
    btnLiked.setAttribute('class', 'w3-pink w3-button w3-margin-bottom');
    btnLiked.setAttribute('type', 'button');
    btnLiked.setAttribute('value', 'Me gusta 🧠');

    let countLiked = document.createElement('a');
    countLiked.setAttribute('id', postKey);
    countLiked.setAttribute('class', 'w3-pink w3-button w3-margin-bottom');
    countLiked.innerHTML = `${newPostPublic.val().likeCount}`;

    btnLiked.addEventListener('click', () => {
        let clicks = newPostPublic.val().likeCount + 1;
        countLiked.innerHTML = clicks;

        const statePost = selectOption.value;
        const nuevoPost = {
            uid: `${newPostPublic.val().uid}`,
            username: `${newPostPublic.val().username}`,
            email: `${newPostPublic.val().email}`,
            profile_picture: `${newPostPublic.val().profile_picture}`,
            body: `${newPostPublic.val().body}`,
            state: statePost,
            key: postKey,
            likeCount: clicks,
        };
        let updatesUser = {};
        let updatesPost = {};
        updatesPost[`/posts/${newPostPublic.key}`] = nuevoPost;
        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    });
    publicationHome.appendChild(allPost);
    allPost.appendChild(infoPost);
    allPost.appendChild(contPost);
    infoPost.appendChild(divPostOne);
    contPost.appendChild(divPostTwo);
    divPostOne.appendChild(uImage);
    divPostOne.appendChild(uName);
    divPostTwo.appendChild(textPost);
    divPostTwo.appendChild(btnLiked);
    divPostTwo.appendChild(countLiked);

    if (`${newPostPublic.val().username}` == 'undefined') {
        uName.innerHTML = `${newPostPublic.val().email}`
        uImage.setAttribute('src', 'img/people.png')
    }
    else {
        uName.innerHTML = `${newPostPublic.val().username}`
        image.setAttribute('src', `${newPostPublic.val().profile_picture}`)
    }
};

//Imprimir Post en Profile
const printPrivateProfile = (newPostPrivate) => {
    const postKey = newPostPrivate.key;
    let allPost = document.createElement('div');
    allPost.setAttribute('class', 'w3-container w3-card w3-white w3-round w3-margin');

    let infoPost = document.createElement('div');
    infoPost.setAttribute('class', 'col-sm-3');

    let contPost = document.createElement('div');
    contPost.setAttribute('class', 'col-sm-9');

    let divPostOne = document.createElement('div');
    divPostOne.setAttribute('class', 'well');

    let divPostTwo = document.createElement('div');
    divPostTwo.setAttribute('class', 'well');

    let uImage = document.createElement('img');
    uImage.setAttribute('class', 'w3-left w3-circle w3-margin-right');
    uImage.setAttribute('width', '30');
    uImage.setAttribute('src', `${newPostPrivate.val().profile_picture}`);

    let uName = document.createElement('h4');
    uName.innerHTML = `${newPostPrivate.val().username}`;

    let textPost = document.createElement('textarea');
    textPost.setAttribute('id', postKey);
    textPost.setAttribute('class', 'default');
    textPost.innerHTML = `${newPostPrivate.val().body}`;
    textPost.disabled = true;

    let btnDelete = document.createElement('input');
    btnDelete.setAttribute('id', postKey);
    btnDelete.setAttribute('class', 'w3-blue w3-button  w3-margin-bottom w3-right');
    btnDelete.setAttribute('value', 'Eliminar');
    btnDelete.setAttribute('type', 'button');
    btnDelete.setAttribute('style', 'margin: 10px');

    let btnEdit = document.createElement('input');
    btnEdit.setAttribute('id', postKey);
    btnEdit.setAttribute('class', 'w3-blue w3-button  w3-margin-bottom w3-right');
    btnEdit.setAttribute('value', 'Editar');
    btnEdit.setAttribute('type', 'button');
    btnEdit.setAttribute('style', 'margin: 10px');

    btnDelete.addEventListener('click', () => {
        firebase.database().ref().child(`/posts/${newPostPrivate.key}`).remove();
        firebase.database().ref().child(`/user-posts/${newPostPrivate.val().uid}/${newPostPrivate.key}`).remove();
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
                    })
                        .then((reloadPage) => {
                            if (reloadPage) {
                                window.location.reload(true);
                            }
                        });
                }
                else {
                    swal("Tu post no se elimino!");
                }
            })
    });

    btnEdit.addEventListener('click', (e) => {
        textPost.disabled = false;
        btnEdit.style.display = 'none';
        const btnSave = document.createElement('input');
        btnSave.setAttribute('value', 'Guardar');
        btnSave.setAttribute('type', 'button');
        btnSave.setAttribute('class', 'w3-blue w3-button  w3-margin-bottom');
        btnSave.setAttribute('id', newPostPrivate.key);
        btnSave.setAttribute('style', 'margin: 10px');

        btnSave.addEventListener('click', (e) => {
            if (newPostPrivate.key === e.target.id) {
                const userPost = firebase.auth().currentUser;
                const statePost = selectOption.value;
                const newUpdatePost = textPost.value;
                const nuevoPost = {
                    uid: userPost.uid,
                    username: userPost.displayName,
                    email: userPost.email,
                    profile_picture: userPost.photoURL,
                    body: newUpdatePost,
                    state: statePost,
                    key: newPostPrivate.key,
                    likeCount: 0
                };

                let updatesUser = {};
                let updatesPost = {};
                if (statePost === 'public') {
                    updatesUser[`/user-posts/${newPostPrivate.val().uid}/${newPostPrivate.key}`] = nuevoPost;
                    updatesPost[`/posts/${newPostPrivate.key}`] = nuevoPost;
                    firebase.database().ref().update(updatesPost);
                }
                else if (statePost === 'private') {
                    updatesUser[`/user-posts/${newPostPrivate.val().uid}/${newPostPrivate.key}`] = nuevoPost;
                    firebase.database().ref().update(updatesUser);
                }
                return firebase.database().ref().update(updatesUser),
                    reloadPage();
            }
            btnSave.style.display = 'none';
            textPost.disabled = false;
        });
        divPostTwo.appendChild(btnSave);
    });
    publicationProfile.appendChild(allPost);
    allPost.appendChild(infoPost);
    allPost.appendChild(contPost);
    infoPost.appendChild(divPostOne);
    contPost.appendChild(divPostTwo);
    divPostOne.appendChild(uImage);
    divPostOne.appendChild(uName);
    divPostTwo.appendChild(textPost);
    divPostTwo.appendChild(btnEdit);
    divPostTwo.appendChild(btnDelete);

    if (`${newPostPrivate.val().username}` === 'undefined') {
        uName.innerHTML = `${newPostPrivate.val().email}`;
        uImage.setAttribute('src', 'img/people.png');
      }
    
      else {
        uName.innerHTML = `${newPostPrivate.val().username}`;
        uImage.setAttribute('src', `${newPostPrivate.val().profile_picture}`);
      }
};

window.callPublicPost = (uid) => {
    const userPostPublic = firebase.database().ref('posts');
    userPostPublic.on("child_added", newPostPublic => {
        printPublicHome(newPostPublic);
    });
};

window.callPrivatePost = (uid) => {
    const userPostPrivate = firebase.database().ref('user-posts').child(uid);
    userPostPrivate.on("child_added", newPostPrivate => {
        printPrivateProfile(newPostPrivate);
    });
};

const writePost = () => {
    const userPost = firebase.auth().currentUser;
    const contenidoPost = postContainer.value;
    const statePost = selectOption.value;
    const newPostKey = firebase.database().ref().child('posts').push().key;

    let postData = {
        uid: userPost.uid,
        username: userPost.displayName,
        email: userPost.email,
        profile_picture: userPost.photoURL,
        body: contenidoPost,
        state: statePost,
        likeCount: 0
    };

    let updates = {};
    if (statePost === 'public') {
        updates['/user-posts/' + userPost.uid + '/' + newPostKey] = postData;
        updates['/posts/' + newPostKey] = postData;
    }
    else if (statePost === 'private') {
        updates['/user-posts/' + userPost.uid + '/' + newPostKey] = postData;
    }
    return firebase.database().ref().update(updates);
};