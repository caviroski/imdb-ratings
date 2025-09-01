export const fetchDeleteFile = async (fileName) => {
  try {
    const res = await fetch(`http://localhost:8080/api/imdb-ratings/delete-by-file/${fileName}`, {
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