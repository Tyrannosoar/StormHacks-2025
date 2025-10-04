"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Camera, RotateCcw, FishOff as FlashOff, SlashIcon as FlashOn } from "lucide-react"

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

  const savePhoto = () => {
    if (capturedImage) {
      // In a real app, you would save to gallery or process the image
      console.log("Saving photo...")
      setCapturedImage(null)
      onClose()
    }
  }

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
            <div className="flex items-center justify-center gap-8">
              <Button
                variant="outline"
                onClick={retakePhoto}
                className="bg-transparent border-white text-white hover:bg-white/20"
              >
                Retake
              </Button>
              <Button onClick={savePhoto} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Save Photo
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
            <p className="text-white text-sm">Tap to capture grocery items</p>
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
