'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react'
import Image from 'next/image'

import { UploadFileApi } from '@/pages/api/uploads'
import AnimationLogin from '../animation/AnimationLogin'
import { showNotify } from './notification/notify-controllers'
import { getImageSize } from '@/utils/general'
import Tooltip from '../Base/ui/Tooltip'
import { formatError } from '@/utils/formatError'
import { Modal } from './ui/Modal/Modal'
import { ModalBody, ModalHeader } from './ui/Modal/ModalCompunds'

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

const DropzoneImage: React.FC<DropzoneImageProps> = ({
  value = [],
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [previewImg, setPreviewImg] = useState<string | null>(null)

  /* ==========================
   * Upload handler
   * ========================== */
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await UploadFileApi(formData)
    if (!res) throw new Error('Upload failed')

    return res.data.url
  }

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      setLoading(true)

      try {
        const uploadedUrls: string[] = []

        for (const file of Array.from(files)) {
          const url = await uploadFile(file)
          uploadedUrls.push(url)
        }

        showNotify({
          type: 'success',
          title: 'Sukses',
          text: 'Gambar berhasil diunggah',
        })

        onChange([...value, ...uploadedUrls])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    },
    [value, onChange]
  )

  const handleEditImage = async (file: File) =>{
    if(editIndex === null) return
    setLoading(true)

    try {
      const newUrl = await uploadFile(file)

      const newValues = [...value]
      newValues[editIndex] = newUrl

      onChange(newValues)

      showNotify({
        type: 'success',
        title: 'Sukses',
        text: 'Gambar berhasil diperbarui'
      })
    } catch(err) {
      showNotify({
        type: 'error',
        title: 'Gagal',
        text: formatError(err)
      })
    } finally {
      setLoading(false)
      setEditIndex(null)
    }
  }

  const handleDelete = (index: number) => {
    const newValues = value.filter((_, i) => i !== index)

    onChange(newValues)

    showNotify({
      type: 'success',
      title: 'Sukses',
      text: 'Gambar Berhasil Dihapus'
    })
  }

  useEffect(() => {
    const loadPreview = async () => {
      const list: PreviewFile[] = await Promise.all(
        value.map(async (url) => ({
          url,
          name: url.split('/').pop() ?? 'image',
          size: await getImageSize(url),
        }))
      )

      setPreviews(list)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    value.length ? loadPreview() : setPreviews([])
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Product Images</label>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-md p-16
                   flex flex-col items-center justify-center cursor-pointer
                   hover:border-amber-800 transition"
      >
        <Icon
          icon="material-symbols:cloud-download-outline-rounded"
          width={40}
          height={40}
        />
        <span className="mt-2 text-sm text-gray-400">
          {loading ? 'Uploading...' : 'Drag & Drop or Click'}
        </span>
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-4 py-4">
          {previews.map((file, index) => (
            <PreviewItem 
              key={index} 
              file={file} 
              onDelete={() => {
                handleDelete(index)
              }}
              onEdit={() => {
                setEditIndex(index)
                editInputRef.current?.click()
              }}
              onView={() => {
                setPreviewImg(file.url)
                setOpenModal(true)
              }}
             /> 
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {loading && <AnimationLogin />}

      <input
        ref={editInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleEditImage(e.target.files[0])
          }
        }}
      />
      <Modal onClose={() => setOpenModal(false)} open={openModal} size='xl' closeOnOverlayClick={false}>
        <ModalHeader>
          <div className='flex justify-between items-center'>
            <h3>Preview Image</h3>
            <div onClick={() => (setOpenModal(false))} className='cursor-pointer'>
              <Tooltip content="Tutup">
                <Icon
                  icon="material-symbols:close-small-outline-rounded"
                  width={36}
                  height={36}
                  style={{ color: '#b63232ff' }} />
              </Tooltip>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          {previewImg && (
            <Image 
              src={previewImg}
              width={800}
              height={800}
              alt='image'
              className="w-full h-auto rounded-lg object-contain"
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  )
}

export default DropzoneImage

const PreviewItem = ({ 
  file, 
  onEdit, 
  onView,
  onDelete } : { 
  file: PreviewFile, 
  onEdit: () => void, 
  onView: () => void,
  onDelete: () => void, }) => (
  <div className="flex max-w-[720px] items-center gap-4 p-3
                  border border-amber-800 rounded-lg shadow">
    <Image
      src={file.url}
      alt={file.name}
      width={72}
      height={72}
      className="object-cover rounded-md"
    />

    <div className="flex flex-col gap-1 flex-1">
      <p className="text-xs text-gray-500 truncate">{file.name}</p>
      <p className="text-xs text-gray-800">{file.size} KB</p>
    </div>

    <div className="flex gap-2">
      <ActionIcon 
        icon="ic:sharp-remove-red-eye" 
        label="Lihat" 
        onClick={onView}/>
      <ActionIcon 
        icon="material-symbols:edit-outline-sharp" 
        label="Edit"
        onClick={onEdit}
        />
      <ActionIcon
        icon="material-symbols:delete-outline"
        label="Hapus"
        color="#DC0000"
        onClick={onDelete}
      />
    </div>
  </div>
)

const ActionIcon = ({
  icon,
  label,
  color = '#3291B6',
  onClick,
}: {
  icon: string
  label: string
  color?: string,
  onClick?: () => void
}) => (
  <Tooltip content={label}>
    <Icon
      icon={icon}
      width={20}
      height={20}
      className="cursor-pointer"
      style={{ color }}
      onClick={onClick}
    />
  </Tooltip>
)
 