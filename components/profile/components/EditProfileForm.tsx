'use client'

import React, { useState } from 'react'
import { User } from '@/types/auth/user'
import { showNotify } from '@/components/Base/notification/notify-controllers'
import FormInput from '@/components/Base/FormInput'
import FormGroup from '@/components/Base/FormGroup'
import Button from '@/components/Base/Button'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface EditProfileFormProps {
  user: User
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        showNotify({ type: 'error', text: 'Name is required' })
        return
      }

      if (!formData.email.trim()) {
        showNotify({ type: 'error', text: 'Email is required' })
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        showNotify({ type: 'error', text: 'Please enter a valid email' })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      showNotify({ type: 'success', text: 'Profile updated successfully' })

      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      showNotify({ type: 'error', text: 'Failed to update profile' })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Profile Updated</h3>
              <p className="text-sm text-green-800">Your profile information has been successfully updated.</p>
            </div>
          </div>
        )}

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-blue-800">
            Update your name and email address. These changes will be reflected across your account.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <FormGroup label="Full Name">
            <FormInput
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>

          <FormGroup label="Email Address">
            <FormInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </FormGroup>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            type="submit"
            variant="solid"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: user.name || '',
                email: user.email || '',
              })
            }}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Additional Info */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Profile Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Use your real name for better account security</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Keep your email address up to date for account recovery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Changes take effect immediately after saving</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default EditProfileForm
