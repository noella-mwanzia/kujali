import { NgModule } from '@angular/core';

import { ScrollingModule, } from '@angular/cdk/scrolling';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule  } from '@angular/material/legacy-progress-spinner';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatGridListModule  } from '@angular/material/grid-list';

import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatRippleModule } from '@angular/material/core'
import { MatDividerModule } from '@angular/material/divider';

import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';

import { MatSortModule } from '@angular/material/sort';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatTreeModule } from '@angular/material/tree';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

// src= https://stackoverflow.com/questions/45166844/how-to-import-angular-material-in-project
// export function mapMaterialModules() {
//   return Object.keys(MATERIAL_MODULES).filter((k) => {
//     const asset = MATERIAL_MODULES[k];
//     return typeof asset === 'function'
//       && asset.name.startsWith('Mat')
//       && asset.name.includes('Module');
//   }).map((k) => MATERIAL_MODULES[k]);
// }
// const modules = mapMaterialModules();

/**
 * Module that imports all the modules we use from angular material.
 * We export these modules and import them back into the main application.
 *
 * Doing so, we make them available to the whole application.
 */
@NgModule({
    imports: [],
    exports: [ MatRippleModule, MatDatepickerModule,
               MatButtonModule, MatStepperModule, MatCheckboxModule, MatToolbarModule, MatProgressSpinnerModule, MatProgressBarModule, MatMenuModule,
               MatCardModule, MatFormFieldModule, MatRadioModule, MatSelectModule, MatIconModule,
               MatTableModule, MatDialogModule, MatListModule, MatSnackBarModule, MatInputModule,
               MatSortModule, MatAutocompleteModule, MatTooltipModule, MatSliderModule, MatSlideToggleModule, MatTreeModule, MatExpansionModule, MatTabsModule,
               ScrollingModule, MatGridListModule, MatPaginatorModule, MatSidenavModule, MatButtonToggleModule, MatDividerModule,
               MatChipsModule, MatBottomSheetModule]
})
export class MaterialDesignModule { }
