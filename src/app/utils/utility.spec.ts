import { Utility } from './utility';
import { ElementRef } from '@angular/core';

describe('Utility', () => {
  describe('setModalInstance', () => {
    let modalMock: any;
    let modalElement: ElementRef;

    beforeEach(() => {
      modalMock = {
        show: jest.fn(),
        hide: jest.fn(),
      };

      const element = document.createElement('div');
      element.classList.add('modal');
      modalElement = new ElementRef(element);

      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.innerHTML = '';
      jest.clearAllMocks();
    });

    it('should hide the modal when isAriaHidden is "true"', () => {
      Utility.setModalInstance('true', modalMock, modalElement);

      const el = modalElement.nativeElement as HTMLElement;
      expect(el.getAttribute('aria-hidden')).toBe('true');
      expect(el.hasAttribute('inert')).toBe(true);
      expect(el.classList.contains('show')).toBe(false);
      expect(el.style.display).toBe('none');
      expect(modalMock.hide).toHaveBeenCalled();
    });

    it('should show the modal when isAriaHidden is not "true"', () => {
      Utility.setModalInstance('false', modalMock, modalElement);

      const el = modalElement.nativeElement as HTMLElement;
      expect(el.getAttribute('aria-hidden')).toBeNull();
      expect(el.hasAttribute('inert')).toBe(false);
      expect(el.classList.contains('show')).toBe(true);
      expect(el.style.display).toBe('block');
      expect(modalMock.show).toHaveBeenCalled();
    });
  });

  describe('exportToCSV', () => {
    beforeAll(() => {
      global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
      document.body.innerHTML = '';
    });

    it('should create a downloadable CSV link and click it', () => {
      const clickSpy = jest.spyOn(document.body, 'appendChild');
      const csvData = 'a,b,c\n1,2,3';

      Utility.exportToCSV('test.csv', csvData);

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  describe('parseDate', () => {
    it('should parse dd/mm/yyyy into a Date', () => {
      const date = Utility.parseDate('09/05/2025');
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(4);
      expect(date.getDate()).toBe(9);
    });
  });
});
