const cp = require('child_process');


try { cp.execSync('ffmpeg --help'); }
catch(e) {
}
