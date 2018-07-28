const btnLogout = document.getElementById('btn-logout'),
    userName = document.getElementById('user-name'),
    userImage = document.getElementById('user-image'),
    btnPublicar = document.getElementById('btn-publicar'),
    post = document.getElementById('post'),
    dataBase = document.getElementById('data-base'),
    postArea = document.getElementById('posts-area');

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnPublicar.addEventListener('click', () => {

    let userId = firebase.auth().currentUser.uid;
    let userNom = firebase.auth().currentUser.displayName;

    const newPost = writeNewPost(userId, post.value, userNom);
    console.log(post.value);

    let nomUsuario = document.createElement('label');
    nomUsuario.setAttribute('for', '');
    nomUsuario.setAttribute('type', 'label');

    let btnUpdate = document.createElement('input');
    btnUpdate.setAttribute('value', 'Update');
    btnUpdate.setAttribute('type', 'button');

    let btnDelete = document.createElement('input');
    btnDelete.setAttribute('value', 'Delete');
    btnDelete.setAttribute('type', 'button');

    let contPost = document.createElement('div');
    let textPost = document.createElement('textarea');

    textPost.setAttribute('id', newPost);
    textPost.innerHTML = post.value; // esto se actualiza

    nomUsuario.innerHTML = userNom + '  Publicacion';
    textPost.disabled = true;

    btnDelete.addEventListener('click', () => {
        firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
        firebase.database().ref().child('posts/' + newPost).remove();

        while (contPost.firstChild) contPost.removeChild(contPost.firstChild);
        alert('El usuario elimino su post');
    });

    btnUpdate.addEventListener('click', () => {
        const newUpdate = document.getElementById(newPost);
        const nuevoPost = {
            body: newUpdate.value,
        };

        textPost.disabled = false;
        btnUpdate.setAttribute('value', 'Guardar');

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

});

const reload_page = () => {
    window.location.reload();
};