import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Registration extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ required: true, trim: true })
  college: string;

  @Prop({ required: true, trim: true })
  department: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  whatsapp: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ type: [String], default: [] })
  teamMembers?: string[];

  @Prop({ required: false })
  paymentScreenshot?: string;

  @Prop({ required: false, enum: ['pending', 'verified', 'rejected'], default: 'pending' })
  paymentStatus?: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);

// Compound unique index to prevent same user from registering to same event multiple times
RegistrationSchema.index({ email: 1, eventName: 1 }, { unique: true });
