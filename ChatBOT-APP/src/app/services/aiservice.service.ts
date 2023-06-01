import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiserviceService {
  //USING SUBJECT
  activatedEmitter = new Subject<boolean>();//next() --- subscribe()

  constructor(private http: HttpClient) { }

  aiServiceToGetSearchResults(filename:any,pdfUrl: any, searchTxt: any) {
    console.log('aiServiceToGetSearchResults');
    console.log(pdfUrl);
    console.log(filename);
    console.log(searchTxt);
    /*  return this.http
       .get(
         'http://localhost:3000/qa?query=' + searchTxt
       ); */
    //----------------------------------------------
    let queryParams = new HttpParams();
    queryParams = queryParams.append("searchTxt", searchTxt);
    queryParams = queryParams.append("url", pdfUrl);
    return this.http
      /* .get(
        'http://localhost:3000/qaurl', { params: queryParams }
      ); */
      //https://chatpdfaibot.onrender.com/ -- CHANGED
      .get(
        'https://chatpdfaibot.onrender.com/qaurl', { params: queryParams }
      );
    //-----------------------------------------------
  }
}

//http://localhost:3000/qa?query=%22what%20is%20angular?

//{"output_text":"\n\nAngular is a JavaScript-based open-source front-end web application framework developed and maintained by Google. It is used to develop single-page web applications and allows developers to use HTML as a template language and to extend HTML's syntax to express application components. It consists of several libraries, some of which are core (e.g. @angular/core) and some optional (e.g. @angular/animations). You write Angular applications by composing HTML templates with Angularized markup, writing component classes to manage those templates, adding application logic in services, and boxing components and services in modules. Then, you launch the app by bootstrapping the root module. Angular takes over, presenting your application content in a browser and responding to user interactions according to the instructions you've provided. You can use services such as event emitters, pipes, forms, and routing to create dynamic applications. Furthermore, you can use RxJS and observables to create realtime apps, and you can share data among components using features such as services and @Input/@Output. This information is provided by an unofficial and free Angular ebook created for educational purposes, and is available for download from the angular website."}

