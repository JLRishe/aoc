var _ = require('lodash');

function parseHappiness(line) {
    var parts = /^([a-zA-Z]+) would (gain|lose) (\d+) happiness units by sitting next to ([a-zA-Z]+)\.$/.exec(line);
    
    return {
        person: parts[1],
        neighbor: parts[4],
        change: Number(parts[3]) * (parts[2] === 'gain' ? 1 : -1)
    };
}

function itemSourceMap(constructor) {
    var items = {};
    
    return {
        getItem: name => {
            if (!(name in items)) {
                items[name] = constructor(name);
            }
            return items[name];
        },
        
        getItems: () => _.values(items)
    };
}

function person(name) {
    var neighborDeltas = {};
    
    return {
        name: name,
        when: (otherPerson, delta) => 
            arguments.length === 1
                ? neighborDeltas[otherPerson.name]
                : neighborDeltas[otherPerson] = delta
    };
}

var arrangementValue = 
    (seats, people) => seats.reduce((t, person, i) =>
         person.when(seats[(i || seats.length) - 1]) + 
         person.when(seats[(i + 1) % seats.length]) +
         t
    , 0);

var findMaxArrangement = 
    (people, acc) => 
        people.length === 0
            ? { seats: acc, value: arrangementValue(acc) }
            : people.map(p => findMaxArrangement(_.reject(people, p), (acc || []).concat(p)))
                    .reduce((l, r) => l.value > r.value ? l : r);
    
module.exports = lines => {
    var items = lines.map(parseHappiness);
    var people = itemSourceMap(person);
    
    items.forEach(i => people.getItem(i.person).when(i.neighbor, i.change));
    
    // first answer
    var first = findMaxArrangement(people.getItems());
    
    // second answer
    var me = people.getItem('Me');
    people.getItems().forEach(p => { me.when(p.name, 0); p.when('Me', 0); });
    
    // second answer
    var second = findMaxArrangement(people.getItems());
    
    return [first, second];
};
        