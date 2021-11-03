const {
    degreesToRadians,
    getDistanceBetweenLocations,
    addressToCoordinates,
    compareTwoListings,
    getCoordinatesForProperties,
    downloadPictures,
    filterDuplicateListings
} = require('../app/services/utilityFunctions');

const expect = require('chai').expect;

describe('initial test', function () {
    
    describe('degreesToRadians()', function(){
        it('Convert degree to radians', function (){
        
            expect(degreesToRadians(0)).to.equal(0);
            expect(degreesToRadians(180)).to.equal(Math.PI);
            expect(degreesToRadians(360)).to.equal(2*(Math.PI));
    
        });
    });
    
    describe('getDistanceBetweenLocations()', function(){
        it('Get the distance between two coordinates', function(){
        
            //Toronto
            let coordinates1 = [43.653225,-79.383186];
    
            //Victoria
            let coordinates2 = [48.428421,-123.365646];
    
            //3,388 km
            let knownDistanceBetweenCoordinates = 3388;
    
            
            let result = getDistanceBetweenLocations(coordinates1[0],coordinates1[1],coordinates2[0],coordinates2[1]);
    
            expect(Math.floor(result)).to.equal(knownDistanceBetweenCoordinates);
        });

        it('Get the distance of same coordinate', function(){
        
            //Toronto
            let coordinates1 = [43.653225,-79.383186];
    
            //Toronto
            let coordinates2 = [43.653225,-79.383186];
    
            let knownDistanceBetweenCoordinates = 0;
    
            
            let result = getDistanceBetweenLocations(coordinates1[0],coordinates1[1],coordinates2[0],coordinates2[1]);
    
            expect(Math.floor(result)).to.equal(knownDistanceBetweenCoordinates);
        });

        
    });

    describe('addressToCoordinates()', () => {
        

        it('Convert address to coordinate', async () => {
            
            const result = await addressToCoordinates("777 Fort St, Victoria, BC V8W 1H2");
            expect(result).to.have.members([48.4241515,-123.3631961]);

        });

    });

    describe('getCoordinatesForProperties()', () => {
        it('Get the coordinates for a list of properties', async () => {
            let listingList = 
            [
                //Victoria
                {
                    //unitId: "4",
                    address: "777 Fort Street, Victoria, BC",
                    //coordinates: [48.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                },

                {
                    //unitId: "4",
                    address: "777 Fort Street, Victoria, BC",
                    //coordinates: [48.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                },

                {
                    //unitId: "4",
                    address: "777 Fort Street, Victoria, BC",
                    //coordinates: [48.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                }
            ]
            let result = await getCoordinatesForProperties(listingList);
            expect(result[0].coordinates).to.have.members([48.4241515,-123.3631961]);
            expect(result[1].coordinates).to.have.members([48.4241515,-123.3631961]);
            expect(result[2].coordinates).to.have.members([48.4241515,-123.3631961]);

        });
    });

    describe('compareTwoListings()', () => {
        it('compare two listings that are too far away', () => {
            //Fort Street
            let listing1 = 
                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [48.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                }

            //Fort Street
            let listing2 = 
                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [0,0],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                }

            let result = compareTwoListings(listing1, listing2);
            
            expect(result).to.equal(0);

        });

        it('compare the same listing', () => {
            //Fort Street
            let listing1 = 
                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [48.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                }

            //Fort Street
            let listing2 = 
                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [48.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                }

            let result = compareTwoListings(listing1, listing2);

            //Max value is 12
            expect(result).to.equal(12);
        });

        describe('downloadPictures()', () => {
            it('Download pictures and store them on the local', async () => {
               let result = await downloadPictures(1);
               expect(result).to.be.equal(true);
            });
        });


        describe('filterDuplicateListings()', () => {
            let listingList1 = 
            [
                //Victoria
                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [48.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                },

                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [58.424035,-100.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                },

                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [60.424035,-130.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                }
            ]

            let listingList2 = 
            [
                //Victoria
                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [38.424035,-123.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                },

                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [58.424035,-100.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                },

                {
                    //unitId: "4",
                    //address: "777 Fort Street, Victoria, BC",
                    coordinates: [60.424035,-130.363228],
                    bed: "2",
                    bath: "1",
                    rentalType: "Apartment",
                    price: "2000",
                    description: "yeet",
                    squareSpace: "300",
                    squareUnit: "feet",
                    laundry: "None",
                    parking: "Street parking",
                    AC: "Central AC",
                    heating: "Gas heating",
                    cat: true,
                    dog: false
                    
                }
            ]

            it('Filter same list', () => {
                let result = filterDuplicateListings(listingList1, listingList1);
                expect(result).to.be.empty;
            });

            it('Filter similar list', () => {
                let result = filterDuplicateListings(listingList1, listingList2);
                let expectedResult = 
                [
                    {
                        coordinates: [48.424035,-123.363228],
                        bed: "2",
                        bath: "1",
                        rentalType: "Apartment",
                        price: "2000",
                        description: "yeet",
                        squareSpace: "300",
                        squareUnit: "feet",
                        laundry: "None",
                        parking: "Street parking",
                        AC: "Central AC",
                        heating: "Gas heating",
                        cat: true,
                        dog: false
                    }
                ]
                expect(result).to.eql(expectedResult);
            });

            it('Filter different list', () => {
                let differingList = 
                [
                    //Victoria
                    {
                        //unitId: "4",
                        //address: "777 Fort Street, Victoria, BC",
                        coordinates: [0,-123.363228],
                        bed: "2",
                        bath: "1",
                        rentalType: "Apartment",
                        price: "2000",
                        description: "yeet",
                        squareSpace: "300",
                        squareUnit: "feet",
                        laundry: "None",
                        parking: "Street parking",
                        AC: "Central AC",
                        heating: "Gas heating",
                        cat: true,
                        dog: false
                        
                    },
    
                    {
                        //unitId: "4",
                        //address: "777 Fort Street, Victoria, BC",
                        coordinates: [58.424035, 0],
                        bed: "2",
                        bath: "1",
                        rentalType: "Apartment",
                        price: "2000",
                        description: "yeet",
                        squareSpace: "300",
                        squareUnit: "feet",
                        laundry: "None",
                        parking: "Street parking",
                        AC: "Central AC",
                        heating: "Gas heating",
                        cat: true,
                        dog: false
                        
                    },
    
                    {
                        //unitId: "4",
                        //address: "777 Fort Street, Victoria, BC",
                        coordinates: [0,-130.363228],
                        bed: "2",
                        bath: "1",
                        rentalType: "Apartment",
                        price: "2000",
                        description: "yeet",
                        squareSpace: "300",
                        squareUnit: "feet",
                        laundry: "None",
                        parking: "Street parking",
                        AC: "Central AC",
                        heating: "Gas heating",
                        cat: true,
                        dog: false
                        
                    }
                ]
                let result = filterDuplicateListings(listingList1, differingList);

                expect(result).to.eql(listingList1);
            });
        });


    });
    
})
