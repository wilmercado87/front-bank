import { Utility } from '../utils/utility';
import { Papa } from 'ngx-papaparse';

describe('Utility', () => {
  let mockAnchor: HTMLAnchorElement;

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-blob-url');

    mockAnchor = {
      setAttribute: jest.fn(),
      click: jest.fn(),
      remove: jest.fn(),
    } as unknown as HTMLAnchorElement;

    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    jest.spyOn(document.body, 'appendChild').mockImplementation();
    jest.spyOn(document.body, 'removeChild').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería exportar los clientes a CSV', () => {
    const csvData = 'col1,col2\nvalue1,value2';
    const fileName = 'clients.csv';

    Utility.exportToCSV(fileName, csvData);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockAnchor.setAttribute).toHaveBeenCalledWith('href', 'mock-blob-url');
    expect(mockAnchor.setAttribute).toHaveBeenCalledWith('download', fileName);
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
  });
});
