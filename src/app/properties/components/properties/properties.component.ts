import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IProperty } from '../../interfaces/property.interface';
import { MatDialog } from '@angular/material/dialog';
// import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { PropertiesService } from '../../services/properties.service';
import { loadavg } from 'os';
import { ElectronService } from '../../../core/services/electron/electron.service'
// import { TrialExpiredPopupComponent } from '../../../popups/components/trial-expired-popup/trial-expired-popup.component';
@Component({
  selector: 'l-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {

  @Input() propertiesList: IProperty;
  @Input() images: any;

  constructor(
    private dialog: MatDialog,
    private propserv: PropertiesService,
    private cdr: ChangeDetectorRef,
    private electronService: ElectronService,
  ) { }

  public goToPropPage(id) {
    var url = `https://app.lethub.co/#/properties/property/${id}`;
    console.log(url);

    var shell = require('electron').shell;
    //open links externally by default
    shell.openExternal(url);
  }
}
