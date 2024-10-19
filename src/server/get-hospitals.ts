'use server';
import { Browser } from 'happy-dom';
import { v5 as uuidv5 } from 'uuid';
import type { HospitalData } from '~/types';
import { db } from './db';

export async function getHospitals() {
  return await db.selectFrom('hospitals').selectAll().execute();
}

export async function syncHospitalsData() {
  const hospitals = await fetchHospitals();
  await saveHospitals(hospitals);
  return hospitals;
}

async function fetchHospitals() {
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
      id: uuidv5(name, process.env.NITRO_UUID_NAMESPACE),
      name,
      address: address.innerHTML.replaceAll('<br>', ', ').trim(),
      hasAccreditation,
    };
  });
  await browser.close();

  return hospitals;
}

async function saveHospitals(hospitals: HospitalData[]) {
  await db
    .insertInto('hospitals')
    .values(hospitals)
    .onConflict((oc) =>
      oc.doUpdateSet((eb) => ({
        hasAccreditation: eb.ref('excluded.hasAccreditation'),
      })),
    )
    .execute();
}
