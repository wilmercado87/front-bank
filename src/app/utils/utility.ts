import { Modal } from "bootstrap";
import { Client } from "../models/client";
import { ElementRef } from "@angular/core";

export class Utility {

    static columns: { key: keyof Client, name: string;  }[] = [
        { key: 'document', name: 'Document' },
        { key: 'name', name: 'Name' },
        { key: 'phone', name: 'Phone' },
        { key: 'email', name: 'Email' },
        { key: 'dataDates', name: 'Dates' },
    ]

    static setModalInstance(isAriaHidden: string, modalInstance: Modal, modalElement: ElementRef) {
        const modalEl = modalElement.nativeElement as HTMLElement;
      
        if (isAriaHidden === 'true') {
          const focused = document.activeElement as HTMLElement;
          if (modalEl.contains(focused)) {
            focused.blur();
          }
      
          modalEl.setAttribute("aria-hidden", "true");
          modalEl.setAttribute("inert", "");
          modalEl.classList.remove("show");
          modalEl.style.display = "none";
          modalInstance.hide();
        } else {
          modalEl.removeAttribute("aria-hidden");
          modalEl.removeAttribute("inert");
          modalEl.classList.add("show");
          modalEl.style.display = "block";
          modalInstance.show();
        }
    }

    static exportToCSV(fileName:string, csv: string) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
}