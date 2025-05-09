import { Utility } from './utility';
import { Modal } from 'bootstrap';
import { ElementRef } from '@angular/core';

describe('Utility.setModalInstance', () => {
  it('debería mostrar el modal cuando isAriaHidden es "false"', () => {
    const div = document.createElement('div');
    const modalElement = new ElementRef(div);

    const modalInstance = {
      show: jest.fn(),
      hide: jest.fn(),
    } as unknown as Modal;

    Utility.setModalInstance('false', modalInstance, modalElement);

    expect(div.hasAttribute('aria-hidden')).toBe(false);
    expect(div.hasAttribute('inert')).toBe(false);
    expect(div.classList.contains('show')).toBe(true);
    expect(div.style.display).toBe('block');

    expect(modalInstance.show).toHaveBeenCalled();
  });
});
