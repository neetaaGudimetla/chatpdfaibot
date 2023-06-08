import { Component, OnInit, Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AiserviceService } from './services/aiservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedColor = '#ff0000'; // Default color

  backgroundColor1: any;
  backgroundColor2: any;
  constructor(private toastr: ToastrService,
    private aiserviceService: AiserviceService,
    private renderer: Renderer2) {
    //this.showSuccess();
  }

  ngOnInit(): void {
    console.log('APP COMPONENT');
    /* ======================== THEME COLORS ================================== */
    this.aiserviceService.backgroundColorChanged1.subscribe((color: string) => {
      console.log('got back ground color --background-color1 : ' + color);
      document.documentElement.style.setProperty('--background-color1', color);
    });
    this.aiserviceService.backgroundColorChanged2.subscribe((color: string) => {
      console.log('got back ground color --background-color2 : ' + color);
      document.documentElement.style.setProperty('--background-color2', color);
    });
    /* ======================== THEME COLORS ================================== */
  }
  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
