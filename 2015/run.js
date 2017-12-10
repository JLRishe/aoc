var util = require('./shared/util');
var _ = require('lodash');
var fs = require('fs');

var day = process.argv[2];
var input = process.argv[3] || 'input.txt';

var solver = require('./' + day + '/main');
var filePath = './' + day + '/' + input;

var splitLines = content => content.split(/\r\n|\r|\n/).filter(_.identity);
var handleError = err => console.error(err, err.stack); 

var readFile = util.promisify((path, callback) => fs.readFile(path, { encoding: 'UTF-8' }, callback));

readFile(filePath)
    .catch(_.noop)
    .then(content => {
        var lines = content && splitLines(content);
        
        return solver(!lines ? input : lines.length === 1 ? content : lines);
    })
    .then(results => Array.prototype.concat.call([], results).map(e => console.log(e)))
    .catch(handleError);