import { useState } from "react";

interface Filter {
  name: string;
  value: string;
  condition: (item: any, value: string) => boolean | any;
  type?: 'filter' | 'sort';
}

const useFiltering = (filters: Filter[]) => {
  const [filterValues, setFilterValues] = useState(() => {
    const filterInitialValues = filters.map((f) => ({
      name: f.name,
      value: f.value,
    }));
    console.log("Initial filter values:", filterInitialValues);
    return filterInitialValues;
  });

  const filteringConditions = filters.filter(f => f.type !== 'sort').map((f) => f.condition);
  const sortingConditions = filters.filter(f => f.type === 'sort').map((f) => f.condition);

  const filterFunction = (collection: any) => {
    console.log("Original collection:", collection);

    let filteredData = filteringConditions.reduce((data, conditionFn, index) => {
      console.log(`Applying filter condition ${index} with value:`, filterValues[index].value);
      return data.filter((item: any) => {
        const result = conditionFn(item, filterValues[index].value);
        console.log(`Filter condition ${index} result for item:`, result);
        return result;
      });
    }, collection);

    console.log("Data after filtering:", filteredData);

    if (sortingConditions.length > 0) {
      // Apply sorting conditions
      filteredData = sortingConditions.reduce((data, conditionFn, index) => {
        const sortFilter = filterValues.find(filter => filter.name === "sort");
        console.log(`Applying sort condition ${index} with value:`, sortFilter?.value);
        const sortedData = conditionFn(data, sortFilter?.value);
        console.log(`Sort condition ${index} result:`, sortedData);
        return sortedData;
      }, filteredData);
    }

    console.log("Data after sorting:", filteredData);

    return filteredData;
  };

  return {
    filterValues,
    setFilterValues,
    filterFunction,
  };
};

export default useFiltering;