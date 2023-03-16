import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule, MaterialBricksModule, FlexLayoutModule } from '@iote/bricks-angular';

import { MultiLangModule } from '@ngfi/multi-lang';

import { iTalPageModule } from '@app/elements/layout/page';

import { ConnectPontoComponent } from './components/connect-ponto/connect-ponto.component';

import { BankingPageComponent } from './pages/banking-page/banking-page.component';


@NgModule({
  imports: [
    CommonModule,

    CommonModule,
    RouterModule, 
    MultiLangModule,
    MaterialDesignModule, MaterialBricksModule, FlexLayoutModule,
    FormsModule, ReactiveFormsModule,

    iTalPageModule,
  ],
  declarations: [BankingPageComponent, ConnectPontoComponent],
})
export class ActivateBankingModule {}
