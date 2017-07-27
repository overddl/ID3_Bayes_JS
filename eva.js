var $data = require('./data');

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

function Evaluate(data) {
  if(!(data instanceof Array)){
    throw new Error('arguments need Array');
  }
  this._data = data;
  this._train = new Array();
  this._test = new Array();
  this.sampling();
  // console.log(this._data);
}
Evaluate.prototype.sampling = function(){
  var iter = new Iterator(this._data), i = 1;
  while(iter.next()){
    iter.current().push(i)
    iter.current().push(0);
    i++;
  }
  while(i !== 2){
    var rand_length = Math.ceil(Math.random() * 100);
    var rand_arr = new Array();
    for(var j = 0; j < rand_length; j++){
      var rand_index = Math.floor(Math.random() * 100);
      rand_arr.push(rand_index);
    }
    for(; j > 0; j--){
      var t = this._data[rand_arr[j-1]];
      t[t.length-1]++;
      this._data.splice[rand_arr[j], 1, t];
    }
    i--;
  }
}
Evaluate.prototype.result = function() {
  this._train = this._data.filter(function(arr){
    return arr[arr.length-1] > 44;
  });
  this._test = this._data.filter(function(arr){
    return arr[arr.length-1] <= 44;
  });
  this._train.forEach(function(item) {
    item.splice(item.length-2, 2);
  });
  this._test.forEach(function(item) {
    item.splice(item.length-2, 2);
  });
  console.log(this._train.length);
  console.log('*****************');
  console.log(this._test.length)
  return {
    train: this._train,
    trainLen: this._train.length,
    test: this._test,
    testLen: this._test.length
  }
}
Evaluate.prototype.getMatrix = function(model, testData) {
  var data = testData.slice(0);
  if(typeof model !== 'object'){
    throw new Error('method need a model!');
  };
  var eva_matrix = [[0,0],[0,0]];
  var iter = new Iterator(data);
  while(iter.next()){
    var test = iter.current();
    var true_res = test.splice(test.length-1, 1)[0];
    var pred_res = model.predictClass(test);
    if(pred_res === 'YES' && true_res === 'YES'){
      eva_matrix[0][0]++;
    }else if(pred_res === 'YES' && true_res === 'NO'){
      eva_matrix[1][0]++;
    }else if(pred_res === 'NO' && true_res === 'YES'){
      eva_matrix[0][1]++;
    }else if(pred_res === 'NO' && true_res === 'NO'){
      eva_matrix[1][1]++;
    };
    test.push(true_res);
  }
  return eva_matrix;
}
Evaluate.prototype.calcRate = function(matrix){
  var tpr = matrix[0][0] / (matrix[0][0] + matrix[0][1]);
  var fpr = matrix[1][0] / (matrix[1][0] + matrix[1][1]);
  return [fpr.toFixed(2), tpr.toFixed(2)];
}

module.exports = Evaluate;
