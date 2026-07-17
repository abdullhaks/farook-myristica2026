import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { Alert, message } from 'antd';
import { registrationService } from '../services/registrationService';
import Qrcode from '../assets/qrcode.jpeg'


// Available events for registration (excluding photography which is a google form)
export const REGISTERABLE_EVENTS = [
  'Treasure Hunt',
  'Vegetable Printing',
  'The Big Quiz',
  'The Ecological Debate',
] as const;

// Zod Validation Schema
const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
  college: z.string().trim().min(2, "College must be at least 2 characters"),
  department: z.string().trim().min(2, "Department must be at least 2 characters"),
  year: z.string().min(1, "Please select your academic year"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  whatsapp: z.string().regex(/^\d{10}$/, "WhatsApp number must be exactly 10 digits"),
  eventName: z.string().min(1, "Please select an event"),
}).refine((data) => {
  if (data.eventName === 'Treasure Hunt') {
    // Ensure college is Farook College (case-insensitive check)
    return data.college.toLowerCase().includes('farook');
  }
  return true;
}, {
  message: "Treasure Hunt is restricted to Farook College students only.",
  path: ["college"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEventName?: string; // Preselected event
}

export default function RegisterModal({
  isOpen,
  onClose,
  initialEventName = '',
}: RegisterModalProps) {
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    name: '',
    email: '',
    college: '',
    department: '',
    year: '',
    phone: '',
    whatsapp: '',
    eventName: '',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Live validation states
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Run live validation against the zod schema
  const runLiveValidation = (data: Partial<RegisterFormData>) => {
    const result = registerSchema.safeParse(data);
    const newErrors: Record<string, string> = {};
    
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
    }
    setFieldErrors(newErrors);
  };

  // Set initial event name and auto-fill college for Treasure Hunt
  useEffect(() => {
    if (isOpen) {
      const selectedEvent = initialEventName || '';
      const isTreasureHunt = selectedEvent === 'Treasure Hunt';
      
      setFormData({
        name: '',
        email: '',
        college: isTreasureHunt ? 'Farook College' : '',
        department: '',
        year: '',
        phone: '',
        whatsapp: '',
        eventName: selectedEvent,
      });
      setPaymentFile(null);
      setValidationErrors([]);
      setTouchedFields({});
      setFieldErrors({});
      setSubmitAttempted(false);
    }
  }, [isOpen, initialEventName]);

  // If event name changes manually in the form, adjust college auto-fill
  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEvent = e.target.value;
    const isTreasureHunt = selectedEvent === 'Treasure Hunt';
    
    const updatedData = {
      ...formData,
      eventName: selectedEvent,
      college: isTreasureHunt ? 'Farook College' : (formData.college === 'Farook College' ? '' : formData.college),
    };
    
    setPaymentFile(null); // Reset payment file when event changes
    setFormData(updatedData);
    setTouchedFields(prev => ({ ...prev, eventName: true }));
    runLiveValidation(updatedData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedData);
    
    if (touchedFields[name] || submitAttempted) {
      runLiveValidation(updatedData);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    runLiveValidation(formData);
  };

  // A leading-edge debounce helper to prevent duplicate click submissions
  const debouncedSubmit = React.useMemo(() => {
    let timeout: any = null;
    return (submitFn: () => void) => {
      if (!timeout) {
        submitFn();
        timeout = setTimeout(() => {
          timeout = null;
        }, 1500); // 1.5 seconds cooldown between clicks
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSubmit(executeSubmit);
  };

  const executeSubmit = async () => {
    setSubmitAttempted(true);
    setValidationErrors([]);
    setIsSubmitting(true);

    // Mark all fields as touched for errors to display
    const allTouched: Record<string, boolean> = {};
    allTouched.name = true;
    allTouched.email = true;
    allTouched.college = true;
    allTouched.department = true;
    allTouched.year = true;
    allTouched.phone = true;
    allTouched.whatsapp = true;
    allTouched.eventName = true;
    setTouchedFields(allTouched);

    // Run zod validation
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      // Map error messages for the summary Alert
      const errors = result.error.issues.map((err) => err.message);
      setValidationErrors(errors);
      
      // Also map for individual field error labels
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path && !newErrors[path]) {
          newErrors[path] = issue.message;
        }
      });
      setFieldErrors(newErrors);
      
      setIsSubmitting(false);
      message.error('Please fix form validation errors.');
      return;
    }

    try {
      let validatedData = result.data;
      
      const requiresPayment = ['Treasure Hunt', 'Vegetable Printing', 'The Big Quiz', 'The Ecological Debate'].includes(validatedData.eventName as string);

      // Pre-check registration to avoid uploading if already registered
      await registrationService.checkRegistration(validatedData.email, validatedData.eventName);
      
      if (requiresPayment && !paymentFile) {
        setIsSubmitting(false);
        message.error('Payment screenshot is required for this event.');
        return;
      }

      let paymentScreenshotUrl = '';
      if (requiresPayment && paymentFile) {
        // Upload screenshot
        const uploadResult = await registrationService.uploadScreenshot(paymentFile);
        if (uploadResult && uploadResult.url) {
          paymentScreenshotUrl = uploadResult.url;
        } else {
          throw new Error('Failed to upload payment screenshot');
        }
      }

      // Connect to the backend Registration API
      const res = await registrationService.registerParticipant({
        ...validatedData,
        paymentScreenshot: paymentScreenshotUrl || undefined
      });

      message.success(res.message || `Successfully registered for ${validatedData.eventName}!`);
      setIsSubmitting(false);
      onClose();
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      if (error && error.errors && Array.isArray(error.errors)) {
        // Detailed error messages from backend validation fields
        const detailMsgs = error.errors.map((err: any) => `${err.field}: ${err.message}`);
        setValidationErrors(detailMsgs);
        message.error(error.message || 'Please fix form validation errors.');
      } else {
        message.error(error.message || 'Something went wrong. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[500px] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="liquid-glass relative w-full max-w-xl rounded-3xl p-6 md:p-8 text-white border border-white/10 z-10 my-8 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-2"
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-semibold tracking-[2px] uppercase text-white/60 block mb-1">
                REGISTRATION FORM
              </span>
              <h2 className="text-3xl font-medium tracking-tight">
                Join <span className="font-serif italic font-normal">Myristica Season 5</span>
              </h2>
              <p className="text-sm text-white/50 mt-1">
                Provide your details below to register.
              </p>
            </div>

            {/* Antd Alert for Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-6 antd-dark-alert">
                <Alert
                  message="Form Errors"
                  description={
                    <ul className="list-disc pl-4 text-xs space-y-1">
                      {validationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  }
                  type="error"
                  showIcon
                />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Name Select */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                  Event Name
                </label>
                <select
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleEventChange}
                  onBlur={handleInputBlur}
                  disabled={!!initialEventName}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="" disabled className="bg-black text-white">Select Event</option>
                  {REGISTERABLE_EVENTS.map(evt => (
                    <option key={evt} value={evt} className="bg-black text-white">
                      {evt}
                    </option>
                  ))}
                </select>
                {(touchedFields.eventName || submitAttempted) && fieldErrors.eventName && (
                  <span className="text-xs text-red-400 mt-1 block">
                    {fieldErrors.eventName}
                  </span>
                )}
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g., John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  required
                />
                {(touchedFields.name || submitAttempted) && fieldErrors.name && (
                  <span className="text-xs text-red-400 mt-1 block">
                    {fieldErrors.name}
                  </span>
                )}
              </div>

              {/* College Input */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                  College Name & Place
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college || ''}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g., Farook College, Kozhikode"
                  disabled={formData.eventName === 'Treasure Hunt'}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
                {formData.eventName === 'Treasure Hunt' && (
                  <span className="text-[10px] text-white/40 mt-1 block">
                    * Treasure Hunt is strictly restricted to Farook College students only.
                  </span>
                )}
                {(touchedFields.college || submitAttempted) && fieldErrors.college && (
                  <span className="text-xs text-red-400 mt-1 block">
                    {fieldErrors.college}
                  </span>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g., john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                  required
                />
                {(touchedFields.email || submitAttempted) && fieldErrors.email && (
                  <span className="text-xs text-red-400 mt-1 block">
                    {fieldErrors.email}
                  </span>
                )}
              </div>

              {/* Department & Year Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="e.g., Botany"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                    required
                  />
                  {(touchedFields.department || submitAttempted) && fieldErrors.department && (
                    <span className="text-xs text-red-400 mt-1 block">
                      {fieldErrors.department}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                    Year of Study
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                    required
                  >
                    <option value="" disabled className="bg-black text-white">Select Year</option>
                    <option value="1st Year UG" className="bg-black text-white">1st Year UG</option>
                    <option value="2nd Year UG" className="bg-black text-white">2nd Year UG</option>
                    <option value="3rd Year UG" className="bg-black text-white">3rd Year UG</option>
                    <option value="1st Year PG" className="bg-black text-white">1st Year PG</option>
                    <option value="2nd Year PG" className="bg-black text-white">2nd Year PG</option>
                    {/* <option value="Research Scholar" className="bg-black text-white">Research Scholar</option> */}
                  </select>
                  {(touchedFields.year || submitAttempted) && fieldErrors.year && (
                    <span className="text-xs text-red-400 mt-1 block">
                      {fieldErrors.year}
                    </span>
                  )}
                </div>
              </div>

              {/* Phone & WhatsApp Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="10-digit number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                    maxLength={10}
                    required
                  />
                  {(touchedFields.phone || submitAttempted) && fieldErrors.phone && (
                    <span className="text-xs text-red-400 mt-1 block">
                      {fieldErrors.phone}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp || ''}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    placeholder="10-digit number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                    maxLength={10}
                    required
                  />
                  {(touchedFields.whatsapp || submitAttempted) && fieldErrors.whatsapp && (
                    <span className="text-xs text-red-400 mt-1 block">
                      {fieldErrors.whatsapp}
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Section */}
              {['Treasure Hunt', 'Vegetable Printing', 'The Big Quiz', 'The Ecological Debate'].includes(formData.eventName || '') && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4 space-y-4">
                  <div className="flex items-start gap-4">
                    <button type="button" onClick={() => setIsQrModalOpen(true)} className="focus:outline-none hover:opacity-80 transition-opacity">
                      <img src={Qrcode} alt="Payment QR" className="w-24 h-24 object-contain rounded-lg bg-white p-1" />
                    </button>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Registration Fee: {['Treasure Hunt', 'The Big Quiz'].includes(formData.eventName || '') ? '₹100' : '₹50'}</h4>
                      <p className="text-xs text-white/70 mb-1">Bank: South Indian Bank</p>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-white/70">Acc Number: 0427053000008968</p>
                        <button type="button" onClick={() => { navigator.clipboard.writeText('0427053000008968'); message.success('Account number copied!'); }} className="text-white/50 hover:text-white transition-colors" title="Copy Account Number">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-white/70">IFSC Code: SIBL0000427</p>
                        <button type="button" onClick={() => { navigator.clipboard.writeText('SIBL0000427'); message.success('IFSC code copied!'); }} className="text-white/50 hover:text-white transition-colors" title="Copy IFSC Code">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                      <p className="text-xs text-white/70 mb-1">Acc Name: FATHIMA SHAFLA BAVUVALAPPIL</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-white/70">UPI: fathimashafla2302@okicici</p>
                        <button type="button" onClick={() => { navigator.clipboard.writeText('fathimashafla2302@okicici'); message.success('UPI ID copied!'); }} className="text-white/50 hover:text-white transition-colors" title="Copy UPI ID">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-white/60 mb-1">
                      Upload Payment Screenshot (Max 5MB)
                    </label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            message.error('File size must be less than 5MB');
                            e.target.value = '';
                            setPaymentFile(null);
                            return;
                          }
                          setPaymentFile(file);
                        }
                      }}
                      className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-white/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing registration...
                    </>
                  ) : (
                    'SUBMIT REGISTRATION'
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* QR Code Modal */}
          <AnimatePresence>
            {isQrModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                onClick={() => setIsQrModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative max-w-sm w-full bg-white rounded-2xl p-4"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsQrModalOpen(false)}
                    className="absolute -top-12 right-0 text-white hover:text-white/70 p-2"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                  <img src={Qrcode} alt="Payment QR Full" className="w-full h-auto object-contain rounded-lg" />
                  <p className="text-center text-black font-semibold mt-4 mb-2">Scan to Pay</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
