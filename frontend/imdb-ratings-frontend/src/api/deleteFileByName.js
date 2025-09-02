import { API_BASE_URL } from '../config/api';

export const deleteFileByName = async (fileName) => {
  try {
    const res = await fetch(`${API_BASE_URL}/delete-by-file/${fileName}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      throw new Error('Failed to delete');
    }

    const msg = await res.text();
    return msg;
  } catch (err) {
    throw err;
  }
}