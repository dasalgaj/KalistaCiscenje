import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-callout',
  templateUrl: './callout.component.html',
  styleUrls: ['./callout.component.scss'],
})
export class CalloutComponent implements OnInit {

  @Input('text') text: string;
  @Input('type') type: string;

  icon: string;
  color: string;
  
  constructor() { }

  ngOnInit() {
    this.init();
  } 

  init(){
    if(this.type == 'info'){
      this.icon = 'information-circle';
      this.color = 'warning';
    }

    if(this.type == 'alert'){
      this.icon = 'alert-circle';
      this.color = 'danger';

    }

    if(this.type == 'success'){
      this.icon = 'checkmark-circle';
      this.color = 'success';

    }
  }

}
