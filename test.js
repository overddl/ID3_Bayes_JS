const $data = require('./testData');
const Bayes = require('./Bayes');
const DecisionTree = require('./DecisionTree');
const Evaluate = require('./eva.js');

var feature = ['天气','气温','体温','是否咽喉肿痛'];

var test = ['rainy','cool','high','TRUE'];

var test2 = ['rainy','cool','normal','TRUE']; // 两者不一样

var bayes = new Bayes($data);
var a = bayes.predictClass(test);

var decisionTree = new DecisionTree($data, feature);
var b = decisionTree.predictClass(test);

console.log(a, b);