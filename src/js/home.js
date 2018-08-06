const btnLogout = document.getElementById('btn-logout'),
postPublic = document.getElementById('publication-home');

btnLogout.addEventListener('click', () => {
    logoutWithFirebase();
});