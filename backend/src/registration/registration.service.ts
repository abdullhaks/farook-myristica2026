import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { RegistrationRepository } from './registration.repository';
import { RegistrationDto } from './dto/registration.dto';
import { Registration } from './schemas/registration.schema';

@Injectable()
export class RegistrationService {
  constructor(private readonly registrationRepository: RegistrationRepository) {}

  async register(dto: RegistrationDto): Promise<Registration> {
    // Double security check for Treasure Hunt college constraint
    if (dto.eventName === 'Treasure Hunt' && !dto.college.toLowerCase().includes('farook')) {
      throw new BadRequestException('Treasure Hunt is restricted to Farook College students only.');
    }

    // Check if participant is already registered for this event
    const existing = await this.registrationRepository.findByEmailAndEvent(dto.email, dto.eventName);
    if (existing) {
      throw new ConflictException(`You are already registered for ${dto.eventName} with this email address.`);
    }

    // Delegate creation to Repository
    return this.registrationRepository.create(dto);
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return this.registrationRepository.findAll();
  }

  async getPaginatedRegistrations(page: number, limit: number, eventFilter?: string) {
    return this.registrationRepository.findPaginated(page, limit, eventFilter);
  }

  async getRegistrationsForExport(eventFilter?: string): Promise<Registration[]> {
    return this.registrationRepository.findAllByEvent(eventFilter);
  }

  async deleteRegistration(id: string) {
    return this.registrationRepository.delete(id);
  }

  async getDashboardStats() {
    return this.registrationRepository.getDashboardStats();
  }
}
