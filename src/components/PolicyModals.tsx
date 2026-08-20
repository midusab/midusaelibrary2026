import React from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'refund' | 'privacy' | 'terms';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  if (!isOpen) return null;

  const content = {
    refund: {
      title: 'Refund & Satisfaction Policy',
      icon: RefreshCw,
      badge: '100% Risk-Free Guarantee',
      body: (
        <div className="space-y-4 text-sm text-slate-300 font-body leading-relaxed">
          <p>
            At <strong className="text-white">MidusaElibrary</strong>, we stand behind the quality and formatting of every digital eBook in our curated collection.
          </p>

          <h4 className="font-heading font-bold text-white text-base">1. Instant Download Guarantee</h4>
          <p>
            When you complete an M-Pesa or Card payment of KES 100, your unique download link is generated immediately. If for any reason your link fails to trigger or the PDF is corrupted, our system provides instant re-downloads through your account library or direct via WhatsApp support.
          </p>

          <h4 className="font-heading font-bold text-white text-base">2. 24-Hour Money-Back Policy</h4>
          <p>
            If you experience an unresolvable technical formatting issue with any purchased PDF, you are entitled to a full 100% refund of your KES 100 purchase within 24 hours of transaction.
          </p>

          <h4 className="font-heading font-bold text-white text-base">3. How to Request a Refund</h4>
          <p>
            Simply send your M-Pesa Confirmation Code (e.g. <code className="bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded">QK89XLP20A</code>) to <strong className="text-blue-400">support@midusaelibrary.com</strong> or message our 24/7 WhatsApp desk. Refunds are processed back to the originating M-Pesa number within 2 hours.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy & Data Security',
      icon: Lock,
      badge: 'Kenya Data Protection Act Compliant',
      body: (
        <div className="space-y-4 text-sm text-slate-300 font-body leading-relaxed">
          <p>
            We take your privacy seriously. Your trust is the foundation of our bookstore.
          </p>

          <h4 className="font-heading font-bold text-white text-base">1. Information We Collect</h4>
          <p>
            When purchasing on MidusaElibrary, we collect only the essential information needed to fulfill your digital delivery: your phone number (for M-Pesa transaction validation and receipt verification) and your email (for sending backup download links).
          </p>

          <h4 className="font-heading font-bold text-white text-base">2. Zero Third-Party Selling or Spam</h4>
          <p>
            We will never sell, rent, or lease your phone number or email address to third-party advertisers. You will never receive unsolicited marketing spam or promotional cold calls.
          </p>

          <h4 className="font-heading font-bold text-white text-base">3. Payment Security & Encryption</h4>
          <p>
            All payment handshakes are processed through secure Daraja API encrypted channels over TLS 1.3. We never store PINs or banking credentials on our servers.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Digital Service',
      icon: FileText,
      badge: 'Digital Distribution Agreement',
      body: (
        <div className="space-y-4 text-sm text-slate-300 font-body leading-relaxed">
          <p>
            By purchasing and accessing eBooks through MidusaElibrary, you agree to the following terms of service:
          </p>

          <h4 className="font-heading font-bold text-white text-base">1. Personal Use License</h4>
          <p>
            Each purchased eBook is licensed for personal educational and recreational reading. You may download and store the file across your personal devices (smartphones, e-readers, tablets, computers).
          </p>

          <h4 className="font-heading font-bold text-white text-base">2. Non-Commercial Restriction</h4>
          <p>
            Redistributing, reselling, or public mass-hosting of purchased PDF files without written permission is strictly prohibited under international copyright laws.
          </p>

          <h4 className="font-heading font-bold text-white text-base">3. Lifetime Access</h4>
          <p>
            MidusaElibrary grants you ongoing access to re-download your purchased catalog items through your linked phone number library.
          </p>
        </div>
      ),
    },
  }[type];

  const IconComponent = content.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-100 animate-slideDown">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">{content.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{content.badge}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
          {content.body}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">Midusa Trust Standard</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close & Understand
          </button>
        </div>

      </div>
    </div>
  );
};
