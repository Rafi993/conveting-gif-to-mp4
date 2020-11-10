import FFmpeg from '@ffmpeg/ffmpeg';
import { even } from 'prelude-ls';

const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: true });

document
  .getElementById('fileInput')
  .addEventListener('change', async ({ target: { files } }) => {
    const { name } = files[0];
    await ffmpeg.load();
    ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
    await ffmpeg.run('-f', 'gif', '-i', name, 'output.mp4');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    const video = document.getElementById('player');
    video.src = URL.createObjectURL(
      new Blob([data.buffer], { type: 'video/mp4' }),
    );
  });
