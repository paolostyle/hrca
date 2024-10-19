import { cache, createAsync } from '@solidjs/router';
import { For } from 'solid-js';
import { getHospitals } from '~/server/get-hospitals';

const cachedGetHospitals = cache(getHospitals, 'hospitals');

export const route = {
  preload: cachedGetHospitals,
};

export default function Home() {
  const hospitals = createAsync(() => cachedGetHospitals());

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <table class="table table-md table-auto">
        <tbody>
          <For
            each={hospitals()}
            fallback={
              <tr>
                <td>Loading...</td>
              </tr>
            }
          >
            {(hospital) => (
              <tr class={hospital.hasAccreditation ? 'bg-yellow-100' : ''}>
                <td>{hospital.name}</td>
                <td>{hospital.address}</td>
                <td>{hospital.hasAccreditation ? 'Tak' : 'Nie'}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </main>
  );
}
