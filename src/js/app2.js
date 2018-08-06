//Mostrando Post en Home
const allPostsHome = (newPosts) => {

    //Si no me sale es porque el newPost es postsKey igual que abajo
    const newPost = newPosts.key;

    let allPost = document.createElement('div'); //Div principal que ira dentro de postarea
    allPost.setAttribute('class', 'w3-container w3-card w3-white w3-round w3-margin');

    let infoPost = document.createElement('div'); //Div que guarda img y nombre
    infoPost.setAttribute('class', 'col-sm-3');

    let contPost = document.createElement('div'); //Div que guarda a publicacion
    contPost.setAttribute('class', 'col-sm-9');

    let divPostOne = document.createElement('div');
    divPostOne.setAttribute('class', 'well');

    let divPostTwo = document.createElement('div');
    divPostTwo.setAttribute('class', 'well');

    let imageUser = document.createElement('img'); //Etiqueta img
    imageUser.setAttribute('class', 'w3-left w3-circle w3-margin-right');
    imageUser.setAttribute('width', '30');
    // imageUser.setAttribute('src', userphoto);

    let nombreUser = document.createElement('h4'); //Label de nombre
    nombreUser.setAttribute('id', 'nombreUser');

    let textPost = document.createElement('textarea'); // txt area de contPost
    textPost.setAttribute('id', newPost); //Dar el valor al ID de textPost
    textPost.innerHTML = `${newPosts.val().body}`; //Contenido del post

    //Si no me sale es porque el newPost es postsKey igual que arriba
    let btnLiked = document.createElement('input');
    btnLiked.setAttribute('id', newPost);
    btnLiked.setAttribute('class', 'w3-button w3-theme-d1 w3-margin-bottom');
    btnLiked.setAttribute('type', 'button');
    btnLiked.setAttribute('value', 'Me gusta ♥');

    //Igual que arriba
    let countLiked = document.createElement('a');
    countLiked.setAttribute('id', newPost);
    countLiked.setAttribute('class', 'w3-button w3-theme-d1 w3-margin-bottom');
    countLiked.innerHTML = `${newPosts.val().startCount}`;

    let countClick = 0;
    const countLikePost = () => {
        countClick += 1;
        countLiked.innerHTML = countClick;

        const newUpdate = textPost.innerText;
        const nuevoPost = {
            uid: `${newPosts.val().uid}`,
            username: `${newPosts.val().username}`,
            email: `${newPosts.val().email}`,
            profile_picture: `${newPosts.val().profile_picture}`,
            body: newUpdate,
            key: newPost,
            startCount: countClick,
        };

        let updatesUser = {};
        let updatesPost = {};

        updatesUser[`/posts/${newPosts.key}`] = nuevoPost;
        firebase.database().ref().update(updatesUser);
        firebase.database().ref().update(updatesPost);
    };

    btnLiked.addEventListener('click', () => {
        countLikePost();
    });

    //Aqui va los appendchild
    postPublic.appendChild(allPost);
    allPost.appendChild(infoPost);
    allPost.appendChild(contPost);
    infoPost.appendChild(divPostOne);
    contPost.appendChild(divPostTwo);
    divPostOne.appendChild(imageUser);
    divPostOne.appendChild(nombreUser);
    divPostTwo.appendChild(textPost); //Antes contenia a ContPost
    divPostTwo.appendChild(btnLiked);
    divPostTwo.appendChild(countLiked);

};