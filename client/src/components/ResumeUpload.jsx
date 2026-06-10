import { useState } from 'react'
import api from '../utils/api'

const ResumeUpload = ({ onUploadSuccess, onClose }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setError('')
    } else {
      setError('Only PDF files are allowed')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped)
      setError('')
    } else {
      setError('Only PDF files are allowed')
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('resume', file)
      const { data } = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onUploadSuccess(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-[#222] rounded-2xl p-8 w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold text-lg">Upload Resume</h2>
            <p className="text-gray-500 text-sm mt-0.5">PDF only, max 5MB</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-all text-xl"
          >
            ✕
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('resumeInput').click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-teal-500 bg-teal-500/5'
              : file
              ? 'border-teal-500/50 bg-teal-500/5'
              : 'border-[#2a2a2a] hover:border-teal-500/50'
          }`}
        >
          <input
            id="resumeInput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <>
              <p className="text-4xl mb-3">📄</p>
              <p className="text-white text-sm font-medium">{file.name}</p>
              <p className="text-gray-500 text-xs mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </>
          ) : (
            <>
              <p className="text-4xl mb-3">📁</p>
              <p className="text-gray-400 text-sm">
                Drag & drop your PDF here
              </p>
              <p className="text-gray-600 text-xs mt-1">or click to browse</p>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mt-3 text-center">⚠️ {error}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 py-3 rounded-xl text-sm hover:border-gray-500 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl text-sm transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Uploading...
              </span>
            ) : 'Upload Resume'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ResumeUpload