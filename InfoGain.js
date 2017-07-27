const HashMap = require('./HashMap');

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


/**
 * 计算信息增益类
 * @param Array data 训练数据集
 * @param Array data 作用的特征属性
 */
function InfoGain(data, attr) {
  if(!(data instanceof Array) || !(attr instanceof Array)){
    throw new Error('arguments needs Array!');
  }
  this._data = data;
  this._attr = attr;
}
InfoGain.prototype = {
  /**
   * 获取训练数据分类个数
   * @return hashMap<类别, 该类别数量>
   */
  getTargetValue: function() {
    var map = new HashMap();
    var iter = new Iterator(this._data);
    while(iter.next()){
      var t = iter.current();
      var key = t[t.length-1];
      var value = map.get(key);
      map.put(key, value !== undefined ? ++value : 1);
    }
    return map;
  },
  /**
   * 获取训练数据信息熵
   * @return 训练数据信息熵
   */
  getEntroy: function(){
    var targetValueMap = this.getTargetValue();
    var targetKey = targetValueMap.keys(), entroy = 0;
    var self = this;
    var iter = new Iterator(targetKey);
    while(iter.next()){
      var p = targetValueMap.get(iter.current()) / self._data.length;
      entroy += (-1) * p * (Math.log(p) / Math.LN2);
    }
    return entroy;
  },
  /**
   * 获取属性值在训练数据集中的数量
   * @param number index 属性名数组索引
   */
  getAttrValue: function(index){
    var map = new HashMap();
    var iter = new Iterator(this._data);
    while(iter.next()){
      var t = iter.current();
      var key = t[index];
      var value = map.get(key);
      map.put(key, value !== undefined ? ++value : 1);
    }
    return map;
  },
  /**
   * 得到属性值在决策空间的比例
   * @param string name 属性值
   * @param number index 属性所在第几列
   */
  getAttrValueTargetValue: function(name, index){
    var map = new HashMap();
    var iter = new Iterator(this._data);
    while(iter.next()){
      var t = iter.current();
      if(name === t[index]){
        var size = t.length;
        var key = t[t.length-1];
        var value = map.get(key);
        map.put(key, value !== undefined ? ++value : 1);
      }
    }
    return map;
  },
  /**
   * 获取特征属性作用于训练数据集后分类出的数据集的熵
   * @param number index 属性名数组索引
   */
  getInfoAttr: function(index){
    var attrValueMap = this.getAttrValue(index);
    var infoA = 0;
    var c = attrValueMap.keys();
    for(var i = 0; i < attrValueMap.size(); i++){
      var size = this._data.length;
      var attrP = attrValueMap.get(c[i]) / size;
      var targetValueMap = this.getAttrValueTargetValue(c[i], index);
      var totalCount = 0 ,valueSum = 0;
      for(var j = 0; j < targetValueMap.size(); j++){
        totalCount += targetValueMap.get(targetValueMap.keys()[j]);
      }
      for(var k = 0; k < targetValueMap.size(); k++){
        var p = targetValueMap.get(targetValueMap.keys()[k]) / totalCount;
        valueSum += (Math.log(p) / Math.LN2) * p;
      }
      infoA += (-1) * attrP * valueSum;
    }
    return infoA;
  },
  /**
   * 获得信息增益量
   */
  getGain: function(index) {
    return this.getEntroy() - this.getInfoAttr(index);
  },
  /**
   * 获取惩罚因子
   */
  getSplitInfo: function(index){
    var map = this.getAttrValue(index);
    var splitA = 0;
    for(var i = 0; i < map.size(); i++){
      var size = this._data.length;
      var attrP = map.get(map.keys()[i]) / size;
      splitA += (-1) * attrP * (Math.log(attrP) / Math.LN2);
    }
    return splitA;
  },
  /**
   * 获得增益率
   */
  getGainRaito: function(index){
    return this.getGain(index) / this.getSplitInfo(index);
  },
  getData4Value: function(attrValue, attrIndex){
    var resultData = new Array();
    var iter = new Iterator(this._data);
    while(iter.next()){
      var temp = iter.current();
      if(temp[attrIndex] === attrValue){
        resultData.push(temp);
      }
    }
    return resultData;
  }
}
// var gain = new InfoGain($data, ['sunny']);

// console.log(gain.getGainRaito(0), gain.getGainRaito(1),gain.getGainRaito(2),gain.getGainRaito(3))
// console.log(gain.getGain(0),gain.getGain(1),gain.getGain(2),gain.getGain(3))
module.exports = InfoGain;