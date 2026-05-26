import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

// Destinatario
@Schema({ _id: false })
class Recipient {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop() email?: string;
  @Prop({ required: true }) phone: string;
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) department: string;
  @Prop({ required: true }) municipality: string;
  @Prop() reference?: string;
  @Prop() notes?: string;
}

// Paquete
@Schema({ _id: false })
class Package {
  @Prop({ required: true }) length: number;
  @Prop({ required: true }) height: number;
  @Prop({ required: true }) width: number;
  @Prop({ required: true }) weight: number;
  @Prop({ required: true }) content: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ required: true })
  pickupAddress: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ type: Object, required: true })
  recipient: Recipient;

  @Prop({ type: [Object], required: true })
  packages: Package[];

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ default: false })
  isCOD: boolean;

  @Prop({ default: 0 })
  expectedAmount: number;

  @Prop({ default: 0 })
  collectedAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ scheduledDate: 1 });
OrderSchema.index({
  'recipient.firstName': 'text',
  'recipient.lastName': 'text',
});
