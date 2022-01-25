import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecretComponent } from './secret/secret.component';
import { SecretRouterModule } from './secret-router.module';

@NgModule({
  declarations: [SecretComponent],
  imports: [CommonModule, SecretRouterModule],
})
export class SecretModule {}
