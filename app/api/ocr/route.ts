import { NextRequest, NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';

export async function POST(request: NextRequest) {
  let worker;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Please use an image smaller than 10MB.' }, { status: 400 });
    }

    console.log('Processing OCR for file:', file.name, file.size, 'bytes');

    // Convert file to buffer for Tesseract
    const buffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    
    // Preprocess image for better OCR (resize if too large)
    const maxSize = 2000; // Max width or height
    let processedBuffer = imageBuffer;
    
    // For very large images, we could add image resizing here
    // This helps with OCR speed and accuracy
    
    // Create Tesseract worker with optimized settings for speed
    worker = await createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    
    // Set worker parameters for faster processing
    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?;:()[]{}"\'/\\-+=*&%$#@^~`|<> ',
      tessedit_pageseg_mode: '6', // Uniform block of text
      tessedit_ocr_engine_mode: '1', // Neural nets LSTM engine only
      tessedit_do_invert: '0', // Don't invert image
      classify_enable_learning: '0', // Disable learning for speed
      textord_heavy_nr: '1', // Heavy text line normalization
    });
    
    // Perform OCR with shorter timeout for better UX
    console.log('Starting OCR processing...');
    const ocrPromise = worker.recognize(processedBuffer);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OCR processing timeout')), 15000); // 15 second timeout
    });
    
    const { data: { text, confidence } } = await Promise.race([ocrPromise, timeoutPromise]) as any;
    
    console.log('OCR completed. Confidence:', confidence);
    console.log('Extracted text length:', text.length);
    
    // Check if we got any meaningful text
    if (!text || text.trim().length < 3) {
      return NextResponse.json({
        success: false,
        error: 'No text detected in image. Please try with a clearer image or different text.',
        extractedText: text || '',
        structuredData: {
          title: 'No text detected',
          ingredients: [],
          instructions: [],
          cookTime: 0,
          servings: 0,
          confidence: 'low'
        }
      });
    }
    
    // Structure the extracted text as recipe data
    const structuredData = structureRecipeText(text);
    
    // Add confidence from OCR
    structuredData.confidence = confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low';
    
    return NextResponse.json({
      success: true,
      extractedText: text,
      structuredData: structuredData,
      method: 'tesseract-ocr',
      confidence: confidence,
      imageInfo: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('OCR processing error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json({ 
          error: 'OCR processing timed out. Please try with a smaller or clearer image.',
          details: error.message
        }, { status: 408 });
      }
      if (error.message.includes('memory') || error.message.includes('allocation')) {
        return NextResponse.json({ 
          error: 'Image too large for processing. Please try with a smaller image.',
          details: error.message
        }, { status: 413 });
      }
    }
    
    return NextResponse.json({ 
      error: 'OCR processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    // Clean up worker
    if (worker) {
      try {
        await worker.terminate();
      } catch (cleanupError) {
        console.error('Error terminating worker:', cleanupError);
      }
    }
  }
}

function structureRecipeText(text: string) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Initialize structured data
  const recipeData = {
    title: '',
    ingredients: [] as string[],
    instructions: [] as string[],
    cookTime: 0,
    servings: 0,
    confidence: 'medium' as 'low' | 'medium' | 'high'
  };

  let currentSection = '';
  let foundIngredients = false;
  let foundInstructions = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    // Detect recipe title (usually first line or after "recipe:")
    if (i === 0 || line.includes('recipe:') || line.includes('title:')) {
      if (line.includes('recipe:') || line.includes('title:')) {
        recipeData.title = lines[i].replace(/^(recipe:|title:)\s*/i, '').trim();
      } else if (i === 0) {
        recipeData.title = lines[i];
      }
      continue;
    }

    // Detect ingredients section
    if (line.includes('ingredients') || line.includes('ingredient')) {
      currentSection = 'ingredients';
      foundIngredients = true;
      continue;
    }

    // Detect instructions section
    if (line.includes('instructions') || line.includes('directions') || line.includes('method') || line.includes('steps')) {
      currentSection = 'instructions';
      foundInstructions = true;
      continue;
    }

    // Detect cook time
    if (line.includes('time') || line.includes('minutes') || line.includes('hours')) {
      const timeMatch = lines[i].match(/(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/i);
      if (timeMatch) {
        recipeData.cookTime = parseInt(timeMatch[1]);
        if (line.includes('hour')) {
          recipeData.cookTime *= 60; // Convert hours to minutes
        }
      }
    }

    // Detect servings
    if (line.includes('servings') || line.includes('serves')) {
      const servingMatch = lines[i].match(/(\d+)\s*(?:servings?|serves?|people)/i);
      if (servingMatch) {
        recipeData.servings = parseInt(servingMatch[1]);
      }
    }

    // Add to appropriate section
    if (currentSection === 'ingredients' && foundIngredients) {
      // Skip section headers
      if (!line.includes('ingredients') && !line.includes('ingredient')) {
        recipeData.ingredients.push(lines[i]);
      }
    } else if (currentSection === 'instructions' && foundInstructions) {
      // Skip section headers
      if (!line.includes('instructions') && !line.includes('directions') && !line.includes('method') && !line.includes('steps')) {
        recipeData.instructions.push(lines[i]);
      }
    }
  }

  // If no clear sections found, try to intelligently parse
  if (!foundIngredients && !foundInstructions) {
    // Look for common patterns
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Ingredients often contain measurements or food items
      if (line.match(/\d+\s*(?:cups?|tbsp|tsp|oz|lb|g|kg|ml|l|pounds?|ounces?)/i) || 
          line.match(/(?:salt|pepper|oil|butter|flour|sugar|eggs?|milk|cheese)/i)) {
        recipeData.ingredients.push(line);
      }
      // Instructions often contain action words
      else if (line.match(/(?:mix|stir|add|heat|cook|bake|fry|boil|chop|cut|slice)/i)) {
        recipeData.instructions.push(line);
      }
    }
  }

  // Set confidence based on how much data we extracted
  if (recipeData.title && recipeData.ingredients.length > 0 && recipeData.instructions.length > 0) {
    recipeData.confidence = 'high';
  } else if (recipeData.title || recipeData.ingredients.length > 0 || recipeData.instructions.length > 0) {
    recipeData.confidence = 'medium';
  } else {
    recipeData.confidence = 'low';
  }

  // Set defaults if not found
  if (!recipeData.cookTime) recipeData.cookTime = 30;
  if (!recipeData.servings) recipeData.servings = 4;

  return recipeData;
}
