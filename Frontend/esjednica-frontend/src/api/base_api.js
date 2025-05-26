import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const get = (url) => axiosInstance.get(url);
export const post = (url, data) => axiosInstance.post(url, data);
export const put = (url, data) => axiosInstance.put(url, data);
export const del = (url) => axiosInstance.delete(url);
export const downloadFile = async (url) => {
  try {
    const response = await axiosInstance.get(url, {
      responseType: 'blob',
    });

    const contentType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: contentType });

    let filename = 'prilog'; // fallback

    const disposition = response.headers['content-disposition'];
    if (disposition) {
      const utf8Match = disposition.match(/filename\*=UTF-8''([^;\n]*)/);
      if (utf8Match && utf8Match[1]) {
        filename = decodeURIComponent(utf8Match[1]);
      } else {
        const basicMatch = disposition.match(/filename="([^"]+)"/);
        if (basicMatch && basicMatch[1]) {
          filename = basicMatch[1];
        }
      }
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Greška pri preuzimanju datoteke:', error);
    alert('Preuzimanje nije uspjelo.');
  }
};



