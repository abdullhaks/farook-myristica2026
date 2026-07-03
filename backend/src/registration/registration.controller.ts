import { Controller, Post, Body, UsePipes, Get, Query, UseGuards, Delete, Param } from '@nestjs/common';
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
}
