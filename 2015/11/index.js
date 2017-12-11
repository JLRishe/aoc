const { compose, memoizeWith, identity, prop, zip, uniq, length } = require('ramda');
var util = require('../shared/util');
var _ = require('lodash');
const { isValidPassword } = require('./passwordValidate');
const { incrementPassword } = require('./passwordIncrement');

function applyUntil(start, op, test) {
    var value = start;
    
    do { value = op(value); } while (!test(value));
    
    return value;
}
var nextValidPassword = memoizeWith(
    identity,
    password => applyUntil(password, incrementPassword, isValidPassword)
);

const p1 = nextValidPassword;
const p2 = compose(nextValidPassword, nextValidPassword);

module.exports = {
    solution: {
        type: 'input',
        ps: [p1, p2]
    }
}