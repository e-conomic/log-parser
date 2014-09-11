var tape = require('tape')
var parser = require('./')

tape('parses multiple messages', function(t) {
  var parse = parser()

  var expects = [
    {hello: 'world'},
    'hello you',
    [{hello:'world'}],
    new Error('lol').stack,
    'and another one'
  ]

  var data = expects.slice()

  t.plan(expects.length)

  parse
    .on('message', function(message) {
      t.same(message, expects.shift())
    })
    .on('json', function(json) {
      t.same(json, expects.shift())
    })
    .on('stack', function(stack) {
      t.same(stack, expects.shift())
    })

  parse.write(JSON.stringify(data[0])+'\n')
  parse.write(data[1]+'\n')
  parse.write(JSON.stringify(data[2])+'\n')
  parse.write(data[3]+'\n')
  parse.write(data[4]+'\n')
  parse.end()
})

tape('single error', function(t) {
  var parse = parser({wait:10})

  parse.on('stack', function() {
    t.ok(true, 'had stack')
    t.end()
  })

  parse.write(new Error('lol').stack+'\n')
})

tape('single error like message', function(t) {
  var parse = parser()

  parse.on('message', function(message) {
    t.same(message, 'error: lol', 'had message')
    t.end()
  })

  parse.write('error: lol')
  parse.end()
})