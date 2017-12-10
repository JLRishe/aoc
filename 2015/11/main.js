var util = require('../shared/util');
var _ = require('lodash');

var nextChar = ch => String.fromCharCode(ch.charCodeAt(0) + 1);


var isStepUp = (ch1, ch2) => nextChar(ch1) === ch2;
var hasIncreasingStraight = 
    password => 
        util.testString(password, (ch) => isStepUp(ch(0), ch(1)) && isStepUp(ch(1), ch(2)));


var hasBadCharacter = password => /[iol]/.test(password);


var startsWithPair = str => str[0] === str[1];
var hasPair = str => util.testString(str, (_, rem) => startsWithPair(rem));
var hasTwoPairs = 
    password =>
        util.testString(password, (_, rem) => startsWithPair(rem) && hasPair(rem.substring(2)));


var isValidPassword = 
    password => 
        hasIncreasingStraight(password) && 
        !hasBadCharacter(password) &&
        hasTwoPairs(password);


var incrementChar = ch => ch === 'z' ? 'a' : nextChar(ch);
var charAdder = 
    (prev, cin) => ({ 
        carry: prev.carry && cin === 'z', 
        acc: (prev.carry ? incrementChar(cin) : cin) + prev.acc
    });

    
var incrementPassword = 
    password => _.reduceRight(password, charAdder, { carry: true, acc: '' }).acc;

function applyUntil(start, op, test) {
    var value = start;
    
    do { value = op(value); } while (!test(value));
    
    return value;
}
var nextValidPassword = password => applyUntil(password, incrementPassword, isValidPassword);

module.exports = () => {
    var input = 'cqjxjnds';
    
    var nextPassword = nextValidPassword(input);
    
    var nextNextPassword = nextValidPassword(nextPassword);

    return [nextPassword, nextNextPassword];
};