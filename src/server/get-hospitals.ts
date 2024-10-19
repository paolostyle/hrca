'use server';
import { Browser } from 'happy-dom';
import { v5 as uuidv5 } from 'uuid';
import type { HospitalData } from '~/types';

const namespace = '2788c388-449d-4829-a1b4-48fb43c305f3';

export async function getHospitals() {
  const browser = new Browser();
  const page = browser.newPage();

  await page.goto(
    'https://kursy.cmkp.edu.pl/Akredytacja/Specjalizacyjne?gz=1&spe=3&woj=14',
  );

  const { document } = page.mainFrame;

  const hospitals: HospitalData[] = Array.from(
    document.querySelectorAll('table.table > tr:not(.active)'),
  ).map((row) => {
    const [_, rawName, address] = Array.from(row.querySelectorAll('td'));
    const hasAccreditation = row.classList.contains('warning');
    const name = rawName.innerHTML.trim().replaceAll('<br>', ' ');

    return {
      id: uuidv5(name, namespace),
      name,
      address: address.innerHTML.replaceAll('<br>', ', ').trim(),
      hasAccreditation,
    };
  });

  await browser.close();

  return hospitals;
}
