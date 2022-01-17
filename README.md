Archived
======
Tech Leads: Repository archived due to inactivity in more than 6 months.
Please remember to add a CODEOWNERS file to the root of the repository when unarchiving.

# log-parser

A log stream (e.g stdout) often contains different kinds of stuff. JSON, errors stacks, and just simple messages.

log-parser tries to make sense of this and split them up in a way that makes it easier to use.

```
npm install log-parser
```

[![build status](http://img.shields.io/travis/e-conomic/log-parser.svg?style=flat)](http://travis-ci.org/e-conomic/log-parser)

## Usage

``` js
var parser = require('log-parser')
var parse = parser()

parse.write(JSON.stringify({hello:'world'})+'\n')
parse.write('hello you\n')
parse.write(JSON.stringify([{hello:'world'}])+'\n')
parse.write(new Error('lol').stack+'\n')
parse.write('and another one\n')

parse
  .on('message', function(message) {
    console.log('message:', message)
  })
  .on('json', function(json) {
    console.log('json:', json)
  })
  .on('stack', function(stack) {
    console.log('stack:', stack)
  })
```

## License

MIT
