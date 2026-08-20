import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  Sparkles,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { generateWhatsAppUrl } from '../utils/helpers';

interface ContactPageProps {
  onBackToHome: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToHome }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Payment / Download Assistance');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Care & Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            We're Here to Help You Read & Compounding Knowledge
          </h1>

          <p className="text-slate-400 font-body max-w-xl mx-auto text-sm sm:text-base">
            Have a question regarding M-Pesa checkout, lost download tokens, or book recommendations? Send us a message or reach out on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Contact Methods & Hours */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* WhatsApp Quick Card */}
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Direct WhatsApp</h4>
                  <p className="text-xs text-emerald-400 font-medium">Fastest response (~5 mins)</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">
                Chat directly with our support desk for instant link re-issuance or custom title requests.
              </p>
              <a
                href={generateWhatsAppUrl(undefined, 'Hello Midusa Support, I need help with an eBook on your store.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors w-full justify-center"
              >
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Email Support Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">Email Support</h4>
                  <a href="mailto:support@midusaelibrary.com" className="text-xs text-blue-400 hover:underline">
                    support@midusaelibrary.com
                  </a>
                </div>
              </div>
            </div>

            {/* Office & Hours */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <Clock className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Operating Hours</strong>
                  <span className="text-slate-400">Monday – Sunday: 7:00 AM – 11:00 PM EAT</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Location</strong>
                  <span className="text-slate-400">Kilimani Business Hub, Nairobi, Kenya</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">100% Satisfaction Guarantee</strong>
                  <span className="text-slate-400">Instant replacement or full refund if any file issue occurs.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
              
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white">Message Received!</h3>
                  <p className="text-slate-300 text-sm max-w-sm mx-auto font-body">
                    Thank you, <span className="font-semibold text-white">{name}</span>. Our support team has logged your inquiry and will email you at <span className="text-blue-400 font-mono text-xs">{email}</span> within 15 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-heading font-bold text-xl text-white mb-2">Send us an Inquiry</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Mwangi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Phone / M-Pesa Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0712 345 678"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Topic / Subject</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-blue-500 transition-colors"
                      >
                        <option value="Payment / Download Assistance">Payment / Download Assistance</option>
                        <option value="Book Recommendation / Request">Book Recommendation / Request</option>
                        <option value="Refund or Technical Query">Refund or Technical Query</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please include your M-Pesa code or book title if inquiring about an existing purchase..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-hidden focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Support Ticket</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
