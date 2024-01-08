import { LightningElement, wire, api } from 'lwc';

import getCampaignImages from '@salesforce/apex/ContactImages.getCampaignImages';

export default class CarouselLWC extends LightningElement {

  @wire(getCampaignImages) images;

  @wire(getCampaignImages)

  wiredImages({ error, data }) {

    console.log(error);

    console.log(data);

}

 

}