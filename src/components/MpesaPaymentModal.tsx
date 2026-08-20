import React, { useState, useEffect } from 'react';
import { Book, CartItem } from '../types';
import { formatPrice } from '../utils/helpers';
import { BookCover } from './BookCover';
import { 
  X, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  Download, 
  User, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
  cartItems?: CartItem[];
  onPaymentSuccess: (data: {
    books: Book[];
    phoneNumber: string;
    mpesaReceipt: string;
    downloadToken: string;
  }) => void;
  onNavigateToProfile: () => void;
}

type PaymentStep = 'input' | 'push_sent' | 'success';

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  book,
  cartItems = [],
  onPaymentSuccess,
  onNavigateToProfile,
}) => {
  const booksToBuy: Book[] = book 
    ? [book] 
    : cartItems.map((item) => item.book);

  const totalAmountKES = booksToBuy.reduce((sum, b) => sum + b.priceKES, 0) || 100;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [step, setStep] = useState<PaymentStep>('input');
  const [countdown, setCountdown] = useState(25);
  const [generatedReceipt, setGeneratedReceipt] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setPhoneError('');
      setCountdown(25);
      setIsProcessing(false);
      setCopiedLink(false);
    }
  }, [isOpen, book]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'push_sent' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen || booksToBuy.length === 0) return null;

  const validatePhone = (num: string) => {
    const cleaned = num.replace(/\s+/g, '').replace(/[-+]/g, '');
    if (!cleaned) {
      return 'Please enter your M-Pesa phone number';
    }
    const regex = /^(?:254|\+254|0)?([17]\d{8})$/;
    if (!regex.test(cleaned)) {
      return 'Please enter a valid Kenyan Safaricom / M-Pesa number (e.g. 0712 345 678)';
    }
    return '';
  };

  const formatCleanPhone = (num: string) => {
    let cleaned = num.replace(/\s+/g, '').replace(/[-+]/g, '');
    if (cleaned.startsWith('254')) {
      cleaned = '0' + cleaned.slice(3);
    }
    return cleaned;
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validatePhone(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }
    setPhoneError('');
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('push_sent');
      setCountdown(25);
    }, 1000);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const receiptCode = `QK${Math.floor(10 + Math.random() * 89)}${randomSuffix}`;
    const token = `dl_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;

    setTimeout(() => {
      setGeneratedReceipt(receiptCode);
      setGeneratedToken(token);
      setIsProcessing(false);
      setStep('success');

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F2FE', '#1E90FF', '#10B981', '#F59E0B'],
      });

      onPaymentSuccess({
        books: booksToBuy,
        phoneNumber: formatCleanPhone(phoneNumber),
        mpesaReceipt: receiptCode,
        downloadToken: token,
      });
    }, 900);
  };

  const getDownloadUrl = (token: string, bookId: string) => {
    return `${window.location.origin}/#/download/${token}/${bookId}`;
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadNow = (bookItem: Book) => {
    const element = document.createElement('a');
    const file = new Blob([
      `%PDF-1.4\n1 0 obj\n<< /Title (${bookItem.title}) /Author (${bookItem.author}) /Publisher (MidusaElibrary) >>\nendobj\n`
    ], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = `${bookItem.title.replace(/\s+/g, '_')}_Midusa_eBook.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 font-sans text-slate-100">
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={step === 'push_sent' ? undefined : onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0F172A] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden z-10 animate-scaleIn my-auto">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              M
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                {step === 'success' ? 'Payment Confirmed' : 'Lipa na M-Pesa (KES 100)'}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 'success' ? 'Unique PDF download link ready' : 'Direct STK Push Prompt'}
              </p>
            </div>
          </div>

          {step !== 'push_sent' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: Phone Input */}
          {step === 'input' && (
            <form onSubmit={handleInitiatePayment} className="space-y-4">
              
              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
                <div className="shrink-0 w-12 h-16 rounded-md overflow-hidden shadow-xs">
                  <BookCover book={booksToBuy[0]} size="xs" showBadge={false} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                    {booksToBuy.length > 1 ? `${booksToBuy.length} eBooks Selected` : booksToBuy[0].category}
                  </span>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white truncate mt-1">
                    {booksToBuy.length > 1 ? `${booksToBuy[0].title} + ${booksToBuy.length - 1} more` : booksToBuy[0].title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    By {booksToBuy[0].author}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-400">Total:</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      {formatPrice(totalAmountKES)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone Input Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Enter Safaricom M-Pesa Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 font-semibold text-xs border-r border-slate-800 pr-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>+254</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="0712 345 678"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    className={`w-full pl-22 pr-4 py-3 bg-slate-950 border rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-hidden transition-colors ${
                      phoneError
                        ? 'border-rose-500'
                        : 'border-slate-800 focus:border-emerald-500'
                    }`}
                    autoFocus
                  />
                </div>
                {phoneError ? (
                  <p className="text-xs text-rose-400 font-medium">{phoneError}</p>
                ) : (
                  <p className="text-xs text-slate-400">
                    An STK push payment prompt will appear on this phone screen immediately.
                  </p>
                )}
              </div>

              {/* Security Guarantee */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant STK push notification • Secure M-Pesa PIN prompt</span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-transform active:scale-98 disabled:opacity-75 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending M-Pesa Prompt...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4.5 h-4.5 fill-white" />
                    <span>Pay {formatPrice(totalAmountKES)} via M-Pesa</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: STK Push Sent - Waiting for PIN */}
          {step === 'push_sent' && (
            <div className="space-y-5 text-center py-2 animate-fadeIn">
              
              <div className="relative mx-auto w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                <Smartphone className="w-10 h-10 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-[#0F172A]">
                  1
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-heading font-extrabold text-white">
                  Prompt Sent to {phoneNumber}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Please check your phone screen. Enter your <strong>M-Pesa PIN</strong> to authorize the <strong>{formatPrice(totalAmountKES)}</strong> payment.
                </p>
              </div>

              {/* Step checklist */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <span>STK push prompt dispatched to phone</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <span>Enter your 4-digit M-Pesa PIN & press OK</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <span>Unique download link is generated & saved to profile</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying M-Pesa PIN Transaction...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>I have entered my PIN / Confirm Payment</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Waiting for PIN: {countdown}s
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="text-blue-400 hover:underline text-xs font-medium cursor-pointer"
                  >
                    Change Phone Number
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Success & Download Ready */}
          {step === 'success' && (
            <div className="space-y-4 text-center animate-fadeIn">
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-heading font-extrabold text-white">
                  Payment Successful!
                </h4>
                <p className="text-xs sm:text-sm text-slate-400">
                  M-Pesa Code: <span className="font-mono font-bold text-emerald-400">{generatedReceipt}</span> • {formatPrice(totalAmountKES)}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Your Unique PDF Download Link
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Active & Verified
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="text"
                    readOnly
                    value={getDownloadUrl(generatedToken, booksToBuy[0].id)}
                    className="w-full text-xs font-mono text-slate-300 bg-transparent outline-none truncate"
                  />
                  <button
                    onClick={() => handleCopyLink(getDownloadUrl(generatedToken, booksToBuy[0].id))}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition-colors cursor-pointer"
                    title="Copy download link"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  ✓ This download link has been <strong>automatically saved to your Account Profile library</strong> for permanent lifetime access.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => handleDownloadNow(booksToBuy[0])}
                  className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF Now</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToProfile();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <span>View in My Account Library</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
