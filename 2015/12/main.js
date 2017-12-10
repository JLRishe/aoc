var _ = require('lodash');

function totaller(excludeRed) {
    function totalObject(obj) {
        var values = _.values(obj);
        
        return excludeRed && !Array.isArray(obj) && _.contains(values, 'red') 
            ? 0 
            : _.sum(values, total);
    }
    
    function total(val) {
        switch (typeof val) {
            case 'object':
                return totalObject(val);
            case 'number':  
                return val;
            default:
                return 0;
        }
    }
    
    return total;
}

module.exports = input => {
    var obj = JSON.parse(input);
    
    return [
        totaller(false)(obj),
        totaller(true)(obj)
    ];
};