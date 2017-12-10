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
            .map(i => _.sum(ingredientQuantities, iq => iq.qty * iq.ing.values[i]))
            .map(t => Math.max(0, t));
    
    return {
        ingredientQuantities: ingredientQuantities,
        total: totals.slice(0, 4).reduce((l, r) => l * r),
        calories: totals[4]
    };
}

function pickMax(ingredients, tsp, test, chosen) {
    var nextIng = ingredients[0],
        remainder = ingredients.slice(1);
    
    chosen = chosen || [];
    test = test || () => true;
        
    if (!remainder.length) {
        return totalIngredients(chosen.concat(ingredientQty(ingredients[0], tsp)));
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
        ? _.max(options, o => o.total)
        : null;
}

module.exports = lines => {
    var ingredients = lines.map(parseIngredient);
    
    return [
        pickMax(ingredients, 100),
        pickMax(ingredients, 100, opt => opt.calories === 500)
    ];
};