function TreeNode(nodeName, nodeType){
  this.name = nodeName || null;  
  this.type = nodeType || null;
  this.vals = new Array();
}
TreeNode.prototype = {
  getName: function() {
    return this.attributeValue;
  },
  setName: function(nodeName) {
    this.name = nodeName;
  },
  getType: function() {
    return this.type;
  },
  setType: function(nodeType) {
    this.type = nodeType;
  },
  getVals: function(){
    return this.vals;
  },
  setVals: function(values) {
    this.vals = values;
  },
}

module.exports = TreeNode;