import { NgModule } from "@angular/core";
import { CalloutComponent } from "./callout/callout.component";

import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [IonicModule],
    declarations: [CalloutComponent],
    exports: [CalloutComponent]
})
export class ComponentsModule{}