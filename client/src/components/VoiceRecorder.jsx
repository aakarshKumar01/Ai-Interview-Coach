import { useState, useEffect, useRef } from 'react'

const VoiceRecorder = ({ onTranscript, disabled }) => {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
      setListening(false)
    }

    recognition.onerror = () => {
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const toggleListening = () => {
    if (!supported) return

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
    } else {
      recognitionRef.current?.start()
      setListening(true)
    }
  }

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      title={listening ? 'Stop recording' : 'Start voice input'}
      className={`p-3 rounded-xl transition-all ${
        listening
          ? 'bg-red-500 hover:bg-red-400 text-white animate-pulse'
          : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:border-teal-500 hover:text-teal-400'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {listening ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 8a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 0 1 2 0 8 8 0 0 1-7 7.93V21h3a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2h3v-1.07A8 8 0 0 1 4 12a1 1 0 0 1 1-1z"/>
        </svg>
      )}
    </button>
  )
}

export default VoiceRecorder