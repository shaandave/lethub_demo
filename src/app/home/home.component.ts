import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services/electron/electron.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private electronService: ElectronService) { }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }

  onRunFacebookScript(){
    //Example Properties to send to backend
    // let properties = 
    // [
    //   //Fort Street
    //   {
    //     unitId: "4",
    //     address: "777 Fort Street, Victoria, BC",
    //     bed: "2",
    //     bath: "1",
    //     rentalType: "Apartment",
    //     price: "2000",
    //     description: "yeet",
    //     squareSpace: "300",
    //     squareUnit: "feet",
    //     laundry: "None",
    //     parking: "Street parking",
    //     AC: "Central AC",
    //     heating: "Gas heating",
    //     cat: true,
    //     dog: false
    //     //pictureArray: ['/home/ken/Pictures/cabin-with-a-view.jpg','/home/ken/Pictures/bigloft.jpg','/home/ken/Pictures/cabinlivingarea.jpg']
    //   },

    //   {
    //     unitId: "40",
    //     address: "Parkway Rd, Zeballos, BC V0P, Canada",
    //     price: '6000',
    //     rentalType: 'House',
    //     laundry: 'Laundry in building',
    //     parking: 'Off-street parking',
    //     AC: 'None',
    //     heating: 'Radiator heating',
    //     bed: '2',
    //     bath: '2',
    //     squareSpace: '',
    //     squareUnit: "feet",
    //     description: '2 Bed 2 Bath Cabin in a secluded and quiet area.\n' +
    //       '\n' +
    //       'The place was recently renovated in 2017 and has a modern look, but still has that rustic cabin feel.\n' +
    //       '\n' +
    //       'Price is 6000 per month everything included. See Less',
    //     //pictureArray: ['/home/ken/Pictures/cabin-with-a-view.jpg','/home/ken/Pictures/bigloft.jpg','/home/ken/Pictures/cabinlivingarea.jpg']
    //     cat: true,
    //     dog: false
    //   }
    // ]

    //Unit Ids
    let listings = [4,2,10];
    this.electronService.send('facebook', listings);

    // this.electronService.send('login', {
    //   token:"test",
    //   refreshToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDcxLCJpYXQiOjE2MzEzMDQ1NTMsImV4cCI6MTYzMTkwOTM1M30.TRfehiy6dN9OA-9i9yMolvISoFxOgZb2u7Y7rBjx5EAsBl7g7UBycYxMRZ16wppD3EI17JLmecVILNH22oOkyYDe67wLb5YcgLfcDkXMtbC4WVk478QUXQk6BbOdKyfmTaMAkxv2pGhLJCSelzzojZUsFH5uEBS",
    //   userId:"1"
    // });

  }

}
