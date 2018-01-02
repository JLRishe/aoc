const { compose, curry, map, filter, prop, path, merge, reduce, contains, flatten } = require('ramda');

// ActiveEffect is { name: String, turns: Number }
// State is { activeEffects: [ActiveEffect], players: { player: Player, opponent: Opponent }, manaUsed: Number }

const spells = [
    {
        name: 'Magic Missile',
        type: 'instant',
        cost: 53,
        action: ({ opponent: { hp } }) => ({ opponent: { hp: hp - 4 } })
    },
    {
        name: 'Drain',
        type: 'instant',
        cost: 73,
        action: ({ player: { hp: playerHp }, opponent: { hp: opponentHp} }) => 
            ({ player: { hp: playerHp + 2 }, opponent: { hp: opponentHp - 2 } })
    },
    {
        name: 'Shield',
        type: 'effect',
        cost: 113,
        duration: 6,
        action: () => ({ player: { armor: 7 } })
    },
    {
        name: 'Poison',
        type: 'effect',
        cost: 173,
        duration: 6,
        action: ({ opponent: { hp } }) => ({ opponent: { hp: hp - 3 } })
    },
    {
        name: 'Recharge',
        type: 'effect',
        cost: 229,
        duration: 5,
        action: ({ player: { mana } }) => ({ player: { mana: mana + 101 } })
    }
];

// Players -> String -> Players
const applySpell = (players, { name, action, cost }) => {
    const { player, opponent } = players;
    const { player: playerChange, opponent: opponentChange } = action(players);
    
    console.log(name, playerChange, opponentChange);
    
    const updatedPlayer = merge(player, playerChange || {});
    const updatedOpponent = merge(opponent, opponentChange || {});
    
    return { player: updatedPlayer, opponent: updatedOpponent };
}

// State -> State
const applyEffects = ({ activeEffects, players }) => compose(
    reduce(
        applySpell,
        players
    ),
    map(prop('spell'))
)(activeEffects);

// [ActiveEffect] -> [ActiveEffect]
const stepEffects = compose(
    filter(({ turns }) => turns > 0),
    map(e => merge(e, { turns: e.turns - 1 }))
);

// [String] -> Number -> Spell -> Boolean
const canCast = curry((activeEffectNames, mana, { name, cost }) => 
    mana > cost && !contains(name, activeEffectNames));

// [ActiveEffect] -> Number -> [Spell]
const possibleSpells = (activeEffects, mana) => {
    const activeEffectNames = map(path(['spell', 'name']), activeEffects);
    
    return filter(canCast(activeEffectNames, mana), spells);
};

const deductMana = (amount, { player, opponent }) => 
    ({ opponent, player: merge(player, { mana: player.mana - amount }) });

// State -> Spell -> State
const castSpell = ({ players, activeEffects, manaUsed }, spell) => {
    const { type, turns, cost } = spell;
    const newPlayers = type === 'instant' ? applySpell(players, spell) : players;
    
    return {
        players: deductMana(cost, newPlayers),
        activeEffects: type === 'effect' ? [...activeEffects, { spell, turns }] : activeEffects,
        manaUsed: manaUsed + cost
    }
};

const opponentDefeated = ({ players: { opponent: { hp } } }) => hp <= 0;
const playerDefeated = ({ players: { player: { hp } } }) => hp <= 0;

const win = ({ manaUsed }) => ({ result: 'win', manaUsed });
const lose = ({ manaUsed }) => ({ result: 'lose', manaUsed });

// State -> State
const attackPlayer = state => {
    const { players: { player, opponent } } = state;
    const attackedPlayer = merge(player, { hp: player.hp - opponent.damage });
    
    return merge(state, { players: { player: attackedPlayer, opponent } });
};

// State -> Spell -> [Result]
const applySpellChoice = curry((state, spell) => {
    console.log(state);
    
    // Opponent defeated
    if (opponentDefeated(state)) {
        return [win(state)];
    }

    // Cast instant spell
    const afterSpell = castSpell(state, spell);
    
    // Opponent defeated
    if (opponentDefeated(afterSpell)) {
        return [win(afterSpell)];
    }

    // Attack player
    const afterAttack = attackPlayer(afterSpell);
    
    if (playerDefeated(afterAttack)){
        return [lose(afterAttack)];
    }
    
    // TODO: reset armor
    
    return doTurn(afterAttack);
});

const doTurn = (state) => {
    const players = applyEffects(state);
    const activeEffects = stepEffects(state.activeEffects);
    
    const sp = possibleSpells(activeEffects, players.player.mana);
    
    const results = map(applySpellChoice(merge(state, { activeEffects })), sp);

    return flatten(results);
};

const initialState = {
    activeEffects: [], 
    players: { 
        player: { hp: 50, mana: 500 }, 
        opponent: { hp: 51, damage: 9 } 
    }, 
    manaUsed: 0 
};

const p1 = () => compose(
    filter(r => r.result == 'win'),
    doTurn
)(initialState);

const p2 = () => 0;

module.exports = {
    solution: {
        ps: [p1, p2]
    }
}