const { compose, curry, map, filter, prop } = require('ramda');


// State is { activeEffects, players: { player: Player, opponent: Opponent } }

const spells = {
    'Magic missile': {
        type: 'instant',
        cost: 53,
        action: ({ opponent: { hp } }) => ({ opponent: { hp: hp - 4 } })
    },
    'Drain': {
        type: 'instant',
        cost: 73,
        action: ({ player: { hp: playerHp }, opponent: { hp: opponentHp} }) => 
            ({ player: { hp: playerHp + 2 }, opponent: { hp: opponentHp - 2 } });
    },
    'Shield': {
        type: 'effect',
        cost: 113,
        duration: 6,
        action: () => ({ player: { armor: 7 } })
    },
    'Poison': {
        type: 'effect',
        cost: 173,
        duration: 6,
        action: ({ opponent: { hp } }) => ({ opponent: { hp: hp - 3 } })
    },
    'Recharge': {
        type: 'effect',
        cost: 229,
        duration: 5,
        action: ({ player: { mana }) => ({ player: { mana: mana + 101 })
    }
};

const spellNames = keys(spells);

const unavailableSpells = compose(
    map(prop('name')),
    filter(compose(gt(__, 1), prop('turns')))
);

const applySpell = (players, spellName) => {
    const { player, opponent } = players;
    const { player: playerChange, opponent: opponentChange } = spells[effectName].action(players);
    const updatedPlayer = merge(player, playerChange || {});
    const updatedOpponent = merge(opponent, opponentChange || {});
    
    return { player: updatedPlayer, opponent: updatedOpponent };
}

const applyEffects = ({ activeEffects, players }) => reduce(
    applyEffect,
    players,
    activeEffects
);

const stepEffects = compose(
    filter(({ turns }) => turns > 0),
    map(e => merge(e, { turns: e.turns - 1 }))
);

const nextTurn = curry((state, spellName) => {
    const players = applyEffects(state);
    const steppedEffects = stepEffects(state.activeEffects);
    
    const spell = spells[spellName];
    
    const playersAfterSpell = spell.type === 'instant'
        ? applySpell(players, spellName)
        : players;
        
    
});

const pickSpells = (state) => {
    const { activeEffects } = state;
    const unavailable = unavailableSpells(activeEffects);
    const available = without(unavailable, spellNames);
    
    return flatten(map(nextTurn(state), available)); 
};