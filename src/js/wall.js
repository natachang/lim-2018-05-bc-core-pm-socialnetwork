const btnLogout = document.getElementById('btn-logout'),
    btnPublicar = document.getElementById('btn-publicar'),
    post = document.getElementById('post'),
    dataBase = document.getElementById('data-base'),
    postArea = document.getElementById('posts-area'),
    userName = document.getElementById('user-name'),
    userImage = document.getElementById('user-image'),
    userEmail = document.getElementById('user-email');

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnPublicar.addEventListener('click', () => {
<<<<<<< HEAD
    createNewPost ();
=======
    createNewPost();
>>>>>>> ea40a280716f30e16dcc2d8e7304c31b012e18d2
});

const reload_page = () => {
    window.location.reload();
};

