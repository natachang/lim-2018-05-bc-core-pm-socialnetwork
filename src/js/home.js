const btnLogout = document.getElementById('btn-logout'),
    btnPublicar = document.getElementById('btn-publicar'),
    post = document.getElementById('post'),
    dataBase = document.getElementById('data-base'),
    postArea = document.getElementById('posts-area'),
    nomUser = document.getElementById('user-name'),
    imgUser = document.getElementById('user-image'),
    emailUser = document.getElementById('user-email');

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnPublicar.addEventListener('click', () => {
    createNewPost ();
});

const reload_page = () => {
    window.location.reload();
};

