import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations'; // แก้ไข: ใช้ provideAnimations
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withComponentInputBinding } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

import { DialogService as PrimeNgDialogService } from 'primeng/dynamicdialog'; 


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes, 
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), 
            withEnabledBlockingInitialNavigation(),
            withComponentInputBinding()
        ),
        provideHttpClient(withFetch()),
        provideAnimations(), // แก้ไข: ใช้ provideAnimations()
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        
        // --- ส่วนที่ต้องแก้ไข: เพิ่ม Provider ของ PrimeNG และลบ Service ของเราออกไป ---
        PrimeNgDialogService,
        
        // ไม่ต้องประกาศ DialogService และ ComponentRegistryService ของเราที่นี่
        // เพราะมันมี providedIn: 'root' อยู่แล้ว
    ]
};