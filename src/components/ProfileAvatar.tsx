import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, X, Check, Loader2, User } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { uploadToCloudinary } from '../utils/cloudinary';

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  className?: string;
}

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  size = 'md',
  editable = false,
  className = '',
}) => {
  const { currentUser, updateUserProfile } = useMovies();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAvatarUrl = currentUser?.avatarUrl || DEFAULT_AVATAR;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  }[size];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const maxMB = 5;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Image size must be less than ${maxMB}MB.`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    setError(null);

    try {
      let finalUrl = previewUrl;

      if (selectedFile) {
        try {
          finalUrl = await uploadToCloudinary(selectedFile);
        } catch (err) {
          console.warn('Cloudinary upload fallback to local data URL:', err);
          finalUrl = previewUrl; // Fallback to Base64 data URL
        }
      }

      updateUserProfile({ avatarUrl: finalUrl });
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err.message || 'Failed to upload profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    updateUserProfile({ avatarUrl: DEFAULT_AVATAR });
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <>
      <div className={`relative inline-block ${className}`}>
        {/* Avatar Image Circle */}
        <div className={`relative rounded-full overflow-hidden border-2 border-[#FF0E25]/80 shadow-md ${sizeClasses}`}>
          <img
            src={currentAvatarUrl}
            alt={currentUser?.username || 'User Profile'}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
        </div>

        {/* Edit Button Overlay */}
        {editable && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#FF0E25] hover:bg-[#C80016] text-white shadow-lg border border-black/40 transition-transform hover:scale-110"
            title="Edit Profile Photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Edit Profile Photo Selection Modal Interface */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121620] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl relative">

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#FF0E25]" /> Change Profile Photo
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold text-center">
                {error}
              </div>
            )}

            {/* Instant Image Preview Area */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FF0E25] shadow-xl bg-black">
                <img
                  src={previewUrl || currentAvatarUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] text-[#9E9EA0] font-medium">
                {previewUrl ? 'Previewing New Image' : 'Current Avatar'}
              </span>
            </div>

            {/* Hidden Input File Picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="space-y-2 text-xs">
              {previewUrl ? (
                <button
                  onClick={handleSavePhoto}
                  disabled={isUploading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF0E25] to-[#C80016] text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#FF0E25]/30 hover:opacity-90 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading Photo...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save Profile Photo
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-[#FF0E25] hover:bg-[#C80016] text-white font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Upload className="w-4 h-4" /> Choose Image from Device
                </button>
              )}

              {currentAvatarUrl !== DEFAULT_AVATAR && !previewUrl && (
                <button
                  onClick={handleRemovePhoto}
                  className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold flex items-center justify-center gap-2 border border-rose-500/30 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                </button>
              )}

              <button
                onClick={handleCloseModal}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
