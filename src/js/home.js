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
    if (post.value.length !== 0) {
        createNewPost();
    }
    else {
        alert('Escribe un comentario');
    }
});

btnPublicar.addEventListener('click', cleanTextarea);




 




// const reload_page = () => {
//     window.location.reload();
// };