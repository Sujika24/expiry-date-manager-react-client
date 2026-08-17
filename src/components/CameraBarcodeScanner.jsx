import React, { useState, useEffect, useRef } from 'react'

function CameraBarcodeScanner({ onDetected, onClose }) {
  const videoRef = useRef(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [stream, setStream] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [detectorSupported, setDetectorSupported] = useState(true)
  const [isScanning, setIsScanning] = useState(true)

  // Start Camera Stream
  useEffect(() => {
    let activeStream = null
    let animationFrameId = null
    let barcodeDetector = null

    const startCamera = async () => {
      try {
        setErrorMsg('')
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        activeStream = mediaStream
        setStream(mediaStream)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          await videoRef.current.play().catch(() => {})
        }

        // Check if native BarcodeDetector API is supported
        if ('BarcodeDetector' in window) {
          try {
            barcodeDetector = new window.BarcodeDetector({
              formats: ['upc_a', 'upc_e', 'ean_13', 'ean_8', 'code_128', 'qr_code'],
            })

            const detectFrame = async () => {
              if (videoRef.current && videoRef.current.readyState === 4) {
                try {
                  const barcodes = await barcodeDetector.detect(videoRef.current)
                  if (barcodes && barcodes.length > 0) {
                    const detectedCode = barcodes[0].rawValue
                    if (detectedCode) {
                      stopCameraStream(activeStream)
                      onDetected(detectedCode)
                      return
                    }
                  }
                } catch (e) {
                  // Frame detection error, continue loop
                }
              }
              animationFrameId = requestAnimationFrame(detectFrame)
            }

            animationFrameId = requestAnimationFrame(detectFrame)
          } catch (err) {
            setDetectorSupported(false)
          }
        } else {
          setDetectorSupported(false)
        }
      } catch (err) {
        console.error('Camera access error:', err)
        setErrorMsg(
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'Camera permission was denied. Please allow camera access in browser settings.'
            : 'Could not access device camera. Please make sure no other app is using it.'
        )
      }
    }

    startCamera()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      stopCameraStream(activeStream)
    }
  }, [facingMode])

  const stopCameraStream = (mediaStream) => {
    const s = mediaStream || stream
    if (s) {
      s.getTracks().forEach((track) => track.stop())
    }
  }

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
  }

  // Simulated Quick Capture Fallback for testing environments
  const handleSimulatedScan = () => {
    const sampleBarcodes = ['012345678905', '890123456789', '078901234567', '045678901234']
    const code = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)]
    stopCameraStream(stream)
    onDetected(code)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl flex flex-col relative">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white tracking-wide">Live Barcode Camera Scanner</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Viewfinder Area */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-slate-300 max-w-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-red-300">{errorMsg}</p>
              <button
                onClick={handleSimulatedScan}
                className="mt-2 text-xs bg-secondary text-white font-bold px-4 py-2 rounded-xl shadow-md hover:bg-secondary-hover transition-all"
              >
                Use Simulated Barcode
              </button>
            </div>
          ) : (
            <>
              {/* Video Element */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Animated Scanner Target Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                <div className="w-64 h-40 border-2 border-secondary rounded-2xl relative shadow-[0_0_20px_rgba(165,94,234,0.4)] bg-secondary/5 overflow-hidden">
                  {/* Laser Scan Line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-secondary-light to-transparent shadow-[0_0_12px_#a55eea] animate-bounce" />
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-secondary rounded-tl-md" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-secondary rounded-tr-md" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-secondary rounded-bl-md" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-secondary rounded-br-md" />
                </div>
              </div>

              {/* Status pill overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-700/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Align UPC barcode inside box</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={toggleCameraFacing}
            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-semibold transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Flip Camera</span>
          </button>

          <button
            onClick={handleSimulatedScan}
            className="px-4 py-2 rounded-xl bg-secondary text-white font-bold hover:bg-secondary-hover transition-all shadow-md flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Mock Barcode Scan</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export default CameraBarcodeScanner
