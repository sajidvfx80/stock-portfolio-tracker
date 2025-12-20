import { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { sendPortfolioEmail } from '../utils/emailService';

const EmailSender = ({ data }) => {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    setIsSending(true);
    setStatus(null);
    setMessage('');

    try {
      await sendPortfolioEmail(data);
      setStatus('success');
      setMessage('Portfolio report sent successfully to sajidvfx@yahoo.com!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus(null);
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      if (error.text) {
        setMessage(`Failed to send email: ${error.text}`);
      } else {
        setMessage('Failed to send email. Please check your EmailJS configuration.');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {status && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            status === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {status === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </div>
      )}
      <button
        onClick={handleSendEmail}
        disabled={isSending}
        className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
          isSending
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
        title="Send portfolio report to sajidvfx@yahoo.com"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Send Email
          </>
        )}
      </button>
    </div>
  );
};

export default EmailSender;

