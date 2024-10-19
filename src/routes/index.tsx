import { cache, createAsync } from '@solidjs/router';
import { createSortable, useDragDropContext } from '@thisbeyond/solid-dnd';
import { createSignal, For } from 'solid-js';
import { getHospitals } from '~/server/get-hospitals';

const cachedGetHospitals = cache(getHospitals, 'hospitals');

export const route = {
  preload: cachedGetHospitals,
};

const Sortable = ({ id }: { id: string }) => {
  const sortable = createSortable(id);
  const context = useDragDropContext();

  if (!context) return null;

  const [state] = context;

  return (
    <div
      use:sortable
      class="sortable"
      classList={{
        'opacity-25': sortable.isActiveDraggable,
        'transition-transform': !!state.active.draggable,
      }}
    >
      {props.item}
    </div>
  );
};

export default function Home() {
  const [activeItem, setActiveItem] = createSignal(null);
  const hospitals = createAsync(() => cachedGetHospitals());

  const onDragStart = ({ draggable }) => setActiveItem(draggable.id);

  const onDragEnd = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentItems = hospitals();

      if (!currentItems) return;

      const fromIndex = currentItems.indexOf(draggable.id);
      const toIndex = currentItems.indexOf(droppable.id);
      if (fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        console.log(updatedItems);
      }
    }
  };

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
