const btnLogout = document.getElementById('btn-logout'),
    btnPublicar = document.getElementById('btn-publicar'),
    post = document.getElementById('post'),//text area donde publica
    dataBase = document.getElementById('data-base'),//div que guarda todo
    pUser = document.getElementById('user-name'),
    pImage = document.getElementById('user-image'),
    pEmail = document.getElementById('user-email'),
    selectOption = document.getElementById('select-option'),
    postPrivate = document.getElementById('publication-profile');
;

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnPublicar.addEventListener('click', () => {
    const contenidoPost = post.value;
    const selectOptionPublicate = selectOption.value;
    const blankSpace = contenidoPost.trim();
    if (contenidoPost.length !== 0 && blankSpace !== '') {
        if (selectOptionPublicate === 'publico') {
            writeNewPost();
            cleanTextarea();
        }
        else if (selectOptionPublicate === 'privado') {
            writeNewPostPrivate();
            cleanTextarea();
        }
    }
    else {
        alert('Escribe un comentario');
    }
});

// const reload_page = () => {
//     window.location.reload();
// };