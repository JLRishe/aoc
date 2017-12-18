var parseSingleFormula = 
    formula => /^\d+$/.test(formula)
        ? () => parseInt(formula)
        : (wireValues) => wireValues(formula);

var parseNotFormula = 
    formula =>
        wireValues => 
            ~parseSingleFormula(formula.split(' ')[1])(wireValues);

var opFuncMap = {
    AND: (l, r) => l & r,
    OR: (l, r) => l | r,
    LSHIFT: (l, r) => l << r,
    RSHIFT: (l, r) => l >> r
};

function parseBinaryFormula(formula) {
    var parts = formula.split(' '),
        op = opFuncMap[parts[1]],
        lhs = parseSingleFormula(parts[0]),
        rhs = parseSingleFormula(parts[2]);

    return wireValues => op(lhs(wireValues), rhs(wireValues));
}

function parseWireFormula(formula) {
    if (/^(\d+|[a-z]+)$/.test(formula)) {
        return parseSingleFormula(formula);
    }
    if (/^NOT [a-z]+$/.test(formula)) {
        return parseNotFormula(formula);
    }
    if (/^([a-z]+|\d+) (AND|OR|[LR]SHIFT) ([a-z]+|\d+)$/.test(formula)) {
        return parseBinaryFormula(formula);
    }
    throw new Error('Unknown formula:' + formula);
}

function parseWire(line) {
    var fAndName = line.split(' -> ');

    return {
        name: fAndName[1],
        compute: parseWireFormula(fAndName[0])
    };
}

module.exports = parseWire;