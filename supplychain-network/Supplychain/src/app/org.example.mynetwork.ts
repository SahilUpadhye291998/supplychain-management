import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.mynetwork{
   export class Contract extends Asset {
      contractId: string;
      grower: Grower;
      importer: Importer;
      shipper: Shipper;
      arrivalDateTime: Date;
      unitPrice: number;
      minTemprature: number;
      maxTemprature: number;
   }
   export class Shipment extends Asset {
      shipmentId: string;
      productType: ProductType;
      shipmentStatus: ShipmentStatus;
      tempratureReading: TempratureReading[];
      unitCount: number;
      contract: Contract;
   }
   export enum ProductType {
      BANANA,
      PEACHES,
      APPLE,
      PEARS,
      ORANGE,
   }
   export enum ShipmentStatus {
      CREATED,
      IN_TRANSIT,
      ARRIVED,
   }
   export abstract class Business extends Participant {
      email: string;
      accountBalance: number;
      address: Address;
   }
   export class Address {
      city: string;
      state: string;
      country: string;
      pincode: string;
   }
   export class Grower extends Business {
   }
   export class Importer extends Business {
   }
   export class Shipper extends Business {
   }
   export class TempratureReading extends Transaction {
      celcious: number;
   }
// }
