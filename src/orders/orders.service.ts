import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderDocument> {
    const orderNumber = 'BOX-' + Date.now();
    const order = new this.orderModel({
      ...dto,
      userId,
      orderNumber,
      isCOD: dto.isCOD ?? false,
      expectedAmount: dto.expectedAmount ?? 0,
    });
    return order.save();
  }

  async findAll(userId: string, filters: FilterOrderDto) {
    const page = parseInt(filters.page || '1', 10) || 1;
    const limit = parseInt(filters.limit || '10', 10) || 10;

    // Construir query dinámico: siempre filtrar por userId
    const query: any = { userId };

    // Búsqueda de texto en recipient nombre/apellido
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Filtro por status exacto
    if (filters.status) {
      query.status = filters.status;
    }

    // Filtro por rango de fechas
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findOne(userId: string, orderId: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findOne({ _id: orderId, userId })
      .exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  async updateStatus(
    orderId: string,
    status: string,
    collectedAmount?: number,
  ): Promise<OrderDocument> {
    const updateData: any = { status };
    if (collectedAmount !== undefined) {
      updateData.collectedAmount = collectedAmount;
    }

    const order = await this.orderModel
      .findByIdAndUpdate(orderId, updateData, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }
}
