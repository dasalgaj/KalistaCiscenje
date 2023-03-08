import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertType, DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {

  formCar : FormGroup;

  id: string = '';
  page_title: string = '';
  showDelete: boolean = false;
  editCar: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private dataCtrl: DataServiceService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {

    this.formCar = this.formBuilder.group({
      car_name: ['', Validators.compose([Validators.required])],
      car_model: ['', Validators.compose([Validators.required])],
      car_label: ['', Validators.compose([Validators.required])]
    });


    this.init();
  }

  async init(){
    this.id =  this.route.snapshot.paramMap.get('id');

    let car_name: string = '';
    let car_model: string = '';
    let car_label: string = '';


    if(this.id == null){
      this.page_title = await this.dataCtrl.translateWord("ADD_CAR.ADD_CAR");

      this.showDelete = false;
      this.editCar = false;
    }else{

      let car = await this.dataCtrl.getCarById(this.id);

      if(car != null){
        this.showDelete = true;
        this.editCar = true;

      
        this.car_name.setValue(car.car_name);
        this.car_model.setValue(car.car_model);
        this.car_label.setValue(car.car_label);
  
  
        this.page_title = await this.dataCtrl.translateWord("ADD_CAR.EDIT_CAR");
      }
      else{
        this.page_title = await this.dataCtrl.translateWord("ADD_CAR.ADD_CAR");

        this.showDelete = false;
        this.editCar = false;
      }
    }
  }

 async save(){
    let car_name = this.formCar.value.car_name;
    let car_model = this.formCar.value.car_model;
    let car_label = this.formCar.value.car_label;

    await this.dataCtrl.showLoader();

    if(this.editCar == true){
      await this.dataCtrl.editCarInStorage(this.id, car_name, car_model, car_label);
      await this.dataCtrl.hideLoader();

      let translate = await this.dataCtrl.translateWord('ADD_CAR.SUCCESS');
      this.dataCtrl.showToast(translate, AlertType.Success);
      this.navCtrl.back();

    }
    else{
      await this.dataCtrl.addCarInStorage(car_name, car_model, car_label);
      await this.dataCtrl.hideLoader();

      let translate = await this.dataCtrl.translateWord('ADD_CAR.SUCCESS');
      this.dataCtrl.showToast(translate, AlertType.Success);
      this.navCtrl.back();

    }
  }

  async deleteCar(){
    await this.dataCtrl.showLoader();
    await this.dataCtrl.deleteCar(this.id);
    await this.dataCtrl.hideLoader();

    let translate = await this.dataCtrl.translateWord('ADD_CAR.SUCCESS_DELETE');
    this.dataCtrl.showToast(translate, AlertType.Success);
    this.navCtrl.back();
  }

  get car_name(){
    return this.formCar.get('car_name');
  }

  get car_model(){
    return this.formCar.get('car_model');
  }

  get car_label(){
    return this.formCar.get('car_label');
  }

}
