
function adjustStat(character, stat, newValue, temp) {
    var copy = Object.create(character),
        tempCopy = temp ? Object.create(copy) : copy;

    tempCopy.base = copy;
    tempCopy[stat] = newValue;
    
    return tempCopy;
}

var spells = [
    'Magic missile':  {
        cost: 53,
        duration: 0,
        turnEffect: players => players,
        instantEffect: players => ({
            player: players.player,
            opponent:  adjustStat(players.opponent, 'hp', players.opponent.hp - 4)     
        })
    },
    'Drain': {
        cost: 73,
        duration: 0,
        turnEffect: players => players,
        instantEffect: players => ({
            player: adjustStat(players.player, 'hp', players.player.hp + 2),
            opponent: adjustStat(players.opponent, 'hp', players.opponent.hp - 2)
        })
    },
    'Shield': {
        cost: 113,
        duration: 6,
        turnEffect: players => ({
            player: adjustStat(players.player, 'armor', players.player.armor + 7, true),
            opponent: opponent
        }),
        instantEffect: players => players
    },
    'Poison': {
        cost: 173,
        duration: 6,
        turnEffect: players => ({
            player: player,
            opponent: adjustStat(players.opponent, 'hp', players.opponent.hp - 3)
];