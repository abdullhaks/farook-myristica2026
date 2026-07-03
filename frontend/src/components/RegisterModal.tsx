import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { Alert, message } from 'antd';
import { registrationService } from '../services/registrationService';

// Available events for registration (excluding photography which is a google form)
export const REGISTERABLE_EVENTS = [
  'Treasure Hunt',
  'Terrarium Making Workshop',
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
      const validatedData = result.data;
      // Connect to the backend Registration API
      const res = await registrationService.registerParticipant(validatedData);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-80 overflow-y-auto">
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
                  College Name
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college || ''}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="e.g., Farook College"
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
                    <option value="Research Scholar" className="bg-black text-white">Research Scholar</option>
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
        </div>
      )}
    </AnimatePresence>
  );
}
