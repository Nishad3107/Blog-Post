import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { supabase } from '../services/supabase';
import { uploadImage } from '../services/storage';

export default function AddStory() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image_url: '',
    description: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ ...formData, image_url: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = formData.image_url;

      if (selectedFile) {
        setUploading(true);
        imageUrl = await uploadImage(selectedFile);
        setUploading(false);
      }

      const { error: insertError } = await supabase
        .from('trips')
        .insert([
          {
            title: formData.title,
            location: formData.location,
            image_url: imageUrl,
            description: formData.description,
            content: formData.content,
            author: 'Anonymous',
          },
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        title: '',
        location: '',
        image_url: '',
        description: '',
        content: '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => {
        navigate('/trips');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="relative h-64 bg-gradient-to-r from-primary-dark to-dark-green flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="font-heading text-4xl mb-2">Add Your Story</h1>
          <p className="text-lg text-light-green font-body">Share your travel experience with the world</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg font-body">
            Story published successfully! Redirecting to trips...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg font-body">
            Error: {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8 space-y-6 border-2 border-soft-mint"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-primary-dark mb-2 font-body">
              Story Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-soft-mint focus:border-accent-green rounded-lg transition font-body"
              placeholder="Give your story a catchy title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-primary-dark mb-2 font-body">
                Destination *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-soft-mint focus:border-accent-green rounded-lg transition font-body"
                placeholder="Where did you go?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2 font-body">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-soft-mint rounded-lg p-4">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500 font-body">Click to upload or drag and drop</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-sm text-accent-green hover:text-primary-green font-body"
                    >
                      Choose file
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-primary-dark mb-2 font-body">
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-soft-mint focus:border-accent-green rounded-lg transition resize-none font-body"
              placeholder="A brief summary of your adventure..."
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-primary-dark mb-2 font-body">
              Full Story *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className="w-full px-4 py-3 border-2 border-soft-mint focus:border-accent-green rounded-lg transition resize-none font-body"
              placeholder="Tell us about your adventure in detail..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-gradient-to-r from-primary-green to-accent-green text-white py-3 px-6 rounded-lg font-button hover:from-dark-green hover:to-primary-green transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading || uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {uploading ? 'Uploading Image...' : 'Publishing...'}
              </span>
            ) : (
              'Publish Story'
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
