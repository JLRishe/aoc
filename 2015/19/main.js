var _ = require('lodash');

function parseReplacement(line) {
    var parts = line.split(' => ');
    
    return {
        from: parts[0],
        to: parts[1]
    };
}

function flipReplacement(r) {
    return {
        from: r.to,
        to: r.from
    }
}

function performReplacement(replacement, line) {
    var idx = line.indexOf(replacement.from);
    var options = [];
    
    while (idx !== -1) {
        var next = line.substring(0, idx) + replacement.to + line.substring(idx + replacement.from.length);
        if (!_.contains(tried, next)) {
            options.push(next);
        }
        idx = line.indexOf(replacement.from, idx + 1);
    }
    
    return options;        
}

function doSingleReplacements(line, replacements) {
    var allReplacements = replacements.map(r => performReplacement(r, line));
    return Array.prototype.concat.apply([], allReplacements);
}

function doReplacements(lines, replacements) {
    var lineReplacements = lines.map(l => doSingleReplacements(l, replacements));
    var all = Array.prototype.concat.apply([], lineReplacements);
    
    return _.uniq(all);
}

var tried = [];
var maxLength;
var target;
var minCount = 90000000;

function tryInput(val, count, replacements) {
    console.log(val);
    if (val === target) { return count; }
    var options = doSingleReplacements(val, replacements);
    var oldTried = tried;
    tried = _.uniq(oldTried.concat(options));

    var results = options.filter(o => !_.contains(oldTried, o) && o.length <= maxLength)
                         .map(o => tryInput(o, count + 1, replacements));
                         
    return results.filter(r => r > 0);
}

module.exports = (lines) => {
    var replacements = lines.slice(0, lines.length - 1).map(parseReplacement);
    
    target = lines[lines.length - 1];
    maxLength = target.length;
    
    var i = 0;
        available = ['e'];
    var allSoFar = [];
    
    var results = tryInput('e', 0, replacements);
    
    console.log(results);
        
/*    var flipped = replacements.map(flipReplacement);
        
    while(!_.contains(available, target)){
        i += 1;
        var nextStep = doReplacements(available, replacements);
        available = nextStep.filter(m => !_.contains(allSoFar, m));
        allSoFar = _.uniq(allSoFar.concat(available));
        console.log(available);
    }*/
    
    return [doReplacements([target], replacements).length];
};