const $data = require('./data');
const _$data = require('./testData');
const Bayes = require('./Bayes');
const DecisionTree = require('./DecisionTree');
const Evaluate = require('./eva.js');

var feature = ['尿白细胞WBC','尿蛋白PRD','尿胆原URG','甲状腺素TH','促甲状腺激素TSH','酮体KET','H1','H2','H3','H4'];

var xy_tree = new Array();
var xy_bayes = new Array();
for(var i = 0; i < 40; i++){
  var obj = getRoc($data);
  xy_tree.push(obj.roc_tree);
  xy_bayes.push(obj.roc_bayes);
}
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
console.log(xy_tree);
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
console.log(xy_bayes);

function getRoc($data){
  var eva = new Evaluate($data);
  var data = eva.result()
  var eva_trainData = clone(data.train);
  var eva_testData = clone(data.test);

  var eva_tree = new DecisionTree(eva_trainData, feature);
  var eva_bayes = new Bayes(eva_trainData, feature);

  var mat_tree = eva.getMatrix(eva_tree, eva_testData);
  var mat_bayes = eva.getMatrix(eva_bayes, eva_testData);
  // console.log(mat_tree,mat_bayes);
  
  var roc_tree = eva.calcRate(mat_tree);
  var roc_bayes = eva.calcRate(mat_bayes);

  console.log(roc_tree, roc_bayes);
  return {
    roc_tree: roc_tree,
    roc_bayes: roc_bayes
  }
}

function clone(old){
  var arr = new Array();
  for(var i = 0; i < old.length; i++){
    arr.push(old[i]);
  }
  return arr;
}