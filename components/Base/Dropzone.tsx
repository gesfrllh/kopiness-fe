'use client'

import React, { useState, useRef } from 'react'
import { Icon } from '@iconify/react'

type DropzoneImageProps = {
  value?: string
  onChange: (url: string) => void
  uploadUrl: string // endpoint BE untuk upload
}

const DropzoneImage: React.FC<DropzoneImageProps> = ({ value, onChange, uploadUrl }) => {
  const [preview, setPreview] = useState<string>(value || '')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file)) // preview sementara
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      // asumsikan backend balikin { url: string }
      onChange(data.url)
      setPreview(data.url) // update preview ke URL backend
    } catch (err) {
      console.error(err)
      alert('Upload gagal')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const dt = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileChange(dt)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Product Image</label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="border-dashed border-2 border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition"
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded-md" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Icon icon="material-symbols:cloud-upload-outline" width={40} />
            <span className="mt-2 text-sm">{loading ? 'Uploading...' : 'Drag & Drop or Click'}</span>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  )
}

export default DropzoneImage
