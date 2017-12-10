const day = process.argv[2];

const { run } = require('./shared/runhelpers');
const { ps } = require(`./${day}`);

run(day, ps);