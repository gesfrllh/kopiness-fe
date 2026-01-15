'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { UploadFileApi } from '@/pages/api/uploads'
import AnimationLogin from '../animation/AnimationLogin'
import { showNotify } from './notification/notify-controllers'
import { getImageSize } from '@/utils/general'

type DropzoneImageProps = {
  value?: string[]
  onChange: (urls: string[]) => void
  uploadUrl: string
}

type PreviewFile = {
  url: string
  name: string
  size: string
}

const DropzoneImage: React.FC<DropzoneImageProps> = ({ value = [], onChange }) => {
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [loading, setLoading] = useState(false)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await UploadFileApi(formData)
    if (!res) throw new Error('Upload failed')

    const data = await res
    return data.url as string
  }

  const handleFiles = async (fileList: FileList | File[]) => {
    setLoading(true)

    try {
      const newFiles: PreviewFile[] = []
      const uploadedUrls: string[] = []

      for (const file of Array.from(fileList)) {
        const sizeKB = (file.size / 1024).toFixed(2)

        newFiles.push({
          url: URL.createObjectURL(file),
          name: file.name,
          size: sizeKB,
        })

        const url = await uploadFile(file)
        uploadedUrls.push(url)
      }

      showNotify({
        type: 'success',
        title: 'Sukses',
        text: 'Gambar berhasil diunggah',
      });
      setFiles(prev => [...prev, ...newFiles])
      onChange([...value, ...uploadedUrls])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadFromValue = async () => {
      const list = await Promise.all(
        value.map(async(url) => ({
          url,
          name: url.split('/').pop() ?? 'image',
          size: await getImageSize(url)
        }))
      )

      setPreviews(list)
    }
    if(value.length) loadFromValue()
    else setPreviews([])
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    handleFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium mb-1">Product Images</label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-dashed border-2 border-gray-300 rounded-md p-16 flex flex-col items-center justify-center cursor-pointer hover:border-amber-800 transition"
      >
        <Icon icon="material-symbols:cloud-download-outline-rounded" width={40} height={40} />
        <span className="mt-2 text-sm text-gray-400">
          {loading ? 'Uploading...' : 'Drag & Drop or Click'}
        </span>
      </div>
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-4 py-4">
          {previews.map((file, index) => (
            <div
              key={index}
              className="flex w-[320px] border border-amber-800 gap-4 p-3 shadow rounded-lg"
            >
              <Image
                src={file.url}
                alt="preview"
                width={72}
                height={72}
                className="object-cover rounded-md"
              />
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500">{file.name}</p>
                <p className="text-xs text-gray-800">{file.size} KB</p>
              </div>
              <div>
                <Icon icon="material-symbols:cloud-download-outline-rounded" width={40} height={40} />
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />

      {loading ? <AnimationLogin /> : ''}

    </div>
  )
}

export default DropzoneImage
