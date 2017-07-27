const HashMap = require('./HashMap');
const $data = require('./data');
const TreeNode = require('./TreeNode');
const InfoGain = require('./InfoGain');

function Iterator(arr){
  if(!(arr instanceof Array)){
    throw new Error('iterator needs a arguments that type is Array!');
  }
  this.arr = arr;
  this.length = arr.length;
  this.index = 0;
}
Iterator.prototype.current = function() {
  return this.arr[this.index-1];
}
Iterator.prototype.next = function(){
  this.index += 1;
  if(this.index > this.length || this.arr[this.index-1] === null)
    return false;
  return true;
}

function DecisionTree(data, attribute) {
  if(!(data instanceof Array) || !(attribute instanceof Array)){
    throw new Error('argument needs Array!');
  }
  this._data = data;
  this._attr = attribute;
  this._node = this.createDT(this._data,this._attr);
}
DecisionTree.prototype.createDT = function(data, attrList) {
  var node = new TreeNode();
  var resultMap = this.isPure(this.getTarget(data));
  
  if(resultMap.size() === 1){
    node.setType('result');
    node.setName(resultMap.keys()[0]);
    node.setVals(resultMap.keys()[0]);
    // console.log('单节点树：' + node.getVals());
    return node;
  }
  if(attrList.length === 0){
    var max = this.getMaxVal(resultMap);
    node.setType('result');
    node.setName(max)
    node.setVals(max);
    // console.log('最普遍性结果：'+ max);
    return node;
  }

  var maxGain = this.getMaxGain(data, attrList).maxGain;
  var attrIndex = this.getMaxGain(data, attrList).attrIndex
  // console.log('选出的最大增益率属性为：'+ attrList[attrIndex]);
  // console.log('创建节点：'+attrList[attrIndex])
  node.setName(attrList[attrIndex]);
  node.setType('attribute');

  var remainAttr = new Array();
  remainAttr = attrList;
  // remainAttr.splice(attrIndex, 1);

  var self = this;
  var gain = new InfoGain(data, attrList)
  var attrValueMap = gain.getAttrValue(attrIndex); //最好分类的属性的值MAP
  var possibleValues = attrValueMap.keys();
  
  node_vals = possibleValues.map(function(v) {
    // console.log('创建分支：'+v);
    var newData = data.filter(function(x) {
      return x[attrIndex] === v;
    });
    // newData = newData.map(function(v) {
    //   return v.slice(1);
    // })
    var child_node = new TreeNode(v, 'feature_values');
    var leafNode = self.createDT(newData, remainAttr);
    child_node.setVals(leafNode);
    return child_node;
  })
  node.setVals(node_vals);

  this._node = node;
  return node;
}
/**
 * 判断训练数据纯度分类是否为一种分类或没有分类
 */
DecisionTree.prototype.getTarget = function(data){
  var list = new Array();
  var iter = new Iterator(data);
  while(iter.next()){
    var index = iter.current().length - 1;
    var value = iter.current()[index];
    list.push(value);
  }
  return list;
},
/**
 * 获取分类结果数组，判断纯度
 */
DecisionTree.prototype.isPure = function(list) {
  var map = new HashMap(), count = 1;
  list.forEach(function(item) {
    if(map.get(item)){
      count++;
    }
    map.put(item, count);
  });
  return map;
}
/**
 * 获取最大增益量属性
 */
DecisionTree.prototype.getMaxGain = function(data, attrList) {
  var gain = new InfoGain(data, attrList);
  var maxGain = 0;
  var attrIndex = -1;
  for(var i = 0; i < attrList.length; i++){
    var temp = gain.getGainRaito(i);
    if(maxGain < temp){
      maxGain = temp;
      attrIndex = i;
    }
  }
  return {attrIndex: attrIndex, maxGain: maxGain};
}
/**
 * 获取resultMap中值最大的key
 */
DecisionTree.prototype.getMaxVal = function(map){
  var obj = map.obj, temp = 0, okey = '';
  for(var key in obj){
    if(temp < obj[key] && typeof obj[key] === 'number'){
      temp = obj[key];
      okey = key;
    };
  }
  return okey;
}
/**
 * 预测属性
 */
DecisionTree.prototype.predictClass = function(sample){
  var root = this._node;
  var map = new HashMap();
  var attrList = this._attr;
  for(var i = 0; i < attrList.length; i++){
    map.put(attrList[i], sample[i]);
  }

  while(root.type !== 'result'){
    if(root.name === undefined){
      return root = '无法分类';
    }
    var attr = root.name;
    var sample = map.get(attr);
    var childNode = root.vals.filter(function(node) {
      return node.name === sample;
    });
    if(childNode.length === 0){
      return root = '无法分类';
    }
    root = childNode[0].vals; // 只遍历attribute节点
  }
  return root.vals;
}

module.exports = DecisionTree;
