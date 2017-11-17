#!/bin/sh
dp0=$(dirname "$0")/
"${dp0}bin/ffprobe" "$@"
