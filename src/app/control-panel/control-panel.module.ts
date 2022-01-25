import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ControlPanelRouterModule } from './control-panel-router.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ControlPanelComponent],
  imports: [
    CommonModule,
    ControlPanelRouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
})
export class ControlPanelModule {}
