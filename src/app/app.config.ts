import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

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
    importProvidersFrom(NgxPaginationModule)
  ]
};
