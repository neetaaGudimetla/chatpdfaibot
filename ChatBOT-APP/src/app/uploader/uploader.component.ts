import { Component, OnInit, OnDestroy } from '@angular/core';

//------------
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AiserviceService } from '../services/aiservice.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';


//-------------- SWEET ALERT --------------------------
declare var swal: any;
//-------------- SWEET ALERT --------------------------
//------------
@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit, OnDestroy {

  displayAttachResult: any;
  printflg: boolean = false;
  filteredStatus: any;
  optionHighlight: any;
  highlight = '';
  condition = '';
  loading: boolean = false;
  nodatafound: boolean = false;

  private activatedSub!: Subscription;
  isHovering: boolean;
  files: File[] = [];
  //--------------
  displayResult: any;
  options = [];
  searchTxt: string = '';
  constructor(
    private toastr: ToastrService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private aiservice: AiserviceService
  ) { }

  ngOnInit(): void {
    //SWEETALERT
    //this.fileSuccessUploadMsg('File(s) Successfully Uploaded!');
    //this.fileWarningUploadMsg('File(s) could not be Uploaded!');
    //this.fileErrorUploadMsg('File(s) could not be Uploaded!');
    //this.deleteFileConfirmationMsg('Test.pdf');

    //TOAST
    /* this.successToastMsg('filename');
    this.errorToastMsg('filename');
    this.warningToastMsg('filename'); */

    this.condition = '';
    this.firestore
      .collection("files")
      .get()
      .subscribe((ss) => {
        let i = 0;
        //getUploadedDtTmFromUnixTimestamp
        ss.docs.forEach((doc) => {
          //console.log(doc.data().path.substring(6, 19));
          //console.log(this.getUploadedDtTmFromUnixTimestamp(doc.data().path.substring(6, 19)));
          this.options.push({ uploadedDtTm: this.getUploadedDtTmFromUnixTimestamp(doc.data().path.substring(6, 19)), id: doc.id, name: doc.data().path, url: doc.data().downloadURL, value: i, checked: false });
          i++;
        });
        console.log(this.options);
      });
    //---------------------------
    this.activatedSub = this.aiservice.activatedEmitter.subscribe(
      (didActivate) => {
        console.log('REFERSHING LIST : ' + didActivate);
        this.refreshList();
        this.clearFilesList();
      }
    );
  }
  clearFilesList() {
    //alert('Clearing above list...');
    this.successToastMsg('Clearing above list...');
    setTimeout(() => {
      this.files = [];
    }, 3000);
  }
  //--------------
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  /* get selectedOptions() { // right now: ['1','3']
    return this.options
      .filter(opt => opt.checked)
      //.map(opt => opt.value);
      .map(opt => opt.url);
  } */

  get selectedOptions() { // right now: ['1','3']
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value);
    //.map(opt => opt.url);
  }

  //---------------------- FOR TESTING ---------------------------
  searchInPdf1() {
    this.testMockPromise1();
  }
  mockPromise1(value: any, pdfUrl: any, searchTxt: any) {
    this.optionHighlight = value;
    this.highlight = 'highlight';


    console.log('value : ' + value);
    console.log('pdfUrl : ' + pdfUrl);
    console.log('searchTxt : ' + searchTxt);

    this.condition = 'mydisable';
    this.loading = true;

    return new Promise(async (res, rej) => {
      setTimeout(() => {
        this.displayResult = pdfUrl;
        this.highlight = '';
        this.optionHighlight = -1;
        this.condition = '';
        this.loading = false;

        res("done : " + value);
      }, 3000);

    });
  }

  async testMockPromise1() {
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
    console.log(this.selectedOptions);//firebase pdf url
    console.log(this.options);
    for (let i = 0; i < this.selectedOptions.length; i++) {

      ////this.highlight = '';
      ////this.optionHighlight = -1;

      console.log(await this.mockPromise1(this.options[this.selectedOptions[i]].value, this.options[this.selectedOptions[i]].url, this.searchTxt));
    }
    console.log("final");
  }

  //---------------------- FOR TESTING ---------------------------
  //---------------------- FOR TESTING ---------------------------
  searchInPdf2() {
    this.testMockPromise1();
  }
  mockPromise2(i) {
    // NOTE: the promise callback has been marked async because we expect to await it later
    return new Promise(async (res, rej) => {
      setTimeout(() => res("done : " + i), 1500);
    });
  }

  async testMockPromise2() {
    for (let i = 0; i < 5; i++) {
      console.log(await this.mockPromise2(i));
    }
    console.log("final");
  }

  //---------------------- FOR TESTING ---------------------------
  searchInPdf() {
    const collection = document.getElementsByClassName("card-text");
    collection[0].innerHTML = "";
    this.nodatafound = false;
    this.displayResult = '';
    this.displayAttachResult = '';
    this.testMockPromise();
  }
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  mockPromise(filename: any, value: any, pdfUrl: any, searchTxt: any) {
    this.optionHighlight = value;
    this.highlight = 'highlight';

    console.log('value : ' + value);
    console.log('pdfUrl : ' + pdfUrl);
    console.log('filename : ' + filename);
    console.log('searchTxt : ' + searchTxt);

    this.condition = 'mydisable';
    this.loading = true;

    return new Promise(async (res, rej) => {
      //--------------------------------
      this.aiservice.aiServiceToGetSearchResults(filename, pdfUrl, searchTxt).subscribe((data: any) => {
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
  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  mockPromiseXX(i: any, filename: any, value: any, pdfUrl: any, searchTxt: any) {
    this.optionHighlight = value;
    this.highlight = 'highlight';

    console.log('value : ' + value);
    console.log('pdfUrl : ' + pdfUrl);
    console.log('filename : ' + filename);
    console.log('searchTxt : ' + searchTxt);
    console.log('iiiiiiiiiiiiiiii : ' + i);

    this.condition = 'mydisable';
    this.loading = true;

    return new Promise(async (res, rej) => {
      if (i === 0) {
        setTimeout(() => {
          this.displayResult = this.displayResult + '\n\n' + `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut ante sem. Pellentesque faucibus elit non mattis fringilla. Duis nisi elit, fermentum sit amet suscipit a, imperdiet viverra arcu. Donec non condimentum lectus, et bibendum nisi. Nullam accumsan mauris ultrices justo bibendum fringilla. Suspendisse volutpat nisi in condimentum tincidunt. Vivamus ultricies eleifend ipsum, et pharetra turpis mattis at. Pellentesque pharetra, metus in ultrices dapibus, nibh risus eleifend tellus, ut pharetra tortor risus id dolor. Pellentesque et scelerisque augue. Aenean tristique felis fermentum malesuada aliquam. Sed vel eros risus. Nam non augue blandit, elementum purus ut, ullamcorper ex.
          `;
          this.highlight = '';
          this.optionHighlight = -1;
          this.condition = '';
          this.loading = false;
          this.nodatafound = false;
          res(this.displayResult);
        }, 3000);
      }
      if (i === 1) {
        setTimeout(() => {
          this.displayResult = this.displayResult + '\n\n' + `
          Proin sit amet pulvinar quam, vel varius felis. In pretium tincidunt diam et pharetra. Nulla ullamcorper tellus ut sem tincidunt, eget semper sem finibus. Phasellus vitae dignissim ipsum. Mauris leo nulla, scelerisque ac lectus sed, fringilla gravida felis. Suspendisse potenti. Ut nisi diam, dapibus sit amet convallis eu, sollicitudin non velit. Sed dictum dui erat, vitae iaculis libero dignissim ac.
          `;
          this.highlight = '';
          this.optionHighlight = -1;
          this.condition = '';
          this.loading = false;
          this.nodatafound = false;
          res(this.displayResult);
        }, 3000);
      }
      //--------------------------------
      /*  this.aiservice.aiServiceToGetSearchResults(filename, pdfUrl, searchTxt).subscribe((data: any) => {
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
         res("done : " + value);
       }, (err: any) => {
         this.errorToastMsg(filename + ' - [ Failed ]');
         console.log('ERROR RETURNED : ' + JSON.stringify(err));
         this.highlight = '';
         this.optionHighlight = -1;
         this.condition = '';
         this.loading = false;
         res("done : " + value);
         if (this.displayResult != '') {
           this.nodatafound = false;
         } else {
           this.nodatafound = true;
         }

       }); */
      //--------------------------------
    });
  }

  async testMockPromise() {
    this.displayAttachResult = '';

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
    console.log(this.selectedOptions);//firebase pdf url
    console.log(this.options);

    for (let i = 0; i < this.selectedOptions.length; i++) {

      this.highlight = '';
      this.optionHighlight = -1;
      console.log(this.options[this.selectedOptions[i]].name.substring(20));
      this.warningToastMsg(this.options[this.selectedOptions[i]].name.substring(20) + ' - [ Processing... ]');
      //console.log(await this.mockPromise(this.options[this.selectedOptions[i]].name.substring(20), this.options[this.selectedOptions[i]].value, this.options[this.selectedOptions[i]].url, this.searchTxt));
      //--await this.mockPromise(this.options[this.selectedOptions[i]].name.substring(20), this.options[this.selectedOptions[i]].value, this.options[this.selectedOptions[i]].url, this.searchTxt);
      this.displayAttachResult = '';
      this.displayResult = await this.mockPromise(this.options[this.selectedOptions[i]].name.substring(20), this.options[this.selectedOptions[i]].value, this.options[this.selectedOptions[i]].url, this.searchTxt);
      console.log('FOR VALUE OF i : ' + i + ' --> ' + this.displayResult);
      this.displayResult = this.displayResult + '\n\n';
    }
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
  }
  //-------------------------------------------------------------------
  async searchInPdfOld() {
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
    console.log(this.selectedOptions);//firebase pdf url
    console.log(this.options);
    for (let i = 0; i < this.selectedOptions.length; i++) {
      //console.log(this.selectedOptions[i]);//FILE URLS
      console.log(this.options[this.selectedOptions[i]]);
      console.log('---------------------------------------------');
      console.log(this.options[this.selectedOptions[i]].value);
      console.log(this.options[this.selectedOptions[i]].checked);
      console.log(this.options[this.selectedOptions[i]].id);
      console.log(this.options[this.selectedOptions[i]].name);
      console.log(this.options[this.selectedOptions[i]].url);
      console.log('---------------------------------------------');
      this.highlight = '';
      this.optionHighlight = -1;
      //this.callServiceToGetSearchResultsOld(this.selectedOptions[i], this.searchTxt);
      let val = await this.callServiceToGetSearchResults(this.options[this.selectedOptions[i]].value, this.options[this.selectedOptions[i]].url, this.searchTxt);
      console.log(val);
    }
  }
  //-----------------------
  //111111111111111111111111111111

  callServiceToGetSearchResults(value: any, pdfUrl: any, searchTxt: any) {
    this.optionHighlight = value;
    this.highlight = 'highlight';

    console.log('value : ' + value);
    console.log('pdfUrl : ' + pdfUrl);
    console.log('searchTxt : ' + searchTxt);

    this.condition = 'mydisable';
    this.loading = true;
    setTimeout(() => {
      this.displayResult = pdfUrl;
      this.highlight = '';
      this.optionHighlight = -1;
      this.condition = '';
      this.loading = false;
      return 'done';
    }, 5000);

    /* this.aiservice.aiServiceToGetSearchResults(pdfUrl, searchTxt).subscribe((data: any) => {
      console.log(data);
      console.log(data.output_text);
      this.displayResult = data.output_text;
      //this.displayResult = data;
      this.highlight = '';
      this.condition = '';
      this.loading = false;
    }); */
  }
  //222222222222222222222222
  callServiceToGetSearchResultsOld(pdfUrl: any, searchTxt: any) {
    this.highlight = 'highlight';
    this.condition = 'mydisable';
    this.loading = true;

    this.aiservice.aiServiceToGetSearchResults('', pdfUrl, searchTxt).subscribe((data: any) => {
      console.log(data);
      console.log(data.output_text);
      this.displayResult = data.output_text;
      //this.displayResult = data;
      this.highlight = '';
      this.condition = '';
      this.loading = false;
    });
  }


  deleteFile(name, url, id) {
    //rocky
    console.log(id);
    //ARE YOU SURE PROMPT HERE
    console.log(url);

    //--------------------
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal(name.substring(20) + " \n Has been deleted!", {
            icon: "error",
          });
          //-------------
          this.storage.storage.refFromURL(url).delete().then((data) => {
            //============= ALSO REMOVE THE RECORD FROM FIRESTORE DATABASE =================
            this.firestore
              .collection('files')
              .doc(id)
              .delete()
              .then(res => {
                console.log('Product deleted Successfully');
              })
              .catch((error) => {
                console.error('Error removing document: ', error);
              });
            //============= ALSO REMOVE THE RECORD FROM FIRESTORE DATABASE =================
            console.log(data);
            console.log('Successfully deleted File.');
            //alert('Successfully deleted File.');
            this.errorToastMsg(name.substring(20) + ' - [ Deleted ]');
            this.refreshList();
          });
          //-------------
        } else {
          swal("Your file is safe!", {
            icon: "warning",
          });
        }
      });
    //--------------------




    /* this.storage.storage.refFromURL(url).delete().then((data) => {
      //============= ALSO REMOVE THE RECORD FROM FIRESTORE DATABASE =================
      this.firestore
        .collection('files')
        .doc(id)
        .delete()
        .then(res => {
          console.log('Product deleted Successfully');
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
        });
      //============= ALSO REMOVE THE RECORD FROM FIRESTORE DATABASE =================
      console.log(data);
      console.log('Successfully deleted File.');
      alert('Successfully deleted File.');
      this.refreshList();
    }); */
  }
  refreshList() {
    this.options = [];

    this.firestore
      .collection("files")
      .get()
      .subscribe((ss) => {
        let i = 0;
        ss.docs.forEach((doc) => {
          //this.options.push({ id: doc.id, name: doc.data().path, url: doc.data().downloadURL, value: i, checked: false });
          this.options.push({ uploadedDtTm: this.getUploadedDtTmFromUnixTimestamp(doc.data().path.substring(6, 19)), id: doc.id, name: doc.data().path, url: doc.data().downloadURL, value: i, checked: false });
          i++;
        });
        console.log(this.options);
      });
  }
  ngOnDestroy(): void {
    this.activatedSub.unsubscribe();
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

  deleteFileConfirmationMsg(filename: any) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          swal(filename + ", has been deleted!", {
            icon: "error",
          });
        } else {
          swal("Your file is safe!", {
            icon: "warning",
          });
        }
      });
  }

  successPdfRptMsg(msg: any) {
    /*   swal({
        title:
          '<p style="color:white;background:green;font-size:20px;line-height:50px">' + msg + '</p>',
        background: '#ceed74',
        type: 'info',
      }); */
    //-------------11111---------------
    /*  swal({
       title: "Are you sure?",
       text: "Once deleted, you will not be able to recover this imaginary file!",
       icon: "warning",
       buttons: true,
       dangerMode: true,
     })
       .then((willDelete) => {
         if (willDelete) {
           swal("Poof! Your imaginary file has been deleted!", {
             icon: "success",
           });
         } else {
           swal("Your imaginary file is safe!");
         }
       }); */
    //--------------------
    swal("File Status!", msg, "success", {
      button: "OK",
    });


  }

  //============================= SWEET ALERT ====================================
  getUploadedDtTmFromUnixTimestamp(dttmUnix) {
    let uploadedDtTm = moment.unix(dttmUnix / 1000).format("DD-MMM-YYYY hh:mm:ss A");
    return uploadedDtTm;
  }
  //==============================================================================
  getCurrDateTimeOther() {
    ////////////////////
    let d = new Date();
    let curr_date = d.getDate();
    let curr_month = d.getMonth();
    curr_month++;
    let curr_year = d.getFullYear();
    let curr_yearStr = curr_year.toString();

    let curr_dateStr = curr_date.toString();
    if (curr_date.toString().length == 1) {
      curr_dateStr = curr_date.toString();
      curr_dateStr = '0' + curr_date;
    }
    let curr_monthStr = curr_month.toString();
    if (curr_month.toString().length == 1) {
      curr_monthStr = curr_month.toString();
      curr_monthStr = '0' + curr_month;
    }
    ////////////////////////////////
    let curr_hour = d.getHours();
    let cur_hourStr = curr_hour.toString();
    if (curr_hour.toString().length == 1) {
      cur_hourStr = curr_hour.toString();
      cur_hourStr = '0' + curr_hour;
    }
    let curr_min = d.getMinutes();

    let curr_minStr = curr_min.toString();
    curr_minStr = curr_min + '';

    if (curr_min.toString().length == 1) {
      curr_minStr = '0' + curr_min;
    }
    let curr_sec = d.getSeconds();
    let curr_secStr = curr_sec.toString();
    if (curr_secStr.length == 1) {
      curr_secStr = '0' + curr_sec;
    }
    //let date_time = curr_year + "-" + curr_month + "-" + curr_date + "-" + curr_hour + ":" + curr_min + ":" + curr_sec;
    //let date_time = curr_year + "" + curr_month + "" + curr_date + "" + curr_hour + "" + curr_min + "" + curr_sec;
    //let date_time = curr_yearStr + "-" + curr_monthStr + "-" + curr_dateStr + "-" + cur_hourStr + "-" + curr_minStr + "-" + curr_secStr;
    let date_time =
      curr_yearStr +
      '' +
      curr_monthStr +
      '' +
      curr_dateStr +
      '' +
      cur_hourStr +
      '' +
      curr_minStr +
      '' +
      curr_secStr;
    //////////////////////////////////////
    //this.showAlertx(date_time);
    return date_time;
  }
  //----------------------------------------------------------
  getDateTimeFromUnixDtTm(unix_timestamp) {
    ////////////////////
    //let d = new Date();
    var d = new Date(unix_timestamp * 1000);

    let curr_date = d.getDate();
    let curr_month = d.getMonth();
    curr_month++;
    let curr_year = d.getFullYear();
    let curr_yearStr = curr_year.toString();

    let curr_dateStr = curr_date.toString();
    if (curr_date.toString().length == 1) {
      curr_dateStr = curr_date.toString();
      curr_dateStr = '0' + curr_date;
    }
    let curr_monthStr = curr_month.toString();
    if (curr_month.toString().length == 1) {
      curr_monthStr = curr_month.toString();
      curr_monthStr = '0' + curr_month;
    }
    ////////////////////////////////
    let curr_hour = d.getHours();
    let cur_hourStr = curr_hour.toString();
    if (curr_hour.toString().length == 1) {
      cur_hourStr = curr_hour.toString();
      cur_hourStr = '0' + curr_hour;
    }
    let curr_min = d.getMinutes();

    let curr_minStr = curr_min.toString();
    curr_minStr = curr_min + '';

    if (curr_min.toString().length == 1) {
      curr_minStr = '0' + curr_min;
    }
    let curr_sec = d.getSeconds();
    let curr_secStr = curr_sec.toString();
    if (curr_secStr.length == 1) {
      curr_secStr = '0' + curr_sec;
    }
    //let date_time = curr_year + "-" + curr_month + "-" + curr_date + "-" + curr_hour + ":" + curr_min + ":" + curr_sec;
    //let date_time = curr_year + "" + curr_month + "" + curr_date + "" + curr_hour + "" + curr_min + "" + curr_sec;
    //let date_time = curr_yearStr + "-" + curr_monthStr + "-" + curr_dateStr + "-" + cur_hourStr + "-" + curr_minStr + "-" + curr_secStr;
    let date_time =
      curr_yearStr +
      '' +
      curr_monthStr +
      '' +
      curr_dateStr +
      '' +
      cur_hourStr +
      '' +
      curr_minStr +
      '' +
      curr_secStr;
    //////////////////////////////////////
    //this.showAlertx(date_time);
    return date_time;
  }


  //-------------------------

  convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
      ampm = 'AM',
      time;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh == 0) {
      h = 12;
    }

    // ie: 2014-03-24, 3:00 PM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
  }
  testAI() {
    const collection1 = document.getElementsByClassName("card-text");
    collection1[0].innerHTML = "";
    let parsedData = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
    this.typeText(collection1[0], parsedData);
  }
  typeText(element, text) {
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
}
