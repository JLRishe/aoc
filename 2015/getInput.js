var util = require('./shared/util');
var fs = require('fs');
var request = require('request');

var day = process.argv[2];

if (!day) {
    console.error('day unspecified');
    return;
}

util.promisify(fs.mkdir)(day).then(() => {
    var jar = request.jar();
    var cookie = request.cookie('session=53616c7465645f5f2716e54b36c900b6a6cb2306a524e102a9d23e65ecf5cfae32e895d1581d27dcc424869c4812080f');
    jar.setCookie(cookie, 'http://adventofcode.com');
    var url = 'http://adventofcode.com/day/' + day + '/input';
    
    request({ url: url, jar: jar}).pipe(fs.createWriteStream(day + '\\input.txt'));
}).catch(console.error);