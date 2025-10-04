import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  let tempAudioPath = '';
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Received audio file:', file.size, 'bytes');

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const audioBuffer = Buffer.from(buffer);
    
    // Create temporary file path (WebM format)
    tempAudioPath = join(tmpdir(), `whisper_${Date.now()}.webm`);
    
    // Write audio buffer to temporary file
    await writeFile(tempAudioPath, audioBuffer);
    
    console.log('Audio file saved to:', tempAudioPath);
    
    // Check if whisper is installed (try multiple paths)
    let whisperCommand = 'whisper';
    let whisperFound = false;
    
    // Try different whisper paths
    const whisperPaths = [
      'whisper',
      '/Library/Frameworks/Python.framework/Versions/3.12/bin/whisper',
      './whisper-env/bin/whisper',
      'source whisper-env/bin/activate && whisper'
    ];
    
    for (const path of whisperPaths) {
      try {
        // Whisper doesn't have --version, so we'll check with --help
        await execAsync(`${path} --help`);
        whisperCommand = path;
        whisperFound = true;
        console.log('Found whisper at:', path);
        break;
      } catch (error) {
        console.log('Whisper not found at:', path);
      }
    }
    
    if (!whisperFound) {
      console.error('Whisper not found. Please install with: pip install openai-whisper');
      return NextResponse.json({ 
        error: 'Whisper not installed. Please run: ./install-whisper.sh',
        fallback: true
      }, { status: 500 });
    }
    
    // Run whisper on the audio file
    // Using base model for speed, English language
    const whisperRunCommand = `${whisperCommand} "${tempAudioPath}" --model base --language en --output_format txt --output_dir "${tmpdir()}"`;
    
    console.log('Running whisper command:', whisperRunCommand);
    
    let stdout, stderr;
    try {
      const result = await execAsync(whisperRunCommand);
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (whisperError) {
      console.error('Whisper command failed:', whisperError);
      // Try with different audio format if WebM fails
      const wavPath = tempAudioPath.replace('.webm', '.wav');
      const convertCommand = `ffmpeg -i "${tempAudioPath}" "${wavPath}" -y`;
      console.log('Converting audio with ffmpeg:', convertCommand);
      
      try {
        await execAsync(convertCommand);
        const wavWhisperCommand = `${whisperCommand} "${wavPath}" --model base --language en --output_format txt --output_dir "${tmpdir()}"`;
        console.log('Running whisper on converted WAV:', wavWhisperCommand);
        const result = await execAsync(wavWhisperCommand);
        stdout = result.stdout;
        stderr = result.stderr;
        // Clean up converted file
        await unlink(wavPath);
      } catch (convertError) {
        console.error('Audio conversion failed:', convertError);
        throw whisperError; // Re-throw original error
      }
    }
    
    console.log('Whisper stdout:', stdout);
    if (stderr) console.log('Whisper stderr:', stderr);
    
    // Read the output file - Whisper creates a file with the same name as input but .txt extension
    const inputFileName = tempAudioPath.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'whisper';
    const outputFileName = `${inputFileName}.txt`;
    const outputPath = join(tmpdir(), outputFileName);
    
    console.log('Looking for output file:', outputPath);
    
    try {
      const fs = await import('fs/promises');
      const transcription = await fs.readFile(outputPath, 'utf-8');
      
      // Clean up output file
      await unlink(outputPath);
      
      console.log('Transcription result:', transcription);
      
      return NextResponse.json({ 
        text: transcription.trim(),
        method: 'python-whisper'
      });
      
    } catch (readError) {
      console.error('Error reading whisper output:', readError);
      
      // List files in temp directory to see what was actually created
      try {
        const fs = await import('fs/promises');
        const files = await fs.readdir(tmpdir());
        console.log('Files in temp directory:', files);
        
        // Look for any .txt files that might be the output
        const txtFiles = files.filter(f => f.endsWith('.txt'));
        console.log('Text files found:', txtFiles);
        
        if (txtFiles.length > 0) {
          // Try to read the first .txt file found
          const firstTxtFile = join(tmpdir(), txtFiles[0]);
          console.log('Trying to read:', firstTxtFile);
          const transcription = await fs.readFile(firstTxtFile, 'utf-8');
          await fs.unlink(firstTxtFile); // Clean up
          
          return NextResponse.json({ 
            text: transcription.trim(),
            method: 'python-whisper'
          });
        }
      } catch (listError) {
        console.error('Error listing temp directory:', listError);
      }
      
      return NextResponse.json({ 
        error: 'Could not read whisper output. Check server logs for details.',
        details: `Expected file: ${outputPath}. Error: ${readError instanceof Error ? readError.message : 'Unknown error'}`,
        fallback: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Whisper processing error:', error);
    
    // Check if it's an ffmpeg error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('ffmpeg') || errorMessage.includes('FileNotFoundError')) {
      return NextResponse.json({ 
        error: 'ffmpeg is not installed', 
        details: 'Whisper requires ffmpeg to process audio. Please install it: brew install ffmpeg (macOS) or apt install ffmpeg (Ubuntu)',
        fallback: true
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: errorMessage,
      fallback: true
    }, { status: 500 });
  } finally {
    // Clean up temporary audio file
    if (tempAudioPath) {
      try {
        await unlink(tempAudioPath);
        console.log('Cleaned up temporary file:', tempAudioPath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
  }
}
