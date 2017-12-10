var _ = require('lodash');
require('../shared/polyfills');

var target = 34000000,
    tenthTarget = target / 10;
    
var findMinTarget = 
    houses =>
        houses.map((h, i) => ({ h: h, i: i })).find(h => h.h >= target).i;

function findFirstHouse() {
}
        
module.exports = () => {
    var houses = [];
    
    for(var i = 1; i < tenthTarget; i += 1) {
        for (var j = i; j < tenthTarget; j += i) {
            houses[j] = (houses[j] || 0) + i * 10;
        }
    }
    
    var houses2 = [];
    for (var i = 1; i < tenthTarget; i += 1) {
        for (var j = 1; j <= 50 && (j * i < tenthTarget); j += 1) {
            houses2[j * i] = (houses2[j * i] || 0) + i * 11;
        }
    }
    
    return [findMinTarget(houses, target), findMinTarget(houses2, target)];
};