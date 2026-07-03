import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcomeMessage(): { message: string } {
    return { message: 'Welcome to Myristica Season 5!' };
  }
}
