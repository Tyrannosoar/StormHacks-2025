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
    
    // Create temporary file path
    tempAudioPath = join(tmpdir(), `whisper_${Date.now()}.wav`);
    
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
    
    const { stdout, stderr } = await execAsync(whisperRunCommand);
    
    console.log('Whisper stdout:', stdout);
    if (stderr) console.log('Whisper stderr:', stderr);
    
    // Read the output file
    const outputFileName = `whisper_${Date.now()}.txt`;
    const outputPath = join(tmpdir(), outputFileName);
    
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
      return NextResponse.json({ 
        error: 'Could not read whisper output',
        fallback: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Whisper processing error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error',
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
