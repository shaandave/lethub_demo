export interface IProperty {
    properties: Array<IPropertyForm>;
    countProperties: number;
}

export interface IPropertyForm {
    id?: number;
    userId: number;
    type: string;
    propertyName: string;
    countAllUnits: number;
    countVacantUnits: number;
    numberUnits: number;
    leaseTerm: string;
    address: string;
    parking: boolean;
    parkingCost: number;
    parkingCovered: boolean;
    parkingSecured: boolean;
    offstreetParking: boolean;
    petFriendly: boolean;
    petPolicy: string;
    applicationProcess: string;
    acceptSec8: boolean;
    acceptSecCoSigner: boolean;
    incomeRequirement: string;
    applicationFee: boolean;
    appFeeNonRefundable: boolean;
    applicationFeeCost: number;
    noSmoking: boolean;
    utilities: Array<string>;
    amenities: Array<string>;
    appliances: Array<string>;
    createdAt?: string;
    updatedAt?: string;
    image?: IImage;
    url: string;
    user: string;
    email: string;
    name: string;
    activeStatus: string;
    landlordOrPm: string;
    ownerName: string;
    ownerEmail: string;
    lat: any;
    long: any;
    
}

export interface IImage {
    id?: number;
    url: string;
    name?: string;
}


export interface IPropertyCreatedData {
    property: IPropertyForm;
}


export interface IDictionary {
    amenities: Array<string>,
    utilities: Array<string>,
    appliances: Array<string>
}
