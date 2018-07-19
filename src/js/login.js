window.onload = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            loggedIn.style.display = "block";
            loggedOut.style.display = "none";
        } else {
            loggedIn.style.display = "none";
            loggedOut.style.display = "block";
        }
        console.log("User > " +JSON.stringify(user));
    })
};

const registerWithFirebase = () => {
    const emailValue = email.value;
    const passwordValue = password.value;
    firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
        .then(() => {
            console.log("Usuario creado con exito");
        })
        .catch((error) => {
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        });
};

const loginWithFirebase = () => {
    const emailValue = email.value;
    const passwordValue = password.value;
    firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
        .then(() => {
            console.log("Usuario logeado con exito");
        })
        .catch(() => {
            console.log("Error de firebase > Codigo >" + error.code);
            console.log("Error de firebase > Mensaje >" + error.message);
        })
};

const logoutWithFirebase = () => {
    firebase.auth().signOut()
    .then(() => {
        console.log("Usuario finalizo su sesion");
    })
    .catch(() => {
        console.log("Error de firebase > Codigo >" + error.code);
        console.log("Error de firebase > Mensaje >" + error.message);
    })
};