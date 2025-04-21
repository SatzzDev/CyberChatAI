import { useEffect } from 'react';

interface ErrorNotificationProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function ErrorNotification({ message, visible, onDismiss }: ErrorNotificationProps) {
  // Auto-hide after 5 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-900/90 border border-red-500 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-red-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
