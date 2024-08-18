import { useState } from "react";

interface Filter {
  name: string;
  value: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  condition: (item: any, value: string) => boolean;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  type?: 'filter' | 'sort';
}

const useFiltering = (filters: Filter[]) => {
  const [filterValues, setFilterValues] = useState(() => {
    return filters.map((f) => ({
      name: f.name,
      value: f.value,
    }));
  });

  const filteringConditions = filters.filter(f => f.type !== 'sort').map((f) => f.condition);
  const sortingConditions = filters.filter(f => f.type === 'sort').map((f) => f.condition);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const filterFunction = (collection: any) => {
    let filteredData = filteringConditions.reduce((data, conditionFn, index) => {
      return data.filter((item: any) => conditionFn(item, filterValues[index].value));
    }, collection);
  /* eslint-enable @typescript-eslint/no-explicit-any */

    if (sortingConditions.length > 0) {
      filteredData = sortingConditions.reduce((data, conditionFn) => {
        const sortFilter = filterValues.find(filter => filter.name === "sort");
        return conditionFn(data, sortFilter?.value ?? "");
      }, filteredData);
    }

    return filteredData;
  };

  return {
    filterValues,
    setFilterValues,
    filterFunction,
  };
};

export default useFiltering;