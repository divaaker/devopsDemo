import { LightningElement, api } from 'lwc';
export default class FileUploadExample extends LightningElement {
    @api
    myRecordId;

    get acceptedFormats() {
        return ['.pdf', '.png','.csv'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        const filedata = this.template.querySelector('[data-id="fileData"]');
        console.log('filedata=='+JSON.stringify(filedata));
        const text = event.target.result;
        console.log('text=='+text);
        const result = this.load(uploadedFiles);
        console.table('result=='+ JSON.stringify(result));
        const content = document.querySelector('.content');
        const reader = new FileReader();
        this.parseFile(uploadedFiles);
        //var allTextLines = uploadedFiles.split(/\r\n|\n/);
        //var headers = allTextLines[0].split(',');
        // console.table('headers=='+reader.readAsText(uploadedFiles));
        // console.log('allTextLines=='+ JSON.stringify(uploadedFiles));
        alert('No. of files uploaded : ' + uploadedFiles.length);
    }

    async load(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            // reader.onload = function() {
            //     resolve(reader.result);
            // };
            // reader.onerror = function() {
            //     reject(reader.error);
            // };
            console.log(file);
            reader.readAsText(file);
        });
    }

    parseFile(file) {
    console.log(file);
    // display an image
    if (file.type.indexOf("image") == 0) {
      var reader = new FileReader();
      reader.onload = (e) => {

        console.log(e);
        console.log(e.target.result);

        file.src = e.target.result;
        this.fileList.push(file);
        this.mediaUploaded.emit(this.fileList);
      }
      reader.readAsDataURL(file);
    }

    // display text
    if (file.type.indexOf("text") == 0) {
      var reader = new FileReader();
      reader.onload = function (e) {
        console.log(e);
      }
      reader.readAsText(file);
    }

  }

}