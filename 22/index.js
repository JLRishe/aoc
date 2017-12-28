const { compose, curry, map, filter, prop } = require('ramda');

// ActiveEffect is { name: String, turns: Number }
// State is { activeEffects: [ActiveEffect], players: { player: Player, opponent: Opponent } }

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
            ({ player: { hp: playerHp + 2 }, opponent: { hp: opponentHp - 2 } });
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
        action: ({ player: { mana }) => ({ player: { mana: mana + 101 })
    }
];

const spellNames = keys(spells);

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
    const activeEffectNames = map(prop('name'), activeEffects);
    
    return filter(canCast(activeEffectNames, mana), spells);
};

// State -> Spell -> [Result]
const applySpellChoice = ({ players, activeEffects, manaUsed }, { type, name, cost }) => {
    // Opponent defeated
    if (players.opponent.hp <= 0) {
        return [{ result: 'win', manaUsed }];
    }

    // Cast instant spell
    const { player: playerAfterSpell, opponent: opponentAfterSpell } = type === 'instant'
        ? applySpell(players, name)
        : players;
    
    // Include new effect
    const updatedEffects = type = 'effect'
        ? merge(steppedEffects, { name: spellName, turns: spell.turns }),
        : steppedEffects;
        
    const manaAfterSpell = manaUsed + cost;
    
    // Opponent defeated
    if (opponentAfterSpell.hp <= 0) {
        return [{ result: 'win', manaUsed: manaAfterSpell }];
    }

    // Attack player
    const playerAfterAttack = attackPlayer(playerAfterSpell, opponentAfterSpell);
    
    if (playerAfterAttack.hp <= 0){
        return [{ result: 'lose', manaUsed: manaAfterSpell }];
    }
    
    // TODO: reset armor
    
    return doTurn({ activeEffects: updatedEffects, player: playerAfterAttack, opponent: opponentAfterSpell, manaUsed: manaAfterSpell });
};

const doTurn = curry((state) => {
    const players = applyEffects(state);
    const steppedEffects = stepEffects(state.activeEffects);
    
    const sp = possibleSpells(steppedEffects, players.player.mana);

    return flatten(map(applySpellChoice({ activeEffects: steppedEffects, players }), sp));
})

const nextTurn = 

const pickSpells = (state) => {
    const { activeEffects } = state;
    const unavailable = unavailableSpells(activeEffects);
    const available = without(unavailable, spellNames);
    
    return flatten(map(nextTurn(state), available)); 
};