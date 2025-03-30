import { TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { provideRouter, Router } from '@angular/router';

describe('MenuComponent', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('debería crear el componente', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('debería tener una instancia de Router', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const component = fixture.componentInstance;
    expect(component['router']).toBeDefined();
    expect(component['router']).toBe(router);
  });
});
