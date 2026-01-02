import toast from 'react-hot-toast';

/**
 * Hiển thị toast thành công với message ngắn gọn.
 *
 * @param {string} message - Nội dung thông báo cho người dùng.
 */
export const showSuccessToast = (message) => {
  toast.success(message);
};

/**
 * Hiển thị toast lỗi với message ngắn gọn.
 *
 * @param {string} message - Nội dung lỗi cần thông báo cho người dùng.
 */
export const showErrorToast = (message) => {
  toast.error(message);
};

/**
 * Hiển thị toast thông tin/chung.
 *
 * @param {string} message - Nội dung thông tin muốn hiển thị.
 */
export const showInfoToast = (message) => {
  toast(message);
};
