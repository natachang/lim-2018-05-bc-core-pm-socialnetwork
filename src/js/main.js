const btnRegister = document.getElementById('btn-register'),
    btnLogin = document.getElementById('btn-login'),
    btnLogout = document.getElementById('btn-logout'),
    btnFacebook = document.getElementById('btn-facebook'),
    btnGoogle = document.getElementById('btn-google');

const nameReg = document.getElementById('name-register'),
    emailReg = document.getElementById('email-register'),
    passwordReg = document.getElementById('password-register');

const emailLog = document.getElementById('email-login'),
    passwordLog = document.getElementById('password-login');

const mainLogin = document.getElementById('main-login'),
    mainWall = document.getElementById('main-wall'),
    userName = document.getElementById('user-name'),
    userImage = document.getElementById('user-image'),
    btnPublicar = document.getElementById('btn-publicar'),
    post = document.getElementById('post'),
    dataBase = document.getElementById('data-base'),
    postArea = document.getElementById('posts-area');


btnRegister.addEventListener('click', () => {
    registerWithFirebase();
    alert('El email de validacion se ha enviado a tu correo.');
});

btnLogin.addEventListener('click', () => {
    loginWithFirebase();
});

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnFacebook.addEventListener('click', () => {
    facebookWithFirebase();
});

btnGoogle.addEventListener('click', () => {
    googleWithFirebase();
});

btnPublicar.addEventListener('click', () => {

    let userId = firebase.auth().currentUser.uid;
    let userNom = firebase.auth().currentUser.displayName;

    const newPost = writeNewPost(userId, post.value, userNom);

    console.log(post.value);

    var nomUsuario = document.createElement("label");
    nomUsuario.setAttribute("for", "");
    nomUsuario.setAttribute("type", "label");

    var btnUpdate = document.createElement("input");
    btnUpdate.setAttribute("value", "Update");
    btnUpdate.setAttribute("type", "button");

    var btnDelete = document.createElement("input");
    btnDelete.setAttribute("value", "Delete");
    btnDelete.setAttribute("type", "button");

    var contPost = document.createElement('div');

    var textPost = document.createElement('textarea');

    textPost.setAttribute("id", newPost);

    textPost.innerHTML = post.value; // esto se actualiza

    nomUsuario.innerHTML = userNom + "  publicacion";
    textPost.disabled = true;

    btnDelete.addEventListener('click', () => {
        firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
        firebase.database().ref().child('posts/' + newPost).remove();

        while (contPost.firstChild) contPost.removeChild(contPost.firstChild);
        alert ('El usuario elimino su post');
    });

    btnUpdate.addEventListener('click', () => {
        const newUpdate = document.getElementById(newPost);

        const nuevoPost = {
            body: newUpdate.value,
        };

        textPost.disabled = false;
        btnUpdate.setAttribute("value", "Guardar");

        var updatesUser = {};
        var updatesPost = {};

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

});

const reload_page =() => {
    window.location.reload();
};



