var split = require('split2')

module.exports = function() {
  var json = function(data) {
    try {
      data = JSON.parse(data)
    } catch (err) {
      return false
    }

    parser.emit('json', data)
    return true
  }

  var errorish = false
  var error = false
  var buffer = ''

  var reset = function() {
    error = errorish = false
    buffer = ''
  }

  var parser = split()

  parser.on('data', function(data) {
    var ch = data[0]
    if (ch === '{' || ch === '[' || ch === '"') {
      if (json(data)) return
    }

    if (errorish && /^\s*at\s/.test(data)) {
      error = true
      buffer += data+'\n'
      return
    }

    if (errorish && error) {
      parser.emit('stack', buffer.trim())
      reset()
    }

    if (errorish) {
      parser.emit('message', buffer.trim())
      reset()
      return
    }

    if (/error:/i.test(data)) {
      errorish = true
      buffer = data+'\n'
      return
    }

    parser.emit('message', data)
  })

  return parser
}