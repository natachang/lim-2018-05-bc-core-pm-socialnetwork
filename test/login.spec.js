describe('login', () => {
  it('Deberia exponer una funcion registerWithFirebase', () => {
    assert.isFunction(registerWithFirebase);
  });

  it('Debe dar verdadero para email y clave', () => {
    const email = 'test@test.com';
    const password = '123456';
    const result = window.login.loginWithFirebase(email, password);
    assert.equal(result.valid, false);
  });

})