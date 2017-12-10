var _ = require('lodash');

var movesToDefeat = 
    (attacker, defender) =>
        Math.ceil(defender.hitPoints / Math.max(attacker.damage - defender.armor, 1));

var doBattle = (p1, p2) => movesToDefeat(p1, p2) <= movesToDefeat(p2, p1);

var item = (cost, damage, armor) => ({ cost: cost, damage: damage, armor: armor });

var weapons = [
    item(8, 4, 0),
    item(10, 5, 0),
    item(25, 6, 0),
    item(40, 7, 0),
    item(74, 8, 0)
];
var armor = [
    item(0, 0, 0), // no armor
    item(13, 0, 1),
    item(31, 0, 2),
    item(53, 0, 3),
    item(75, 0, 4),
    item(102, 0, 5)
];
var rings = [
    item(25, 1, 0),
    item(50, 2, 0),
    item(100, 3, 0),
    item(20, 0, 1),
    item(40, 0, 2),
    item(80, 0, 3)
];

    
function combine(value, lists) {
    return lists.map(l => [].concat(value, l));
}    

function combineAll(options, lists) {
    return Array.prototype.concat.apply([], options.map(o => combine(o, lists)));
}

function combinations(items, minItems, maxItems) {
    // no possible options
    if (items.length < minItems) {
        return [];
    }
    // no more items available or can't add any more items
    if (items.length === 0 || maxItems === 0) {
        return [[]];
    }
    
    var remainder = items.slice(1);
    var withFirst = combine(items[0], combinations(remainder, Math.max(0, minItems - 1), maxItems - 1));
    var withoutFirst = combinations(remainder, minItems, maxItems);
    
    return withFirst.concat(withoutFirst);
}
    
var makePlayer = 
    (items) => ({
        cost: _.sum(items, i => i.cost),
        damage: _.sum(items, i => i.damage),
        armor: _.sum(items, i => i.armor),
        hitPoints: 100
    });

function buildPlayers() {
    var ringCombinations = combinations(rings, 0, 2);
    var armorRingCombinations = combineAll(armor, ringCombinations);
    var weaponArmorRingCombinations = combineAll(weapons, armorRingCombinations);
    
    return weaponArmorRingCombinations.map(makePlayer);
}

module.exports = () => {
    var allPlayers = buildPlayers();

    var boss = { damage: 8, armor: 2, hitPoints: 109 };
    var results = allPlayers.map(p => ({ 
        player: p, 
        result: doBattle(p, boss) 
    }));

    return [
        _.min(results.filter(r => r.result), r => r.player.cost).player.cost,
        _.max(results.filter(r => !r.result), r => r.player.cost).player.cost
    ];
};