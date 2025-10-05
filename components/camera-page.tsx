"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Camera, RotateCcw, FishOff as FlashOff, SlashIcon as FlashOn, FileText, Loader2 } from "lucide-react"

interface CameraPageProps {
  onClose: () => void
}

export function CameraPage({ onClose }: CameraPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isFlashOn, setIsFlashOn] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [ocrResult, setOcrResult] = useState<any>(null)
  const [showOCRResult, setShowOCRResult] = useState(false)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setStream(mediaStream)
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(imageDataUrl)

    // Flash effect
    const flashOverlay = document.createElement("div")
    flashOverlay.style.position = "fixed"
    flashOverlay.style.top = "0"
    flashOverlay.style.left = "0"
    flashOverlay.style.width = "100%"
    flashOverlay.style.height = "100%"
    flashOverlay.style.backgroundColor = "white"
    flashOverlay.style.opacity = "0.8"
    flashOverlay.style.zIndex = "9999"
    flashOverlay.style.pointerEvents = "none"
    document.body.appendChild(flashOverlay)

    setTimeout(() => {
      document.body.removeChild(flashOverlay)
    }, 150)

    // In a real app, you would process the image here
    console.log("Photo captured:", imageDataUrl.substring(0, 50) + "...")
  }

  const switchCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user")
  }

  const toggleFlash = () => {
    setIsFlashOn(!isFlashOn)
    // Note: Flash control requires advanced camera API access
    // This is a UI toggle for demonstration
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  const processOCR = async () => {
    if (!capturedImage) return;

    setIsProcessingOCR(true);
    // Don't reset ocrResult here - keep previous result

    try {
      // Convert data URL to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'recipe.jpg');

      console.log('Starting OCR processing...');

      // Send to OCR API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const ocrResponse = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (ocrResponse.ok) {
        const result = await ocrResponse.json();
        console.log('OCR Result:', result);
        
        // Set the OCR result and show the modal directly
        setOcrResult(result);
        console.log('OCR result set:', result);
        
        // Force immediate state update
        setShowOCRResult(true);
        console.log('Modal should now be visible');
        
        // Force a re-render
        setTimeout(() => {
          console.log('Forcing re-render...');
          setShowOCRResult(false);
          setTimeout(() => setShowOCRResult(true), 50);
        }, 200);
      } else {
        const error = await ocrResponse.json();
        console.error('OCR Error:', error);
        alert('OCR processing failed: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        alert('OCR processing timed out. Please try with a clearer image or smaller file size.');
      } else {
        alert('Error processing image. Please try again.');
      }
    } finally {
      setIsProcessingOCR(false);
    }
  };

  const savePhoto = () => {
    if (capturedImage) {
      // In a real app, you would save to gallery or process the image
      console.log("Saving photo...")
      setCapturedImage(null)
      onClose()
    }
  }

  const addRecipeToSystem = async () => {
    if (!ocrResult?.structuredData) return;

    try {
      const recipeData = {
        title: ocrResult.structuredData.title || 'Recipe from Image',
        image: capturedImage,
        cookTime: ocrResult.structuredData.cookTime || 30,
        servings: ocrResult.structuredData.servings || 4,
        hasAllIngredients: false,
        ingredients: ocrResult.structuredData.ingredients,
        instructions: ocrResult.structuredData.instructions,
        plannedDate: new Date().toISOString().split('T')[0],
        mealType: "dinner" as const,
        isArchived: false
      };

      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData)
      });

      if (response.ok) {
        alert('Recipe added successfully!');
        setShowOCRResult(false);
        setCapturedImage(null);
        setOcrResult(null);
        onClose();
      } else {
        alert('Failed to add recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Error adding recipe. Please try again.');
    }
  };

  if (capturedImage) {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <div className="relative h-full">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Captured Image */}
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-cover" />

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="bg-transparent border-white text-white hover:bg-white/20"
              >
                Retake
              </Button>
              <Button 
                onClick={processOCR}
                disabled={isProcessingOCR}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 flex items-center gap-2"
              >
                {isProcessingOCR ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Text...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Extract Recipe
                  </>
                )}
              </Button>
              <Button 
                onClick={() => {
                  console.log('Manual modal trigger');
                  setShowOCRResult(true);
                  setOcrResult({
                    success: true,
                    extractedText: 'Manual test - this should show the modal',
                    structuredData: { title: 'Test Recipe' },
                    method: 'manual-test'
                  });
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4"
              >
                Test Modal
              </Button>
              <Button onClick={savePhoto} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                Save Photo
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // OCR Result Modal
  console.log('Modal check - showOCRResult:', showOCRResult, 'ocrResult:', ocrResult);
  console.log('Modal condition check:', showOCRResult && ocrResult);
  
  if (showOCRResult && ocrResult) {
    console.log('✅ RENDERING OCR RESULT MODAL');
    return (
      <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowOCRResult(false)}
            className="absolute top-4 right-4 z-10 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full"
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Recipe Extracted from Image</h2>
            
            {/* Confidence Indicator */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                ocrResult.structuredData?.confidence === 'high' ? 'bg-green-100 text-green-800' :
                ocrResult.structuredData?.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Confidence: {ocrResult.structuredData?.confidence || 'unknown'}
              </div>
            </div>

            {/* Recipe Details */}
            <div className="space-y-6">
              {/* Title */}
              {ocrResult.structuredData?.title && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recipe Title</h3>
                  <p className="text-gray-700">{ocrResult.structuredData.title}</p>
                </div>
              )}

              {/* Ingredients */}
              {ocrResult.structuredData?.ingredients?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {ocrResult.structuredData.ingredients.map((ingredient: string, index: number) => (
                      <li key={index} className="text-gray-700">{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {ocrResult.structuredData?.instructions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    {ocrResult.structuredData.instructions.map((instruction: string, index: number) => (
                      <li key={index} className="text-gray-700">{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Raw Text */}
              <div>
                <h3 className="text-lg font-semibold mb-2">📄 What Was Scanned</h3>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap font-mono">{ocrResult.extractedText}</p>
                </div>
              </div>

              {/* Processing Method */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Processing Method:</strong> {ocrResult.method}
                </p>
                {ocrResult.imageInfo && (
                  <div className="mt-2 text-xs text-blue-600">
                    <p><strong>File:</strong> {ocrResult.imageInfo.name}</p>
                    <p><strong>Size:</strong> {ocrResult.imageInfo.size} bytes</p>
                    <p><strong>Type:</strong> {ocrResult.imageInfo.type}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowOCRResult(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={addRecipeToSystem}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add to My Recipes
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="relative h-full">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Camera Controls Top */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFlash}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full"
          >
            {isFlashOn ? <FlashOn className="w-5 h-5" /> : <FlashOff className="w-5 h-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={switchCamera}
            className="bg-black/50 text-white hover:bg-black/70 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Camera View */}
        {error ? (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center text-white p-8">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Camera Access Required</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <Button onClick={startCamera} variant="outline" className="bg-transparent border-white text-white">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
          />
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera Controls Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6">
          <div className="flex items-center justify-center">
            <Button
              onClick={capturePhoto}
              disabled={!!error}
              className="w-20 h-20 rounded-full bg-white hover:bg-gray-200 text-black border-4 border-gray-300 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-400" />
            </Button>
          </div>

          {/* Capture Instructions */}
          <div className="text-center mt-4">
            <p className="text-white text-sm">Tap to capture grocery items or recipe cards</p>
          </div>
        </div>

        {/* Grid Overlay for better composition */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
