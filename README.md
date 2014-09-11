# log-parser

Parse a log stream that contains JSON, error stacks or simple messages

```
npm install log-parser
```

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