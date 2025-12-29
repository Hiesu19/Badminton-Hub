import api from './axiosInstance.js';

/**

 *
 * @param {Object} options
 * @param {'avatar' | 'supperCourtMain' | 'supperCourtBanner' | 'supperCourtGallery'} options.type
 * @param {File} options.file - File ảnh cần upload
 * @param {string} [options.supperCourtId] - Bắt buộc cho các type liên quan tới sân
 * @param {number} [options.position] - Vị trí ảnh gallery (bắt buộc nếu type = 'supperCourtGallery')
 * @returns {Promise<{ publicUrl: string; key: string }>}
 */
export async function uploadImageWithPresignedKey(options) {
  const { type, file, supperCourtId, position } = options;

  if (!file) {
    throw new Error('File không được để trống');
  }

  const contentType = file.type || 'image/jpeg';

  let presignedEndpoint = '';
  let body = {};

  switch (type) {
    case 'avatar':
      presignedEndpoint = '/uploads/presigned-avatar-image';
      body = { contentType };
      break;
    case 'supperCourtMain':
      if (!supperCourtId)
        throw new Error('Thiếu supperCourtId cho ảnh đại diện sân');
      presignedEndpoint = '/uploads/presigned-supper-court-main-image';
      body = { supperCourtId, contentType };
      break;
    case 'supperCourtBanner':
      if (!supperCourtId) throw new Error('Thiếu supperCourtId cho banner sân');
      presignedEndpoint = '/uploads/presigned-supper-court-banner-image';
      body = { supperCourtId, contentType };
      break;
    case 'supperCourtGallery':
      if (!supperCourtId)
        throw new Error('Thiếu supperCourtId cho gallery sân');
      if (typeof position !== 'number') {
        throw new Error(
          'Thiếu hoặc sai kiểu position cho gallery (cần number)',
        );
      }
      presignedEndpoint = '/uploads/presigned-supper-court-gallery-image';
      body = { supperCourtId, contentType, position };
      break;
    default:
      throw new Error('Loại upload không hợp lệ');
  }

  const { data } = await api.post(presignedEndpoint, body);
  const { url, fields, publicUrl, key } = data.data ?? data;

  const formData = new FormData();

  Object.entries(fields).forEach(([k, v]) => {
    formData.append(k, v);
  });

  formData.append('Content-Type', contentType);
  formData.append('file', file);

  await fetch(url, {
    method: 'POST',
    body: formData,
  });

  return {
    publicUrl,
    key,
  };
}
