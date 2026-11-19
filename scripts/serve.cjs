const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.gif':'image/gif', '.svg':'image/svg+xml', '.mp4':'video/mp4', '.mp3':'audio/mpeg' };
function createServer(root) {
  return http.createServer((req,res) => {
    try {
      let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
      if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      if (fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
      const size = fs.statSync(file).size;
      const headers = {'Content-Type':types[path.extname(file).toLowerCase()] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
      let start=0,end=size-1,status=200;
      if (req.headers.range) {
        const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        if (!match || (!match[1] && !match[2])) {res.writeHead(416,{'Content-Range':'bytes */'+size}).end();return;}
        start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
        end=match[1]&&match[2]?Math.min(size-1,Number(match[2])):size-1;
        if(start>end || start>=size){res.writeHead(416,{'Content-Range':'bytes */'+size}).end();return;}
        status=206;headers['Content-Range']=`bytes ${start}-${end}/${size}`;
      }
      headers['Content-Length']=Math.max(0,end-start+1);
      res.writeHead(status,headers);
      if(req.method==='HEAD'||size===0)res.end();else fs.createReadStream(file,{start,end}).pipe(res);
    } catch {res.writeHead(404).end();}
  });
}
module.exports=createServer;
if(require.main===module){const port=Number(process.env.PORT)||4174;createServer(path.resolve(__dirname,'..')).listen(port,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:'+port));}
