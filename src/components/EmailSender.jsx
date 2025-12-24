import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { sendPortfolioEmail } from '../utils/emailService';
import { useToast } from '../context/ToastContext';

const EmailSender = ({ data }) => {
  const { success, error } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    setIsSending(true);

    try {
      await sendPortfolioEmail(data);
      success('Portfolio report sent successfully to sajidvfx@yahoo.com!', {
        title: 'Email Sent',
      });
    } catch (err) {
      error(err.text || 'Failed to send email. Please check your EmailJS configuration.', {
        title: 'Email Error',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      onClick={handleSendEmail}
      disabled={isSending}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
        isSending
          ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95'
      } shadow-md hover:shadow-lg`}
      title="Send portfolio report to sajidvfx@yahoo.com"
    >
      {isSending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Sending...</span>
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Send Email</span>
        </>
      )}
    </button>
  );
};

export default EmailSender;

