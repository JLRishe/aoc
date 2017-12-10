require('./polyfills');

var _ = require('lodash');

var makeArr = alo => Array.prototype.slice.call(alo)

function promisify(func, thisArg) {
    return () => {
        var args = makeArr(arguments);
    
        return new Promise((resolve, reject) => {
            var callback = (err, result) => {
                if(err) {
                    reject(err);
                }
                resolve(result);
            };
            
            func.apply(thisArg || null, args.concat(callback));
        });
    };
}

function testString(str, pred, windowWidth) {
    var includeRem = (pred.length > 1);
    
    for (var i = 0; i < str.length - (windowWidth || 1) + 1; i += 1) {
        if (pred(idx => str[i + idx], includeRem ? str.substring(i) : null)) {
            return true;
        }
    }
    
    return false;
}

var countLoops = (test) => {
    for (var i = 0; test(i); i += 1) {}
    return i;
};

module.exports = {
    promisify: promisify,
    
    testString: testString,
    applyN: (start, op, count) => _.range(count).reduce(op, start),
    countLoops: countLoops,
    countWhile: countLoops,
    repeat: (start, end, op) => _.range(start, end).forEach(op),
};