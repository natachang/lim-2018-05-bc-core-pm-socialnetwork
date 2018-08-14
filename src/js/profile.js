const btnHome = document.getElementById('btn-home'),
    btnProfile = document.getElementById('btn-profile'),
    btnDatos = document.getElementById('btn-datos'),
    btnSocial = document.getElementById('btn-social'),
    btnLogout = document.getElementById('btn-logout'),
    profilePrivate = document.getElementById('profile-private'),
    profilePublic = document.getElementById('profile-public'),
    btnPublicar = document.getElementById('btn-publicar'),
    postContainer = document.getElementById('post-container'),
    pUser = document.getElementById('user-name'),
    pImage = document.getElementById('user-image'),
    pEmail = document.getElementById('user-email'),
    selectOption = document.getElementById('select-option'),
    publicationProfile = document.getElementById('publication-profile'),
    publicationHome = document.getElementById('publication-home');

btnHome.addEventListener('click', () => {
    btnDatos.style.display = 'none';
    btnSocial.style.display = 'block';
    profilePrivate.style.display = 'none';
    profilePublic.style.display = 'block';
});

btnProfile.addEventListener('click', () => {
    btnSocial.style.display = 'none';
    profilePublic.style.display = 'none';
    btnDatos.style.display = 'block';
    profilePrivate.style.display = 'block';
});

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnPublicar.addEventListener('click', () => {
    const contenidoPost = postContainer.value;
    const valuePrivacy = contenidoPost.trim();

    if (contenidoPost.length !== 0 && valuePrivacy !== '') {
        writePost();
        cleanTextarea();
    }
    else {
        swal('Porfavor ingresa una publicacion', 'info');
    };
});

const cleanTextarea = () => {
    postContainer.value = '';
};

const reloadPage = () => {
    window.location.reload();
};

const userInformation = (user) => {
    //Imprime nombre de usuario
    if (user.displayName === null) {
        pUser.innerHTML = user.email;
    } else {
        pUser.innerHTML = user.displayName;
    }
    //Imprime foto en perfil
    if (user.photoURL === null) {
        pImage.setAttribute('src', "img/people.png");
        pImage.setAttribute('class', "w3-circle");
    } else {
        pImage.setAttribute('src', user.photoURL);
        pImage.setAttribute('class', "w3-circle");
    }
};