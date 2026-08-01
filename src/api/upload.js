import axios from 'axios';
import { UPLOAD_URL } from '../config';

/**
 * Upload a file (photo or signature) to the Laravel file upload endpoint
 *
 * @param {string} fileUri Local file URI (from Expo camera / image picker / canvas)
 * @param {string} fieldName Field name expected by backend ('photo', 'signature', or 'file')
 * @param {string} folder Target folder ('uploads/pod', 'uploads/signatures', etc.)
 * @returns {Promise<{ success: boolean, url: string, storage: string }>}
 */
export const uploadFile = async (fileUri, fieldName = 'file', folder = 'uploads') => {
  try {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append(fieldName, {
      uri: fileUri,
      name: filename,
      type: mimeType,
    });
    formData.append('folder', folder);

    const response = await axios.post(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('File Upload Error:', error.response?.data || error.message);
    throw error;
  }
};

export default uploadFile;
