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
    createNewPost();
});

const reload_page = () => {
    window.location.reload();
};