var util = require('../shared/util');

function getRuns(str) {
    var runs = [],
        runLength,
        ch;
    
    while (str.length) {
        ch = str[0];
        runLength = util.countWhile(i => str[i] === ch);
        runs.push({ count: runLength, char: ch});
        str = str.substring(runLength);
    }
    
    return runs;
}

var lookAndSay = str => getRuns(str).map(r => r.count + r.char).join('');

var input = '1321131112';

console.log(util.applyN(input, lookAndSay, 40).length);
console.log(util.applyN(input, lookAndSay, 50).length);