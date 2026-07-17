import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration } from './schemas/registration.schema';

@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectModel(Registration.name)
    private readonly registrationModel: Model<Registration>,
  ) {}

  async create(registration: Partial<Registration>): Promise<Registration> {
    const newRegistration = new this.registrationModel({
      ...registration,
      email: registration.email?.toLowerCase(), // Ensure lowercase in DB
    });
    return newRegistration.save();
  }

  async findByEmailAndEvent(email: string, eventName: string): Promise<Registration | null> {
    return this.registrationModel.findOne({ 
      email: email.toLowerCase(), 
      eventName 
    }).exec();
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findPaginated(page: number, limit: number, eventFilter?: string): Promise<{ data: Registration[], total: number }> {
    const query = eventFilter && eventFilter !== 'All' ? { eventName: eventFilter } : {};
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.registrationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.registrationModel.countDocuments(query).exec()
    ]);
    
    return { data, total };
  }

  async findAllByEvent(eventFilter?: string): Promise<Registration[]> {
    const query = eventFilter && eventFilter !== 'All' ? { eventName: eventFilter } : {};
    return this.registrationModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async delete(id: string): Promise<Registration | null> {
    return this.registrationModel.findByIdAndDelete(id).exec();
  }

  async updatePaymentStatus(id: string, status: string): Promise<Registration | null> {
    return this.registrationModel.findByIdAndUpdate(id, { paymentStatus: status }, { new: true }).exec();
  }

  async getDashboardStats() {
    const totalRegistrations = await this.registrationModel.countDocuments().exec();

    // Today's Date Boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayRegistrations = await this.registrationModel.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd }
    }).exec();

    // Group by Event
    const eventDistribution = await this.registrationModel.aggregate([
      { $group: { _id: "$eventName", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Group by College (top 5)
    const topColleges = await this.registrationModel.aggregate([
      { $group: { _id: "$college", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Group by Date (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const timeline = await this.registrationModel.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    return {
      totalRegistrations,
      todayRegistrations,
      eventDistribution: eventDistribution.map(d => ({ name: d._id, count: d.count })),
      topColleges: topColleges.map(c => ({ name: c._id, count: c.count })),
      timeline: timeline.map(t => ({ date: t._id, count: t.count }))
    };
  }
}
