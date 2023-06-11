import { Component, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { OnInit, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AiserviceService } from '../services/aiservice.service';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
//-------------- SWEET ALERT --------------------------
declare var swal: any;
//-------------- SWEET ALERT --------------------------
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit, OnDestroy {

  //####################################################
  //liveOrLocalUrl = 'http://localhost:3000';
  liveOrLocalUrl = 'https://chatbotaiapi.onrender.com';
  //####################################################

  docxContent!: string;  // Assuming you have the DOCX content in this variable
  docxUrl!: any;

  fileAndFilenames: any = [];
  uploadedFiles: any = [];
  backgroundColor1: any;
  backgroundColor2: any;
  selectedFile: File | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private http: HttpClient,
    private toastr: ToastrService,
    private aiservice: AiserviceService
  ) {
    console.log('USING URL : ' + this.liveOrLocalUrl);
  }
  pdfSrc: any;
  onFileSelected(val: any, option: any) {
    for (let i = 0; i < this.fileAndFilenames.length; i++) {//arun
      console.log(this.fileAndFilenames[i].filename);
      console.log(this.fileAndFilenames[i].file);
    }

    console.log('OPTION: ' + JSON.stringify(option));
    console.log(option.name);
    let parts = option.name.split('.');
    console.log('parts[0] :: ' + parts[0]);
    console.log('parts[1] :: ' + parts[1]);
    //----------------- PDF FILE DISPLAY --------------------
    if (parts[1] === 'pdf') {
      let $img: any = document.querySelector('#file');
      console.log($img);

      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();

        reader.onload = (e: any) => {
          this.pdfSrc = e.target.result;
          console.log(this.pdfSrc);
          //--------------------------------
          var blob = new Blob([this.pdfSrc], { type: 'application/pdf' });
          var blobURL = URL.createObjectURL(blob);
          console.log('blobURL : ' + blobURL);
          window.open(blobURL);
          //----------------------
        };
        console.log('val :: ' + val);
        reader.readAsArrayBuffer($img.files[val]);
      }
    }
    //----------------- PDF FILE DISPLAY --------------------
    //----------------- DOCX FILE DISPLAY --------------------
    if (parts[1] === 'docx') {
      console.log('DOCX FILE DISPLAY');
      for (let i = 0; i < this.fileAndFilenames.length; i++) {//arun
        if (this.fileAndFilenames[i].filename === option.name) {
          console.log('YES FILENAME :' + this.fileAndFilenames[i].filename);
          console.log('YES FILE :' + this.fileAndFilenames[i].file);
          //----------------
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const docxContent: string = e.target.result;
            //console.log(docxContent);
            //--------------------------------
            const blob = new Blob([this.docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            this.docxUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
            window.open(this.docxUrl.changingThisBreaksApplicationSecurity);
            //----------------------
          };
          reader.readAsText(this.fileAndFilenames[i].file);
        }
      }
    }
    //----------------- DOCX FILE DISPLAY --------------------
    //----------------- TXT FILE DISPLAY --------------------
    if (parts[1] === 'txt') {//WORKING
      console.log('TXT FILE DISPLAY');
      for (let i = 0; i < this.fileAndFilenames.length; i++) {//arun
        if (this.fileAndFilenames[i].filename === option.name) {
          console.log('YES FILENAME :' + this.fileAndFilenames[i].filename);
          console.log('YES FILE :' + this.fileAndFilenames[i].file);
          //----------------
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const txtContent: string = e.target.result;
            // Process the DOCX content
            //console.log(txtContent);
            //--------------------------------
            var blob = new Blob([txtContent], { type: 'text/plain' });
            var blobURL = URL.createObjectURL(blob);
            console.log('blobURL : ' + blobURL);
            window.open(blobURL);
            //----------------------
          };
          reader.readAsText(this.fileAndFilenames[i].file);
          //----------------
        }
      }
    }
    //----------------- TXT FILE DISPLAY --------------------

  }
  displayAttachResult: any;
  printflg: boolean = false;
  filteredStatus: any;
  optionHighlight: any;
  highlight = '';
  condition = '';
  loading: boolean = false;
  nodatafound: boolean = false;

  private activatedSub!: Subscription;
  isHovering!: boolean;
  files: File[] = [];
  //--------------
  displayResult: any;
  options: any = [];
  searchTxt: string = '';
  ngOnInit(): void {
    this.backgroundColor1 = '#E8E9EC';
    this.backgroundColor2 = '#7eea8a';
  }
  ngOnDestroy(): void {
    if (this.activatedSub === undefined) { } else {
      this.activatedSub.unsubscribe();
    }

  }

  toggleHover(event: boolean) {
    this.isHovering = event;
    console.log(this.isHovering);
  }

  onDrop(files: any) {
    this.loading = false;
    //-----------------------------------
    this.uploadFile(files);//$event.target.files
    //-----------------------------------
    /*  for (let i = 0; i < files.length; i++) {
       this.files.push(files.item(i));
       console.log(files.item(i));
     } */
    //1685449072265
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
      console.log(files.item(i));
      const path = `${Date.now()}_${files.item(i).name}`;
      console.log(path);
      this.options.push({ name: files.item(i).name, uploadedDtTm: this.getUploadedDtTmFromUnixTimestamp('1685952511'), value: i, checked: false });
    }
    console.log(files.item(0).name);
    this.selectedFile = files.item(0).name;
    console.log(this.options);
  }
  getUploadedDtTmFromUnixTimestamp(dttmUnix: any) {
    let uploadedDtTm = moment.unix(dttmUnix / 1000).format("DD-MMM-YYYY hh:mm:ss A");
    return uploadedDtTm;
  }
  viewPDF(filename: any) {
    window.open(filename, '_blank');
  }
  /*   searchInPdf() {
      console.log('searchInPdf');
      console.log(this.selectedOptions);
      console.log(this.options);
      this.testMockPromise();
    } */
  async searchInPdfOOLLDD() {
    this.displayAttachResult = '';
    console.log(this.selectedOptions);
    console.log(this.selectedFile);


    /* if (this.selectedOptions.length === 0) {
      console.log('Please select atleast one file.');
      alert('Please select atleast one PDF file.');
      return;
    } */
    if (this.searchTxt === '') {
      console.log('Please enter search text');
      //alert('Please enter search text');
      this.warningToastMsg('Please enter search text');
      return;
    }
    console.log(this.searchTxt);
    //console.log(this.selectedOptions);//firebase pdf url
    console.log(this.options);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.displayResult = '';
    //rocky
    ////---->>>>this.displayResult = await this.mockPromisetestpdf(this.selectedFile, 0, this.searchTxt);

    console.log(this.displayResult);
    this.displayResult = this.displayResult + '\n\n';
    this.printflg = true;
    this.displayAttachResult = this.displayResult;
    console.log("final");
    console.log('this.displayAttachResult :: ' + this.displayAttachResult);
    //------------------------
    if (this.printflg) {
      const collection = document.getElementsByClassName("card-text");
      collection[0].innerHTML = "";
      this.typeText(collection[0], this.displayAttachResult);
    }
    //------------------------
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }




  async testMockPromise() {
    this.displayAttachResult = '';
    console.log(this.selectedOptions);


    if (this.selectedOptions.length === 0) {
      console.log('Please select atleast one file.');
      alert('Please select atleast one PDF file.');
      return;
    }
    if (this.searchTxt === '') {
      console.log('Please enter search text');
      alert('Please enter search text');
      return;
    }
    console.log(this.searchTxt);
    //console.log(this.selectedOptions);//firebase pdf url
    console.log(this.options);



    for (let i = 0; i < this.selectedOptions.length; i++) {
      //-----------------
      console.log(this.options[this.selectedOptions[i]].name);
      console.log(this.options[this.selectedOptions[i]].value);
      //console.log(this.options[this.selectedOptions[i]].url);
      console.log(this.searchTxt);
      //-----------------

      this.highlight = '';
      this.optionHighlight = -1;
      this.warningToastMsg(this.options[this.selectedOptions[i]].name + ' - [ Processing... ]');
      this.displayAttachResult = '';
      //SEND PDF BLOB INSTEAD OF URL.......................
      let $img: any = document.querySelector('#file');

      if (typeof (FileReader) !== 'undefined') {
        let reader = new FileReader();

        reader.onload = async (e: any) => {
          this.pdfSrc = e.target.result;
          console.log(this.pdfSrc);
          //+++++++++++++++++++
          /*  var blobx = new Blob( [this.pdfSrc], { type: "application/pdf" });
           var urll = URL.createObjectURL(blobx); */
          //+++++++++++++++++++
          //----------------------
          const blob = new Blob([new Uint8Array(this.pdfSrc)], { type: 'application/pdf' });
          console.log(blob);

          const file = e.target.files[0];
          console.log(file);
          //----------------------
          //SEND PDF BLOB INSTEAD OF URL.......................
          ////---this.displayResult = await this.mockPromise(this.options[this.selectedOptions[i]].name, this.options[this.selectedOptions[i]].value,pdfBlob, this.searchTxt);
          //this.displayResult = await this.mockPromise(this.options[this.selectedOptions[i]].name, this.options[this.selectedOptions[i]].value, file, this.searchTxt);

          console.log('FOR VALUE OF i : ' + i + ' --> ' + this.displayResult);
          this.displayResult = this.displayResult + '\n\n';
          //----------------------
        };
        //reader.readAsArrayBuffer($img.files[0]);
        //this.options[this.selectedOptions[i]].value
        console.log('val :: ' + this.options[this.selectedOptions[i]].value);
        reader.readAsArrayBuffer($img.files[this.options[this.selectedOptions[i]].value]);
      }

    }//for loop
    this.printflg = true;
    this.displayAttachResult = this.displayResult;
    console.log("final");
    console.log('this.displayAttachResult :: ' + this.displayAttachResult);

  }


  typeText(element: any, text: any) {
    let index = 0;

    let interval = setInterval(() => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }
  //============================= SWEET ALERT ====================================
  fileSuccessUploadMsg(msg: any) {
    //--------------------
    swal("Upload Status!", msg, "success", {
      button: "OK",
    });
  }
  fileErrorUploadMsg(msg: any) {
    //--------------------
    swal("Upload Status!", msg, "error", {
      button: "OK",
    });
  }
  fileWarningUploadMsg(msg: any) {
    //--------------------
    swal("Upload Status!", msg, "warning", {
      button: "OK",
    });
  }
  showFileProcessedToast(filename: any) {
    //this.toastr.success('Hello world!'+filename, 'Toastr fun!');
  }

  successToastMsg(msg: any): void {
    this.toastr.success(msg, 'AI-BOT-PDF');
  }
  errorToastMsg(msg: any): void {
    this.toastr.error(msg, 'AI-BOT-PDF');
  }
  warningToastMsg(msg: any): void {
    this.toastr.warning(msg, 'AI-BOT-PDF');
  }
  get selectedOptions() { // right now: ['1','3']
    return this.options
      .filter((opt: any) => opt.checked)
      .map((opt: any) => opt.value);
    //.map(opt => opt.url);
  }
  //----------------------------

  //------------------------------------------------

  uploadFile(files: any) {
    this.loading = true;
    this.selectedFile = files[0];
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:3000/upload', formData)
      .subscribe(
        async (data) => {
          console.log('File uploaded successfully.');
          console.log(data);
          this.loading = false;
        },
        error => {
          console.error('Error 123 occurred while uploading the file:', error);
        }
      );
  }
  //---------------------------------------------------------
  mockPromisetestpdf(filename: any, value: any, searchTxt: any) {
    this.optionHighlight = value;
    this.highlight = 'highlight';

    console.log('value : ' + value);
    console.log('filename : ' + filename);
    console.log('searchTxt : ' + searchTxt);

    this.condition = 'mydisable';
    this.loading = true;

    return new Promise(async (res, rej) => {
      //--------------------------------
      //this.aiservice.aiServiceToGetSearchResults(searchTxt).subscribe((data: any) => {
      this.aiservice.aiServiceToGetSearchMultipleResults(searchTxt, filename).subscribe((data: any) => {

        this.successToastMsg(filename + ' - [ Success ]');
        console.log(data);
        console.log(data.output_text);
        //this.displayResult = this.displayResult + '+++\n\n+++' + data.output_text;
        this.displayResult = this.displayResult + '\n\n' + data.output_text;
        this.highlight = '';
        this.optionHighlight = -1;
        this.condition = '';
        this.loading = false;
        this.nodatafound = false;
        ////res("done : " + value);
        res(this.displayResult);
      }, (err: any) => {
        this.errorToastMsg(filename + ' - [ Failed ]');
        console.log('ERROR RETURNED : ' + JSON.stringify(err));
        this.highlight = '';
        this.optionHighlight = -1;
        this.condition = '';
        this.loading = false;
        ////res("done : " + value);
        this.displayResult = this.displayResult + '';
        res(this.displayResult);
        if (this.displayResult != '') {
          this.nodatafound = false;
        } else {
          this.nodatafound = true;
        }

      });
      //--------------------------------
    });
  }
  //----------------------------- MULTIPLE FILES UPLOADING -----------------------
  async onDropMulti(files: any) {
    this.searchTxt = '';
    //--------- CLEAR displayAttachResult ------------
    const collection = document.getElementsByClassName("card-text");
    collection[0].innerHTML = "";
    this.typeText(collection[0], '');
    //--------- CLEAR displayAttachResult ------------
    this.options = [];
    console.log(files.length);
    if (files.length === 0) {
      //alert('Please select atleast one PDF File');
      this.warningToastMsg('Please select atleast one PDF File');
      return;
    }
    //FILE NAME EXTENSION CHECKING
    for (let i = 0; i < files.length; i++) {
      console.log(files.item(i).name);
      let filename = files.item(i).name;
      var parts = filename.split('.');
      var extension = parts.pop();
      let ext = extension.toLowerCase();
      console.log(ext);
      if (ext == 'pdf' || ext == 'doc' || ext == 'docx' || ext == 'txt') {
      } else {
        this.errorToastMsg('Please select only PDF/DOCX/TXT files.');
        return;
      }
    }
    //FILE NAME EXTENSION CHECKING
    //------------------- COLLECT FILE AND FILE NAME IN ARRAY ---------------------
    this.fileAndFilenames = [];
    for (let i = 0; i < files.length; i++) {//arun
      this.fileAndFilenames.push({ 'file': files.item(i), 'filename': files.item(i).name });
    }
    //------------------- COLLECT FILE AND FILE NAME IN ARRAY ---------------------
    //------------------ DELETE OLD PDF FILES IN SERVER TAKING NAMES FROM LOCALSTORAGE ---------------------
    let filenames = localStorage.getItem('filenames');
    console.log('LOCAL STORAGE FILE NAMES : ' + filenames);
    if (filenames == null) {
      console.log('NO FILE NAMES IN LOCAL STORAGE');
    } else {
      //DELETED THE PDF FILES WITH NAMES IN LOCAL STORAGE...
      console.log('LOCAL STORAGE FILE NAMES -- REMOVING --: ' + filenames);
      localStorage.removeItem('filenames');
      let filenamesArr = filenames.split(',');
      console.log(filenamesArr);
      for (let i = 0; i < filenamesArr.length; i++) {
        console.log(filenamesArr[i]);
        //REMOVE THE FILE WITH PDF IN UPLOADS SERVER FOLDER................
        let parts = filenamesArr[i].split('.');
        console.log('NAME ALONE : ' + parts[0]);
        let filenameDelPDF = parts[0] + '.pdf';
        console.log('filenameDelPDF :: ' + filenameDelPDF);
        //----------------------
        this.aiservice.aiServiceToDeleteFile(filenameDelPDF).subscribe((data) => {
          console.log(data);
        },
          (error) => {
            console.log(error);
          });
        //----------------------
        //REMOVE THE FILE WITH PDF IN UPLOADS SERVER FOLDER................
      }
    }
    //------------------ DELETE OLD PDF FILES IN SERVER TAKING NAMES FROM LOCALSTORAGE ---------------------

    this.loading = false;
    //-----------------------------------
    //this.uploadFile(files);//$event.target.files
    //-----------------------------------
    console.log(files);
    this.uploadedFiles = [];
    for (let i = 0; i < files.length; i++) {
      //--------------------------------
      this.uploadedFiles.push(files.item(i).name);
      //--------------------------------
      this.files.push(files.item(i));
      console.log(files.item(i));
      const filenameWithDateTm = `${Date.now()}_${files.item(i).name}`;
      console.log(filenameWithDateTm);
      this.options.push({ filenameDtTm: filenameWithDateTm, name: files.item(i).name, uploadedDtTm: this.getUploadedDtTmFromUnixTimestamp('1685952511'), value: i, checked: false });

      //---------------------
      let filename = files.item(i).name;
      var parts = filename.split('.');
      var extension = parts.pop();
      let ext = extension.toLowerCase();
      console.log(ext);
      if (ext === 'pdf') {
        let retVal = await this.uploadFileMultiple(files.item(i), filenameWithDateTm);
        console.log(retVal);
      }
      if (ext === 'doc' || ext === 'docx' || ext === 'txt') {
        let retVal = await this.uploadAndConvertDocFileMultiple(files.item(i), filenameWithDateTm);
        console.log(retVal);
      }
      ///--------------------
      ////-->let retVal = await this.uploadFileMultiple(files.item(i), filenameWithDateTm);
    }
    //SAVING FILE NAMES IN LOCAL STORAGE
    console.log('SAVING FILE NAMES IN LOCAL STORAGE');
    console.log(this.uploadedFiles);
    localStorage.setItem('filenames', this.uploadedFiles);

    console.log(files.item(0).name);
    this.selectedFile = files.item(0).name;
    console.log(this.options);
  }
  //---------------------------------Upload and Convert DOC file ---------------------------------------------
  convertToPDF(selectedFile: any) {
    console.log('convertToPDF selectedFile ::' + JSON.stringify(selectedFile));
    const formData = new FormData();
    formData.append('file', selectedFile);

    this.http.post('http://localhost:3000/convert', formData, {
      responseType: 'blob'
    })
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'converted.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      }, (error) => {
        console.error('Error converting file:', error);
      });
  }
  uploadAndConvertDocFileMultiple(file: any, filenameDtTm: any) {
    this.loading = true;
    console.log(filenameDtTm);

    return new Promise(async (res, rej) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filenameDtTm', filenameDtTm);
      //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
      //this.http.post('http://localhost:3000/convertDoc', formData)
      ////this.http.post('https://chatpdfaibot.onrender.com/convertDoc', formData)
      this.http.post(this.liveOrLocalUrl + '/convertDoc', formData)
        //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
        .subscribe(
          async (data) => {
            console.log('File uploaded successfully.' + filenameDtTm);
            console.log(data);
            //----------------------
            console.log('uploadAndConvertDocFileMultiple DELETING FILE NAME IN SERVER : ' + file.name);
            this.aiservice.aiServiceToDeleteFile(file.name).subscribe((data) => {
              console.log(data);
            },
              (error) => {
                console.log(error);
              });
            //----------------------
            res('File uploaded successfully.' + filenameDtTm);
            this.loading = false;

          },
          error => {
            this.loading = false;
            console.error('Error 333 occurred while uploading the file:', error);
            res('Error : ' + filenameDtTm + ' - ' + error);
          });
    });
  }
  //----------------------------- MULTIPLE FILES UPLOADING -----------------------
  uploadFileMultiple(file: any, filenameDtTm: any) {
    this.loading = true;
    console.log(filenameDtTm);
    return new Promise(async (res, rej) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filenameDtTm', filenameDtTm);
      //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
      ////this.http.post('http://localhost:3000/upload', formData)
      //this.http.post('https://chatpdfaibot.onrender.com/upload', formData)
      this.http.post(this.liveOrLocalUrl + '/upload', formData)
        //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
        .subscribe(
          async (data) => {
            console.log('File uploaded successfully.' + filenameDtTm);
            console.log(data);
            res('File uploaded successfully.' + filenameDtTm);
            this.loading = false;
          },
          error => {
            this.loading = false;
            console.error('Error 123 occurred while uploading the file:', error);
            res('Error : ' + filenameDtTm + ' - ' + error);
          });
    });
  }
  //------------------------------
  async searchInPdf() {
    this.displayAttachResult = '';
    console.log(this.selectedFile);

    for (let i = 0; i < this.options.length; i++) {
      console.log(this.options[i]);
    }
    if (this.options.length === 0) {
      console.log('Please select atleast one file.');
      this.errorToastMsg('Please select atleast one PDF file.');
      return;
    }
    if (this.searchTxt === '') {
      console.log('Please enter search text');
      //alert('Please enter search text');
      this.warningToastMsg('Please enter search text');
      return;
    }
    console.log(this.searchTxt);
    //console.log(this.selectedOptions);//firebase pdf url
    console.log(this.options);
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.displayResult = '';
    //rocky
    ////---->>>>this.displayResult = await this.mockPromisetestpdf(this.selectedFile, 0, this.searchTxt);
    for (let i = 0; i < this.options.length; i++) {
      this.highlight = '';
      this.optionHighlight = -1;
      this.warningToastMsg(this.options[i].name + ' - [ Processing... ]');
      this.displayAttachResult = '';
      //--------- CLEAR displayAttachResult ------------
      const collection = document.getElementsByClassName("card-text");
      collection[0].innerHTML = "";
      this.typeText(collection[0], '');
      //--------- CLEAR displayAttachResult ------------
      //CHECK IF DOCX OR PDF - this.options[i].name
      let filenamme = this.options[i].name;
      var parts = filenamme.split('.');
      console.log(parts);
      var extension = parts.pop();
      let ext = extension.toLowerCase();
      console.log('===> ' + ext);
      if (ext == 'pdf') {
        this.displayResult = await this.mockPromisetestpdf(this.options[i].name, this.options[i].value, this.searchTxt);
      } else if (ext == 'doc' || ext == 'docx' || ext == 'txt') {
        let filenammex = parts[0] + '.pdf';
        console.log('filenammex >>> ' + filenammex);
        this.displayResult = await this.mockPromisetestpdf(filenammex, this.options[i].value, this.searchTxt);
        //FOR TESTING
        ////this.displayResult = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`;
        //-----------------

        //-----------------
      }

      console.log(this.displayResult);
      this.displayResult = this.displayResult + '\n\n';
    }
    this.printflg = true;
    this.displayAttachResult = this.displayResult;
    console.log("final");
    console.log('this.displayAttachResult :: ' + this.displayAttachResult);
    //------------------------TEXT DISPLAY SETTING PART LIKE OPEN AI ----------------
    if (this.printflg) {
      const collection = document.getElementsByClassName("card-text");
      collection[0].innerHTML = "";
      this.typeText(collection[0], this.displayAttachResult);
    }
    //------------------------TEXT DISPLAY SETTING PART LIKE OPEN AI ----------------
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  }

  themeColor1(e: any) {
    console.log(e);
    console.log(e.target.value);
    this.backgroundColor1 = e.target.value;
    /* ======================== THEME COLORS ================================== */
    this.aiservice.setBackgroundColor1(this.backgroundColor1);
    /* ======================== THEME COLORS ================================== */
  }
  themeColor2(e: any) {
    console.log(e);
    console.log(e.target.value);
    this.backgroundColor2 = e.target.value;
    /* ======================== THEME COLORS ================================== */
    this.aiservice.setBackgroundColor2(this.backgroundColor2);
    /* ======================== THEME COLORS ================================== */
  }

  openDocxContentInNewWindow() {
    const blob = new Blob([this.docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    this.docxUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
    window.open(this.docxUrl.changingThisBreaksApplicationSecurity);
  }

}


