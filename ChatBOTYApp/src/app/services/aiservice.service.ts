import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AiserviceService {

  //####################################################
  //liveOrLocalUrl = 'http://localhost:3000';
  liveOrLocalUrl = 'https://chatbotaiapi.onrender.com';

  //####################################################

  //USING SUBJECT
  activatedEmitter = new Subject<boolean>();//next() --- subscribe()

  constructor(private http: HttpClient) { }

  aiServiceToGetSearchResults(searchTxt: any) {
    console.log('aiServiceToGetSearchResults');
    console.log(searchTxt);
    /*  return this.http
       .get(
         'http://localhost:3000/qa?query=' + searchTxt
       ); */
    //----------------------------------------------
    let queryParams = new HttpParams();
    queryParams = queryParams.append("searchTxt", searchTxt);
    return this.http
      /*  .get(
         'http://localhost:3000/qaurl', { params: queryParams }
       ); */
      //https://chatpdfaibot.onrender.com/ -- CHANGED
      /* .get(
        'https://chatpdfaibot.onrender.com/qaurl', { params: queryParams }
      ); */
      /*   .get(
          'http://localhost:3000/qaurlblob', { params: queryParams }
        ); */
      /*  .get(
         'http://localhost:3000/qaurlblobtestpdf', { params: queryParams }
       ); */
      //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
      /* .get(
        'http://localhost:3000/qaurlblobMultiplepdf', { params: queryParams }
      ); */
      /*  .get(
         'https://chatpdfaibot.onrender.com/qaurlblobMultiplepdf', { params: queryParams }
       ); */
      .get(
        this.liveOrLocalUrl + '/qaurlblobMultiplepdf', { params: queryParams }
      );
    //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~

    //-----------------------------------------------
  }
  //----------------------------------
  aiServiceToGetSearchMultipleResults(searchTxt: any, filename: any) {
    console.log('aiServiceToGetSearchResults searchTxt : ' + searchTxt);
    console.log('aiServiceToGetSearchResults filename : ' + filename);

    let queryParams = new HttpParams();
    queryParams = queryParams.append("searchTxt", searchTxt);
    queryParams = queryParams.append("filename", filename);

    return this.http
      //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
      /*  .get(
         'http://localhost:3000/qaurlblobMultiplepdf', { params: queryParams }
       ); */
      /* .get(
        'https://chatpdfaibot.onrender.com/qaurlblobMultiplepdf', { params: queryParams }
      ); */
      .get(
        this.liveOrLocalUrl + '/qaurlblobMultiplepdf', { params: queryParams }
      );
    //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
  }
  //------------------------------------
  aiServiceToDeleteFile(filename: any) {
    console.log('aiServiceToDeleteFile filename : ' + filename);

    let queryParams = new HttpParams();
    queryParams = queryParams.append("filename", filename);
    return this.http
      //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
      /* .get(
        'http://localhost:3000/deletefile', { params: queryParams }
      ); */
      /* .get(
        'https://chatpdfaibot.onrender.com/deletefile', { params: queryParams }
      ); */
      .get(
        this.liveOrLocalUrl + '/deletefile', { params: queryParams }
      );
    //~~~~~~~~~~~~~~~~~~~~ LOCAL LIVE ~~~~~~~~~~~~~~~~~~~~~~~~
  }
  /* ======================== THEME COLORS ================================== */
  backgroundColorChanged1: EventEmitter<string> = new EventEmitter<string>();
  backgroundColorChanged2: EventEmitter<string> = new EventEmitter<string>();
  setBackgroundColor1(color: string) {
    this.backgroundColorChanged1.emit(color);
  }
  setBackgroundColor2(color: string) {
    this.backgroundColorChanged2.emit(color);
  }
  /* ======================== THEME COLORS ================================== */
}

//http://localhost:3000/qa?query=%22what%20is%20angular?

//{"output_text":"\n\nAngular is a JavaScript-based open-source front-end web application framework developed and maintained by Google. It is used to develop single-page web applications and allows developers to use HTML as a template language and to extend HTML's syntax to express application components. It consists of several libraries, some of which are core (e.g. @angular/core) and some optional (e.g. @angular/animations). You write Angular applications by composing HTML templates with Angularized markup, writing component classes to manage those templates, adding application logic in services, and boxing components and services in modules. Then, you launch the app by bootstrapping the root module. Angular takes over, presenting your application content in a browser and responding to user interactions according to the instructions you've provided. You can use services such as event emitters, pipes, forms, and routing to create dynamic applications. Furthermore, you can use RxJS and observables to create realtime apps, and you can share data among components using features such as services and @Input/@Output. This information is provided by an unofficial and free Angular ebook created for educational purposes, and is available for download from the angular website."}

