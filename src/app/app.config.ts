import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { rapidApiInterceptor } from './interceptors/rapidapi.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(
      withFetch(),
      withInterceptors([rapidApiInterceptor])
    ),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    importProvidersFrom(NgxPaginationModule)
  ]
};
