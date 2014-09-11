var split = require('split2')

module.exports = function(opts) {
  if (!opts) opts = {}

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
    buffer = prevBuffer = ''
  }

  var timeout
  var wait = function() {
    var prevBuffer = buffer
    var ms = opts.wait || 1000

    var check = function() {
      if (prevBuffer === buffer && buffer) ondata('')
    }

    clearTimeout(timeout)
    timeout = setTimeout(check, ms)
  }

  var ondata = function(data) {
    var ch = data[0]
    if (ch === '{' || ch === '[' || ch === '"') {
      if (json(data)) return
    }

    if (errorish && /^\s*at\s/.test(data)) {
      error = true
      buffer += data+'\n'
      return wait()
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
      return wait()
    }

    if (data) parser.emit('message', data)
  }

  var onclose = function() {
    ondata('')
    clearTimeout(timeout)
  }

  var parser = split()
  parser.on('data', ondata)
  parser.on('end', onclose)
  parser.on('close', onclose)
  return parser
}