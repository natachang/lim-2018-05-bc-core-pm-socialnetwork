const btnHome = document.getElementById('btn-home'),
    btnProfile = document.getElementById('btn-profile'),
    btnLogout = document.getElementById('btn-logout'),
    profilePrivate = document.getElementById('profile-private'),
    profilePublic = document.getElementById('profile-public'),
    btnPublicar = document.getElementById('btn-publicar'),
    postContainer = document.getElementById('post-container'),//text area donde publica
    pUser = document.getElementById('user-name'),
    pImage = document.getElementById('user-image'),
    pEmail = document.getElementById('user-email'),
    selectOption = document.getElementById('select-option'),
    publicationProfile = document.getElementById('publication-profile'),
    publicationHome = document.getElementById('publication-home');

btnHome.addEventListener('click', () => {
    profilePrivate.style.display = 'none';
    profilePublic.style.display = 'block';
});

btnProfile.addEventListener('click', () => {
    profilePrivate.style.display = 'block';
    profilePublic.style.display = 'none';
});

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});

btnPublicar.addEventListener('click', () => {
    const contenidoPost = postContainer.value;
    const selectOptionPublicate = selectOption.value;
    const valuePrivacy = contenidoPost.trim();

    if (contenidoPost.length !== 0 && valuePrivacy !== '') {
        if (selectOptionPublicate == 'public') {
            console.log('publico post');
            writeNewPost();
            cleanTextarea();
        }
        else if (selectOptionPublicate == 'private') {
            console.log('privado post');
            writeNewPostPrivate();
            cleanTextarea();
        }
        else {
            console.log('post no definido')
            writeNewPost();
        }
    }
    else {
        alert('Post no escrito');
    }
});