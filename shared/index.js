const { __, compose, curry, split, add, length, mathMod, drop, take } = require('ramda');


const log = (...vals) => console.log.apply(console, vals);

const toArray = val => Array.from(val);

const tokenize = split(/\s+/);

const arrayMap = curry((f, arr) => toArray(arr).map(f));

const arrayFilter = curry((f, arr) => toArray(arr).filter(f));

const applyPattern = curry((regex, str) => regex.exec(str));

const probe = val => (log(val), val);

const add1 = add(1);

const repeatUntil = curry((update, stop, start) => {
    let cur = start;
    
    while (!stop(cur)) { cur = update(cur) }
    
    return cur;
});

const rotate = curry((count, arr) => {
    const len = length(arr);
    const offset = len - mathMod(count, len);
    
    return [...drop(offset, arr), ...take(offset, arr)];
});

module.exports = {
    log
    , probe
    , tokenize
    , applyPattern
    , toArray
    , arrayMap
    , arrayFilter
    , add1
    , repeatUntil
    , rotate
};