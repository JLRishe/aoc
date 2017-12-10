console.time('day20');
console.log('Advent of Code // Day 20');

input = 34000000;
var presents = [];
var presents2 = [];
for (var e = 1; e <= input / 10; e++) {
    var i = 0;
    for (var h = e; h < input / 10; h += e) {
        if (presents[h] === undefined) {
            presents[h] = 10;
        } else {
            presents[h] += e * 10;
        }
        if (i < 50) {
            if (presents2[h] === undefined) {
                presents2[h] = 11;
            } else {
                presents2[h] += e * 11;
            }
            i++;
        }
    }
}

var minHouse = 0;
for (var m = 0; m < presents.length; m++) {
    if (presents[m] >= input) {
        minHouse = m;
        break;
    }
}

var minHouse2 = 0;
for (var mm = 0; mm < presents2.length; mm++) {
    if (presents2[mm] >= input) {
        minHouse2 = mm;
        break;
    }
}

console.log('Part #1 Answer: %s', minHouse);
console.log('Part #2 Answer: %s', minHouse2);
console.timeEnd('day20');
