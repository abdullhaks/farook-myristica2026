import { z } from 'zod';

export const REGISTERABLE_EVENTS = [
  'Treasure Hunt',
  'Terrarium Making Workshop',
  'Vegetable Printing',
  'The Big Quiz',
  'The Ecological Debate',
] as const;

export const ACADEMIC_YEARS = [
  '1st Year UG',
  '2nd Year UG',
  '3rd Year UG',
  '1st Year PG',
  '2nd Year PG',
  'Research Scholar',
] as const;

export const registrationSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  college: z.string().trim().min(2, 'College must be at least 2 characters'),
  department: z.string().trim().min(2, 'Department must be at least 2 characters'),
  year: z.enum(ACADEMIC_YEARS),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  whatsapp: z.string().regex(/^\d{10}$/, 'WhatsApp number must be exactly 10 digits'),
  eventName: z.enum(REGISTERABLE_EVENTS),
  paymentScreenshot: z.string().optional(),
}).refine((data) => {
  if (data.eventName === 'Treasure Hunt') {
    return data.college.toLowerCase().includes('farook');
  }
  return true;
}, {
  message: 'Treasure Hunt is restricted to Farook College students only.',
  path: ['college'],
});

export class RegistrationDto {
  name: string;
  email: string;
  college: string;
  department: string;
  year: typeof ACADEMIC_YEARS[number];
  phone: string;
  whatsapp: string;
  eventName: typeof REGISTERABLE_EVENTS[number];
  paymentScreenshot?: string;
  paymentStatus?: 'pending' | 'verified' | 'rejected';
}

export class UpdatePaymentStatusDto {
  status: 'pending' | 'verified' | 'rejected';
}
