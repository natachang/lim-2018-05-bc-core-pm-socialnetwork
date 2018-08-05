const btnLogout = document.getElementById('btn-logout'),
    btnPublicar = document.getElementById('btn-publicar'),
    selectOptionPublicate = document.getElementById('select-option'),
    post = document.getElementById('post'),
    dataBase = document.getElementById('data-base'),
    postPrivate = document.getElementById('publication-profile'),
    postPublic = document.getElementById('publication-home'),
    nomUser = document.getElementById('user-name'),
    imgUser = document.getElementById('user-image'),
    emailUser = document.getElementById('user-email');

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnPublicar.addEventListener('click', () => {
    const contenidoPost = post.value;
    const selectOption = selectOptionPublicate.value;
    const blankSpace = contenidoPost.trim();
    if (contenidoPost.length !== 0 && blankSpace !== '') {
        if (selectOption === 'publico') {
            writeNewPost();
        }
        else if (selectOption === 'privado') {
            writeNewPostPrivate();
        }
    }
    else {
        alert('Escribe un comentario');
    }
});

btnPublicar.addEventListener('click', cleanTextarea);
// const reload_page = () => {
//     window.location.reload();
// };