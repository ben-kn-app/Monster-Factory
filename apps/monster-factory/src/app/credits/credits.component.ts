import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'credits',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss'],
})
export class CreditsModal implements OnInit {
    public isModal: boolean = false; // * Property to catch if component is on the modal or not
    constructor(private router: Router, private modalController: ModalController) {}

    ngOnInit(): void {
        console.log('Credits ngOnInit');
        this.checkIfModal();
    }
    /**
     * * Check if component was opened on a modal
     */
    public checkIfModal() {
        void this.modalController.getTop().then(res => {
            if (res) {
                this.isModal = true;
            }
        });
    }

    /**
     * * Function to close modal
     */
    public closeModal() {
        void this.modalController.dismiss();
    }
}
