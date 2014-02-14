var obtree = require('../index.js');
var fixturePath = require('path').resolve(__dirname, 'fixtures');
var assert = require('assert');

obtree(fixturePath,'utf8', function(err, tree){
  assert.deepEqual(tree, {
    boolean: 'true\n',
    empty: '',
    subfolder: {
      'also-empty': '',
      'no-nl': 'no newline',
      url: 'http://www.example.com/\n'}});
});
