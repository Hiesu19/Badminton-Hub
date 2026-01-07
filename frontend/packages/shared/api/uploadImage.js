import api from './axiosInstance.js';
import axios from 'axios';

const resolveContentType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  let contentType = file.type;

  if (!allowedTypes.includes(contentType)) {
    const fileName = (file.name || '').toLowerCase();

    if (fileName.endsWith('.png')) {
      contentType = 'image/png';
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else {
      contentType = 'image/jpeg';
    }
  }

  return contentType;
};

const getS3PresignedUrl = async ({
  type,
  contentType,
  supperCourtId,
  position,
  bookingId,
}) => {
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
    case 'bookingBill':
      if (!bookingId) throw new Error('Thiếu bookingId cho bill thanh toán');
      presignedEndpoint = '/uploads/presigned-booking-bill-image';
      body = { bookingId, contentType };
      break;
    default:
      throw new Error('Loại upload không hợp lệ');
  }

  const { data } = await api.post(presignedEndpoint, body);
  return data.data ?? data;
};

/**
 * Gọi trực tiếp S3 bằng presigned URL
 */
const uploadsImageApi = (url, formData) => {
  return axios.post(url, formData);
};

const uploadToS3 = async (s3Data, file, contentType) => {
  const formData = new FormData();

  Object.entries(s3Data.fields).forEach(([k, v]) => {
    formData.append(k, v);
  });
  formData.append('file', file);
  await uploadsImageApi(s3Data.url, formData);
  return s3Data.publicUrl;
};

export async function uploadImageWithPresignedKey(options) {
  const { type, file, supperCourtId, position, bookingId } = options;

  if (!file) {
    throw new Error('File không được để trống');
  }
  const contentType = resolveContentType(file);

  const s3Data = await getS3PresignedUrl({
    type,
    contentType,
    supperCourtId,
    position,
    bookingId,
  });

  const publicUrl = await uploadToS3(s3Data, file, contentType);

  return {
    publicUrl,
    key: s3Data.key,
  };
}
