const { compose, map, curry, head, tail, isEmpty } = require('ramda');
var _ = require('lodash');

var ingredientQty = (ing, qty) => ({ ing: ing, qty: qty });

function parseIngredient(line) {
    var parts = /^([a-zA-Z]+): capacity (\-?\d+), durability (\-?\d+), flavor (\-?\d+), texture (\-?\d+), calories (\-?\d+)/.exec(line);
    
    return {
        name: parts[1],
        values: parts.slice(2, 7).map(Number)
    };
}

function totalIngredients(ingredientQuantities) {
    var totals = 
        _.range(5)
            .map(i => _.sumBy(ingredientQuantities, iq => iq.qty * iq.ing.values[i]))
            .map(t => Math.max(0, t));
    
    return {
        ingredientQuantities: ingredientQuantities,
        total: totals.slice(0, 4).reduce((l, r) => l * r),
        calories: totals[4]
    };
}

const pickMax = (ingredients, tsp, test, chosen) => {
    const nextIng = head(ingredients)
    const remainder = tail(ingredients);
    
    chosen = chosen || [];
    test = test || (() => true);
        
    if (isEmpty(remainder)) {
        return totalIngredients([...chosen, ingredientQty(ingredients[0], tsp)]);
    }
    
    var options = 
        _.range(tsp)
         .map(i => pickMax(
            remainder, 
            tsp - i,
            test,            
            chosen.concat(ingredientQty(nextIng, i))
        )
    ).filter(opt => opt && test(opt));

    return options.length
        ? _.maxBy(options, o => o.total)
        : null;
};

const startPickMaxWithTest = curry((tsp, test, ingredients) => pickMax(ingredients, tsp, test));

const startPickMax = curry((tsp, ingredients) => startPickMaxWithTest(tsp, () => true, ingredients));

const p1 = compose(
    startPickMax(100),
    map(parseIngredient)
);

const p2 = compose(
    startPickMaxWithTest(100, opt => opt.calories === 500),
    map(parseIngredient)
);

module.exports = {
    solution: {
        type: 'lines',
        ps: [p1, p2]
    }
};