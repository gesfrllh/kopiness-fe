'use client'

import React, { useState, useRef } from 'react'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { UploadFileApi } from '@/pages/api/uploads'

type DropzoneImageProps = {
  value?: string
  onChange: (url: string) => void
  uploadUrl: string
}

const DropzoneImage: React.FC<DropzoneImageProps> = ({ value, onChange, uploadUrl }) => {
  const [preview, setPreview] = useState<string>(value || '')
  const [filename, setFilename] = useState<string>(value || '')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setFilename(file.name)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await UploadFileApi(formData)

      if (!res) throw new Error('Upload failed')
      const data = await res
      onChange(data.url)
    } catch (err) {
      console.error(err)
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
    <div className='flex flex-col gap-2'>
      <label className="block text-sm font-medium mb-1">Product Image</label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="border-dashed border-2 border-gray-300 rounded-md p-16 flex flex-col items-center justify-center cursor-pointer hover:border-amber-800 transition"
      >
        <div className="flex flex-col items-center justify-center text-gray-400">
          <Icon icon="material-symbols:cloud-download-outline-rounded" width={40} height={40} />
          <span className="mt-2 text-gray-400 text-sm">{loading ? 'Uploading...' : 'Drag & Drop or Click'}</span>
        </div>
      </div>

      {preview && (
        <div>
          <Image src={preview} alt="preview" width={40} height={40} className="w-40 h-40 object-cover rounded-md" />
          <p>{filename}</p>
        </div>
      )}

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
