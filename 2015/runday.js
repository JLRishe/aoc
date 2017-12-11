const day = process.argv[2];

const { run, runLines } = require('./shared/runhelpers');
const { solution: { type, ps } } = require(`./${day}`);

const runFunc = type === 'lines' ? runLines : run;

runFunc(day, ps);
