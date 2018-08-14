window.validateName = (name) => {
    if ((/^([A-Za-z0-9\s]{5,})+$/g.test(name))) {
        return true;
    } else {
        return false;
    }
};

window.validateEmail = (email) => {
    if (/^([a-zA-Z0-9._-]{3,})+@([a-zA-Z0-9.-]{5,})+\.([a-zA-Z]{2,})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
};

window.validatePassword = (password) => {
    if (/^([A-Za-z0-9]{8,})+$/g.test(password)) {
        return true;
    } else {
        return false;
    }
};

window.validateVerificar = (valpassword) => {
    if (/^([A-Za-z0-9]{8,})+$/g.test(valpassword)) {
        return true;
    } else {
        return false;
    }
};