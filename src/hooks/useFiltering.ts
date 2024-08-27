import { useState } from "react";
import { Filter } from "../types/interfaces";

// Custom hook for filtering and sorting collections
const useFiltering = (filters: Filter[]) => {
  // State to hold the current filter values
  const [filterValues, setFilterValues] = useState(() => {
    return filters.map((f) => ({
      name: f.name,
      value: f.value,
    }));
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Extract filtering conditions from the filters
  const filteringConditions = filters.filter(f => f.type !== 'sort').map((f) => f.condition as (item: any, value: string) => boolean);
  // Extract sorting conditions from the filters
  const sortingConditions = filters.filter(f => f.type === 'sort').map((f) => f.condition as (items: any[], value: string) => any[]);

  // Function to apply filters and sorting to a collection
  const filterFunction = (collection: any) => {
    // Apply filtering conditions
    let filteredData = filteringConditions.reduce((data, conditionFn, index) => {
      return data.filter((item: any) => conditionFn(item, filterValues[index].value));
    }, collection);
  /* eslint-enable @typescript-eslint/no-explicit-any */

    // Apply sorting conditions if any
    if (sortingConditions.length > 0) {
      filteredData = sortingConditions.reduce((data, conditionFn) => {
        const sortFilter = filterValues.find(filter => filter.name === "sort");
        return conditionFn(data, sortFilter?.value ?? "");
      }, filteredData);
    }

    return filteredData;
  };

  return {
    filterValues, // Current filter values
    setFilterValues, // Function to update filter values
    filterFunction, // Function to apply filters and sorting
  };
};

export default useFiltering;