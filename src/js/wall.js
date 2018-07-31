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
<<<<<<< HEAD
    createNewPost ();
});

const reload_page = () => {
    window.location.reload();
};

=======
    if (post.value.length !== 0 && post.value.trim() !== '') {
        createNewPost();
    }
    else {
        alert('Escribe un comentario');
    }
});

// const reload_page = () => {
//     window.location.reload();
// };
>>>>>>> 741a1f1a7e41fab9da41a217f70bb0ab384d3c3c
