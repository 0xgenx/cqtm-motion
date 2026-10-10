#!/bin/bash
set -e
cd "$(dirname "$0")"

FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

ffmpeg -y \
  -i clips/01_surimi_intro.mp4 \
  -i clips/02_160c.mp4 \
  -i clips/03_e420.mp4 \
  -i clips/04_e452.mp4 \
  -i clips/05_e451.mp4 \
  -i clips/06_surimi_outro.mp4 \
  -filter_complex "
[0:v]scale=1088:1920:force_original_aspect_ratio=increase,crop=1088:1920,setsar=1,fps=24[v0];
[1:v]scale=1088:1920:force_original_aspect_ratio=increase,crop=1088:1920,setsar=1,fps=24[v1];
[2:v]scale=1088:1920:force_original_aspect_ratio=increase,crop=1088:1920,setsar=1,fps=24[v2];
[3:v]scale=1088:1920:force_original_aspect_ratio=increase,crop=1088:1920,setsar=1,fps=24[v3];
[4:v]scale=1088:1920:force_original_aspect_ratio=increase,crop=1088:1920,setsar=1,fps=24[v4];
[5:v]scale=1088:1920:force_original_aspect_ratio=increase,crop=1088:1920,setsar=1,fps=24[v5];
[v0][v1]xfade=transition=fade:duration=0.5:offset=9.541667[vx01];
[vx01][v2]xfade=transition=fade:duration=0.5:offset=19.083334[vx012];
[vx012][v3]xfade=transition=fade:duration=0.5:offset=28.625001[vx0123];
[vx0123][v4]xfade=transition=fade:duration=0.5:offset=31.333334[vx01234];
[vx01234][v5]xfade=transition=fade:duration=0.5:offset=38.625001[vfade];
[0:a][1:a]acrossfade=d=0.5[a01];
[a01][2:a]acrossfade=d=0.5[a012];
[a012][3:a]acrossfade=d=0.5[a0123];
[a0123][4:a]acrossfade=d=0.5[a01234];
[a01234][5:a]acrossfade=d=0.5[aout];
[vfade]drawtext=fontfile=${FONT}:text='SURIMI':fontsize=54:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=60:y=h-220:enable='between(t,0.3,9.4)',
drawtext=fontfile=${FONT}:text='E160c — Extrait de paprika':fontsize=46:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=60:y=h-220:enable='between(t,9.9,19.0)',
drawtext=fontfile=${FONT}:text='E420 — Sorbitol':fontsize=46:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=60:y=h-220:enable='between(t,19.4,28.5)',
drawtext=fontfile=${FONT}:text='E452 — Polyphosphates':fontsize=46:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=60:y=h-220:enable='between(t,28.9,31.2)',
drawtext=fontfile=${FONT}:text='E451 — Triphosphates':fontsize=46:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=60:y=h-220:enable='between(t,31.6,38.6)',
drawtext=fontfile=${FONT}:text='SURIMI':fontsize=54:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=18:x=60:y=h-220:enable='between(t,39.1,108.9)'[vfinal]
" \
  -map "[vfinal]" -map "[aout]" \
  -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k \
  out/surimi_assembled.mp4
