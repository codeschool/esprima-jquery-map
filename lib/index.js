var $ = require('jquery-browserify');
var esprima = require('esprima');
var estraverse = require('estraverse');

module.exports = function(code) {
  var context, jdom, parseTree;
  jdom = $('<esprima></esprima>');
  context = jdom.first();
  parseTree = esprima.parse(code);

  estraverse.traverse(parseTree, {
    leave: function(node) {
      return context = context.parent();
    },
    enter: function(node, parent) {
      var currentNode, values;
      values = {};
      _.each(_.keys(node), function(key) {
        if ((key !== 'type' && key !== 'each') && !_.isObject(node[key])) {
          return values[key] = node[key];
        }
      });
      currentNode = $('<' + node.type + '></' + node.type + '>', values);
      context.append(currentNode);
      return context = currentNode;
    }
  });
  return jdom;
}