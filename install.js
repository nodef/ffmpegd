const download = require('download-progress/lib/download-progress');
const unzip = require('unzip');
const cp = require('child_process');
const fs = require('fs');


// 1. settings
const url = {
  'linux': {
    'arm': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-armel-32bit-static.tar.xz',
    'arm64': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-64bit-static.tar.xz',
    'x86': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-32bit-static.tar.xz',
    'x64': 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz'
  },
  'win32': {
    'x86': 'https://ffmpeg.zeranoe.com/builds/win32/shared/ffmpeg-3.2-win32-shared.zip',
    'x64': 'https://ffmpeg.zeranoe.com/builds/win64/shared/ffmpeg-3.2-win64-shared.zip'
  },
  'darwin': {
    'x64': 'https://ffmpeg.zeranoe.com/builds/macos64/shared/ffmpeg-3.2-macos64-shared.zip'
  }
};


try { cp.execSync('ffmpeg --help'); }
catch(e) {
}
