import React, { useEffect, useState } from 'react';
import { useMovies } from '../../context/MovieContext';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { siteSettings } = useMovies();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-300">
      <div className="bg-[#121620]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <Mail className="w-8 h-8 text-[#FF0E25]" />
          <div>
            <h1 className="text-2xl font-black text-white">{t('contactUs')} (සම්බන්ධ කරගන්න)</h1>
            <p className="text-xs text-[#FF0E25] font-semibold">Get in Touch with CINEXUS Core Team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Details Column */}
          <div className="p-6 rounded-2xl bg-[#0A0A0E] border border-white/5 space-y-4 text-xs text-gray-300 leading-[1.8]">
            <h3 className="font-extrabold text-white text-sm">Contact Information</h3>
            <p className="whitespace-pre-line">{siteSettings.contactUsContent}</p>
          </div>

          {/* Form Column */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {submitted && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Thank you! Your message has been transmitted to CINEXUS Support.
              </div>
            )}

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ruwan Perera"
                className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Technical Inquiry / Subtitle Request"
                className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-gray-300 block mb-1">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message details..."
                className="w-full bg-[#0A0A0E] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF0E25]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF0E25] via-[#C80016] to-rose-700 hover:opacity-90 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#FF0E25]/30 transition-all"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
