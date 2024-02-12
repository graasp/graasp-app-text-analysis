import { toast } from 'react-toastify';

const showErrorToast = (message: string): void => {
  toast.error(message, {
    toastId: message,
    position: 'bottom-right',
  });
};

export { showErrorToast };
