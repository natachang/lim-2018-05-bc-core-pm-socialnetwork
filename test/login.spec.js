var config = {
    apiKey: "AIzaSyCsWWyT_6yQo2aTelsx9GaH8B39VWD98x8",
    authDomain: "brainyplaylab.firebaseapp.com",
    databaseURL: "https://brainyplaylab.firebaseio.com",
    projectId: "brainyplaylab",
    storageBucket: "brainyplaylab.appspot.com",
    messagingSenderId: "60588851338"
};
firebase.initializeApp(config);
  
  //test para ver si el login funciona
  
  describe('login', () => {
    it('Deberia exponer una funcion registerWithFirebase', () => {
      assert.isFunction(registerWithFirebase);
    });



    // it('Debe dar verdadero para email y clave', () => {
    //   const email = 'test@test.com';
    //   const password = '123456';
    //   const result = window.controller.validateLogin(email, password);
    //   assert.equal(result.valid, false);
    // });
  
  })