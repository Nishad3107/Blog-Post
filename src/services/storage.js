import { supabase } from './supabase';

const BUCKET_NAME = 'trip-images';

export async function uploadImage(file) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteImage(imageUrl) {
  if (!imageUrl) return;

  const urlParts = imageUrl.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const filePath = fileName;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Failed to delete image:', error.message);
  }
}
