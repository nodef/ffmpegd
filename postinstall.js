const download = require('download-progress/lib/download-progress');
const unzip = require('unzipper');
const cp = require('child_process');
const tar = require('tar');
const fs = require('fs');
const os = require('os');


// I. settings
const ARCH = {'ia32': 'x86', 'x32': 'x86'};
const URL = {
  'linux': {
    'arm':   'https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-armhf-static.tar.xz',
    'arm64': 'https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-arm64-static.tar.xz',
    'x86':   'https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-i686-static.tar.xz',
    'x64':   'https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz  '
  },
  'win32': {
    'x86': 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip',
    'x64': 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'
  },
  'darwin': {
    'x64': 'https://evermeet.cx/ffmpeg/ffmpeg-4.4.zip'
  }
};


function ffmpegUrl() {
  // 1. get download url
  var platform = os.platform();
  if(!URL.hasOwnProperty(platform)) platform = 'linux';
  var arch = os.arch();
  arch = ARCH[arch]||arch;
  return URL[platform][arch];
};

function ffmpegFile(url) {
  // 1. get filename from url
  var i = url.lastIndexOf('/');
  return url.substring(i+1);
};

function ffmpegExtract(dest, fn) {
  // 1. extract ffmpeg
  if(dest.indexOf('.tar')>=0) return tar.extract({'file': dest}).then(fn);
  var wrt = unzip.Extract({'path': '.'});
  fs.createReadStream(dest).pipe(wrt);
  wrt.on('close', fn);
};

function ffmpegDir() {
  // 1. get ffmpeg extract directory
  var dirs = fs.readdirSync('.');
  return dirs.filter(nam => nam.startsWith('ffmpeg-'));
};

function ffmpegPrepare(dest) {
  // 1. prepare directory
  var dir = ffmpegDir();
  cp.execSync(
    `rm -rf node_modules && `+
    `rm ${dest} && `+
    `mv ${dir}/* . && `+
    `rmdir ${dir}`
  );
  // 2. link ffmpeg to PATH
  if(os.EOL!=='\n') cp.execSync('rm *.sh');
  else cp.execSync(
    'mv ffmpeg.sh ffmpeg.cmd && '+
    'mv ffplay.sh ffplay.cmd && '+
    'mv ffprobe.sh ffprobe.cmd && '+
    'chmod +x *.cmd'
  );
};


// II. download "ffmpeg"
// 1. is it installed?
try { cp.execSync('ffmpeg --help', {'stdio': []}); }
catch(e) {
  // 2. download and extract
  var url = ffmpegUrl();
  var dest = ffmpegFile(url).replace('ffmpeg-', '');
  download([{url, dest}], {}).get((err) => {
    ffmpegExtract(dest, () => ffmpegPrepare(dest));
  });
}
