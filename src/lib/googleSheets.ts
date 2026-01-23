
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface SheetRow {
  [key: string]: string;
}

/**
 * Fetches data from a specific sheet and converts it to an array of objects.
 * Assumes the first row contains headers.
 */
export const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
  if (!API_KEY || !SPREADSHEET_ID) {
    console.warn('Google Sheets API Key or Spreadsheet ID is missing.');
    return [];
  }

  try {
    const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Error fetching sheet data:', data.error.message);
      throw new Error(data.error.message);
    }

    const rows = data.values;
    if (!rows || rows.length === 0) return [];

    const headers = rows[0];
    const rawData = rows.slice(1);

    return rawData.map((row: string[]) => {
      const item: any = {};
      headers.forEach((header: string, index: number) => {
        const cleanHeader = header.trim();
        item[cleanHeader] = row[index] || '';
      });
      return item as T;
    });
  } catch (error) {
    console.error(`Failed to fetch ${sheetName}:`, error);
    return [];
  }
};
