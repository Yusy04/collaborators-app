import { CheckIcon, CloseIcon } from './Icons';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

const typeClasses = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
};

export const Toast = ({ message, type = 'success' }: ToastProps) => (
  <div className={`fixed top-20 right-4 z-50 ${typeClasses[type]} text-white px-4 py-3 rounded-lg shadow-lg animate-slide-in-right`}>
    <div className="flex items-center gap-2">
      {type === 'error' ? <CloseIcon className="w-5 h-5" /> : <CheckIcon className="w-5 h-5" />}
      {message}
    </div>
  </div>
);
