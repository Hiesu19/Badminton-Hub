import toast from 'react-hot-toast';

/**
 * Hiển thị toast thành công với message ngắn gọn.
 */
export const showSuccessToast = (message) => {
  toast.success(message);
};

/**
 * Hiển thị toast lỗi với message ngắn gọn.
 */
export const showErrorToast = (message) => {
  toast.error(message);
};

/**
 * Hiển thị toast thông tin/chung.
 */
export const showInfoToast = (message) => {
  toast(message);
};
