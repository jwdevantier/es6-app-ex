//import './sum'
//import {argv} from 'yargs';
//const argv = require('yargs').argv

var yargs = require("yargs/yargs");
var parser = yargs()
 .command('foo', 'foo command', () => {}, (argv) => {
   console.log(argv)
 })
 .array('y')
 .help()
parser.parse('foo -x 33 -y 99')
console.log("done")