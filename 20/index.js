const findMinTarget = (houseGenerator) => (target) => 
    houseGenerator(target / 10)
        .map((h, i) => ({ h, i }))
        .find(h => h && h.h >= target).i;

const p1Houses = (tenthTarget) => {
    var houses = [];
    
    for(var i = 1; i < tenthTarget; i += 1) {
        for (var j = i; j < tenthTarget; j += i) {
            houses[j] = (houses[j] || 0) + i * 10;
        }
    }
    
    return houses;
}        

const p2Houses = (tenthTarget) => {
    var houses2 = [];
    
    for (var i = 1; i < tenthTarget; i += 1) {
        for (var j = 1; j <= 50 && (j * i < tenthTarget); j += 1) {
            houses2[j * i] = (houses2[j * i] || 0) + i * 11;
        }
    }
    
    return houses2;
}

const p1 = findMinTarget(p1Houses);

const p2 = findMinTarget(p2Houses);

module.exports = {
    solution: {
        ps: [p1, p2],
        pre: Number
    }
};