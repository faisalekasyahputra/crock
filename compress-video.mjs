import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputFile = path.join(__dirname, 'public', 'hero.mp4');
const outputFile = path.join(__dirname, 'public', 'hero-optimized.mp4');

console.log(`Starting compression: ${inputFile} -> ${outputFile}`);

ffmpeg(inputFile)
  .outputOptions([
    '-c:v libx264',
    '-crf 23',
    '-preset medium',
    '-an' // Remove audio
  ])
  .on('start', (commandLine) => {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  })
  .on('progress', (progress) => {
    console.log('Processing: ' + progress.percent + '% done');
  })
  .on('end', () => {
    console.log('Transcoding finished!');
  })
  .on('error', (err) => {
    console.error('An error occurred: ' + err.message);
    process.exit(1);
  })
  .save(outputFile);
