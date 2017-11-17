const download = require('download-progress/lib/download-progress');
const unzip = require('unzip');
const cp = require('child_process');
const fs = require('fs');
const os = require('os');


// I. settings
const ARCH = {'ia32': 'x86', 'x32': 'x86'};
const URL = {
  'linux': {
    'arm': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-armel-32bit-static.tar.xz',
    'arm64': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-64bit-static.tar.xz',
    'x86': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-32bit-static.tar.xz',
    'x64': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz'
  },
  'win32': {
    'x86': 'https://ffmpeg.zeranoe.com/builds/win32/shared/ffmpeg-3.2.4-win32-shared.zip',
    'x64': 'https://ffmpeg.zeranoe.com/builds/win64/shared/ffmpeg-3.2.4-win64-shared.zip'
  },
  'darwin': {
    'x64': 'https://ffmpeg.zeranoe.com/builds/macos64/shared/ffmpeg-3.2-macos64-shared.zip'
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
  const url = ffmpegUrl(), dest = 'index.zip';
  download([{url, dest}], {}).get((err) => {
    var wrt = unzip.Extract({'path': '.'});
    fs.createReadStream(dest).pipe(wrt);
    wrt.on('close', () => ffmpegPrepare(dest));
  });
}
