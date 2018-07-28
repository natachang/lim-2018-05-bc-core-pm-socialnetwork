// declarar la funcion del test
global.window = global;
global.assert = require('chai').assert;

require('./src/js/index');
require('./index.spec.js');