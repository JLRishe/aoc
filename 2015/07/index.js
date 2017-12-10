const { compose, map, curry, identity, when } = require('ramda');
var util = require('../shared/util');
var parseWire = require('./parseWire');

function wireSource(wires) {
    var wireMap = {},
        wireValues = {};
        
    function wireValue(name) {
        if (!(name in wireValues)) {
            wireValues[name] = wireMap[name].compute(wireValue);
        }
        return wireValues[name];
    }
    
    wires.forEach(w => wireMap[w.name] = w);
    
    return {
        wireValue: wireValue
    };
}

const wireValue = curry((name, ws) => ws.wireValue(name));

const storeAndFind = wireAdjustment => compose(wireValue('a'), wireSource, map(wireAdjustment), map(parseWire));

const p1 = storeAndFind(identity);

const p2 = wireLines => {
    const aValue = p1(wireLines);
    
    return storeAndFind(when(
        w => w.name === 'b', 
        () => ({ name: 'b', compute: () => aValue })
    ))(wireLines);
}

module.exports = {
    ps: [p1, p2]
};