var util = require('../shared/util');

var reindeerRegEx = /^([a-zA-z]+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\.$/;

function parseReindeer(line) {
    var parts = reindeerRegEx.exec(line);
    
    return {
        name: parts[1],
        speed: Number(parts[2]),
        flyTime: Number(parts[3]),
        restTime: Number(parts[4]),
        points: 0
    };
}

// distance of a reinder after <seconds> seconds
function dist(reindeer, seconds) {
    var phaseLength = reindeer.flyTime + reindeer.restTime;
    
    return {
        reindeer: reindeer,
        dist: Math.floor(seconds / phaseLength) * reindeer.flyTime * reindeer.speed +
            Math.min(seconds % phaseLength, reindeer.flyTime) * reindeer.speed
    };
}

var chooseByProp = (prop, comp) => (l, r) => comp(l[prop], r[prop]) ? l : r;
var greater = (l, r) => l > r;
var chooseByDist = chooseByProp('dist', greater);

var winner = 
    (reindeers, seconds) => reindeers.map(r => dist(r, seconds)).reduce(chooseByDist);

module.exports = lines => {
    var raceTime = 2503;
    var reindeers = lines.map(parseReindeer);
    
    var w1 = winner(reindeers, raceTime);
    
    util.repeat(1, raceTime, i => winner(reindeers, i).reindeer.points += 1);
    
    var w2 = reindeers.reduce(chooseByProp('points', greater));

    return [w1.dist, w2.points];
};