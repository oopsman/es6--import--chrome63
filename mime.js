// mime.js
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

function getMimeType(res) {
  const EXT_MIME_TYPES = {
    default: 'text/html',
    '.mjs': 'text/javascript',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'text/json',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpg',
    '.png': 'image/png'
  }
  let mime_type = EXT_MIME_TYPES[path.extname(res)] || EXT_MIME_TYPES['default']
  return mime_type
}

const server = http.createServer((req, res) => {
  let srvUrl = url.parse(`http://${req.url}`)
  let path = srvUrl.path
  if (path === '/') path = '/index.html'

  let resPath = '.' + path

  if (!fs.existsSync(resPath)) {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    })
    return res.end('<h1>404 Not Found</h1>')
  }

  let resStream = fs.createReadStream(resPath)
  res.writeHead(200, {
    'Content-Type': getMimeType(resPath)
  })
  resStream.pipe(res)
})

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(3000)