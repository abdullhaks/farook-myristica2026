import { Controller, Post, Body, UsePipes, Get, Query, UseGuards, Delete, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { RegistrationService } from './registration.service';
import { RegistrationDto, registrationSchema } from './dto/registration.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('register')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(registrationSchema))
  async register(@Body() dto: RegistrationDto) {
    const result = await this.registrationService.register(dto);
    return {
      success: true,
      message: `Successfully registered for ${result.eventName}!`,
      data: {
        id: result._id,
        name: result.name,
        eventName: result.eventName,
      },
    };
  }

  @Post('check')
  async check(@Body() dto: { email: string, eventName: string }) {
    await this.registrationService.checkExisting(dto.email, dto.eventName);
    return { success: true };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadScreenshot(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Ensure Cloudinary is configured
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'myristica_payments' },
          (error, result) => {
            if (error || !result) {
              console.error('Cloudinary upload error:', error);
              return reject(new BadRequestException('Failed to upload image'));
            }
            resolve({
              success: true,
              url: result.secure_url,
            });
          }
        );
        uploadStream.end(file.buffer);
      } catch (err) {
        console.error('Cloudinary setup error:', err);
        reject(new BadRequestException('Image upload service is not configured properly (missing environment variables)'));
      }
    });
  }

  // Get dashboard statistics
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    const data = await this.registrationService.getDashboardStats();
    return {
      success: true,
      data,
    };
  }

  // Get paginated registrations for admin portal
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
    @Query('event') eventFilter?: string
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const result = await this.registrationService.getPaginatedRegistrations(pageNum, limitNum, eventFilter);
    return {
      success: true,
      total: result.total,
      page: pageNum,
      limit: limitNum,
      data: result.data,
    };
  }

  // Export registrations without limit
  @UseGuards(JwtAuthGuard)
  @Get('export')
  async exportRegistrations(@Query('event') eventFilter?: string) {
    const data = await this.registrationService.getRegistrationsForExport(eventFilter);
    return {
      success: true,
      data,
    };
  }

  // Delete a registration
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteRegistration(@Param('id') id: string) {
    await this.registrationService.deleteRegistration(id);
    return {
      success: true,
      message: 'Registration deleted successfully',
    };
  }

  // Update payment status
  @UseGuards(JwtAuthGuard)
  @Post(':id/payment')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() dto: { status: 'pending' | 'verified' | 'rejected' }
  ) {
    const updated = await this.registrationService.updatePaymentStatus(id, dto.status);
    if (!updated) {
      throw new BadRequestException('Registration not found');
    }
    return {
      success: true,
      message: 'Payment status updated successfully',
      data: updated
    };
  }
}
