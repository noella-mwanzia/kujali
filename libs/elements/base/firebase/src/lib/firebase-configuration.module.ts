import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { REGION } from '@angular/fire/compat/functions';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/compat/database';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';

import { UserTrackingService, ScreenTrackingService } from '@angular/fire/analytics';

@NgModule({
  imports: [CommonModule],
  exports: []
})
export class FirebaseConfigurationModule
{
  static forRoot(isDev: boolean, useEmulators: boolean): ModuleWithProviders<FirebaseConfigurationModule> {
    return {
      ngModule: FirebaseConfigurationModule,
      providers: [
        { provide: REGION, useValue: 'europe-west1' },
        // https://github.com/angular/angularfire/blob/master/docs/emulators/emulators.md
        { provide: USE_AUTH_EMULATOR, useValue:(isDev && useEmulators) ? ['http://localhost:9082'] : undefined },
        { provide: USE_FIRESTORE_EMULATOR, useValue: (isDev && useEmulators) ? ['localhost', 8081] : undefined },
        { provide: USE_FUNCTIONS_EMULATOR, useValue: (isDev && useEmulators) ? ['localhost', 5002] : undefined },
        UserTrackingService,
        ScreenTrackingService,
      ]
    };
  }
}