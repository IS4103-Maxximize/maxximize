import { Entity, ManyToOne } from "typeorm";
import { DeliveryRequest } from "../../delivery-requests/entities/delivery-request.entity";
import { LineItem } from "../../line-Items/LineItem";

@Entity()
export class DeliveryRequestLineItem extends LineItem {

    @ManyToOne(() => DeliveryRequest, deliveryRequest => deliveryRequest.deliveryRequestLineItems)
    deliveryRequest: DeliveryRequest;
}
