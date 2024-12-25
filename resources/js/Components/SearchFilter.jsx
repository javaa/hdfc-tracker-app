import React, { useState, useEffect, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { usePrevious } from 'react-use';
import pickBy from 'lodash/pickBy';

export default () => {
  const { filters } = usePage().props;
  const [opened, setOpened] = useState(false);

  const [values, setValues] = useState({
    search: filters.search || '',
  });

  const prevValues = usePrevious(values);

  function reset() {
    setValues({
      search: '',
      trashed: ''
    });
  }

  useEffect(() => {
    // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
    if (prevValues) {
      const query = Object.keys(pickBy(values)).length
        ? pickBy(values)
        : { remember: 'forget' };
      router.get(route(route().current()), query, {
        replace: true,
        preserveState: true
      });
    }
  }, [values]);

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.value;

    setValues(values => ({
      ...values,
      [key]: value
    }));

    if (opened) setOpened(false);
  }

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <i className='pi pi-search text-sm absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input
            className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoComplete="off"
            type="text"
            name="search"
            id="search"
            value={values.search}
            onChange={handleChange}
            placeholder="Search"
          />
        {values.search.length > 0 && (
          <button
            onClick={reset}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
             <i className='text-sm pi pi-times text-gray-400 hover:text-gray-600' />
          </button>
        )}
      </div>
    </div>
  );
};