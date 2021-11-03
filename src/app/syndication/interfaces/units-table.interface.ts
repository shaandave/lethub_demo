export interface IUnitsTable {
  units: Array<IUnitData>;
  countUnits: number;
}

export interface IUnitData {
  id: number;
  userId: number;
  propertyId: number;
  showingAgent: number,
  rent: string;
  deposit: string;
  status: string;
  title: string;
  description: string;
  amenities: any;
  utilities: any;
  applicationProcess: string;
  moveInDate: Date,
  appliances: any;
  utilityBill: number,
  parking: boolean;
  parkingCost: number;
  parkingCovered: boolean;
  parkingSecured: boolean;
  offstreetParking: boolean;
  furnished: boolean,
  petFriendly: boolean;
  petPolicy: string;
  applicationFee: boolean;
  appFeeNonRefundable: boolean;
  applicationFeeCost: number;
  sharedLaundry: boolean;
  sharedWashroomBath: boolean;
  unitShared: boolean;
  unitSharedPeople: number;
  bed: number;
  bath: number;
  sqFt: number;
  leaseTerm: string;
  email: string;
  phone: string;
  unit: string;
  address: string;
  area: number;
  link?: string;
  videoLink: string;
  createdAt?: string;
  updatedAt?: string;
  noSmoking: boolean;
  slug?: string;
  acceptSecCoSigner: boolean;
  acceptSec8: boolean;
  incomeRequirement: string;
  trackManualChange: boolean;
}
