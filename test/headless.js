// declarar la funcion del test
global.window = global;
global.assert = require('chai').assert;
global.firebase = require('firebase');


require('../src/js/login');
require('.../login.spec.js');