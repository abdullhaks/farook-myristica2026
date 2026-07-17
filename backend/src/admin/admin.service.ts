import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminExists = await this.adminModel.findOne({ username: 'adminmyristica' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('myristicaadmin999', 10);
      await this.adminModel.create({
        username: 'adminmyristica',
        password: hashedPassword,
      });
      console.log('Default admin user created.');
    }
  }

  async validateAdmin(username: string, pass: string): Promise<any> {
    const admin = await this.adminModel.findOne({ username });
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      const { password, ...result } = admin.toObject();
      return result;
    }
    return null;
  }

  async login(admin: any) {
    const payload = { username: admin.username, sub: admin._id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '10m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '2d' }),
    };
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newPayload = { username: payload.username, sub: payload.sub };
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(adminId: string, oldPass: string, newPass: string) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isValid = await bcrypt.compare(oldPass, admin.password);
    if (!isValid) throw new UnauthorizedException('Invalid old password');

    const hashedNewPass = await bcrypt.hash(newPass, 10);
    admin.password = hashedNewPass;
    await admin.save();
    return { message: 'Password updated successfully' };
  }
}
