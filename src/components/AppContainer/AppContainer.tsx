import React, { useEffect, useMemo, useRef, useState } from 'react';
import { md5 } from 'js-md5';
import { Box, Typography } from '@mui/material';
import CustomTable from '../Table/Table';
import { getColumns } from './helpers';
import ProjectsFilters from '../ProjectsFilters';

const ITEMS_PER_PAGE_LIMIT = 10;
const authToken = 'Valantis';

const retries = 2

export default function AppContainer() {

    const [items, setItems] = useState<{ id: string }[]>([]);
  const [searchFilter, setSearchFilter] = useState({filterType: '', value: ''})

  const [filterByBrand, setFilterByBrand] = useState({})
  const [filterByPrice, setFilterByPrice] = useState({})
  const [filterByName, setFilterByName] = useState({})

  const page = useRef(0)
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const disablePrev = page.current <= 0;

  
  async function makeRequest(method: string, data = {}, authToken?: string) {
    const baseUrl = 'https://api.valantis.store:41000';
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const body = JSON.stringify(data);

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Auth': md5(`${authToken}_${timestamp}`),
      },
      mode: 'cors' as RequestMode,
      body,
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await fetch(baseUrl, options);
    
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status} (attempt: ${attempt})`);
          }
    
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle potential retry logic here (e.g., add delay)
          if (attempt < retries) {
            console.log(`Retrying request (attempt: ${attempt + 1} of ${retries})...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw error; 
          }
        }
      }
  }


  const getIds = async () => {
    setLoading(true);
    
    try {
      const response = await makeRequest('POST', { action: "get_ids", params: { offset: 0, limit: ITEMS_PER_PAGE_LIMIT } }, authToken);
      const items = await fetchItems(response.result);
      const uniqueItems = filterUniqueItems(items.result);
      
      setItems(uniqueItems);
      await Promise.all([
        getFilterByBrandFields(),
        getFilterByPriceFields(),
        getFilterByNameFields()
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };
  
  const fetchItems = async (ids: string[]) => {
    return makeRequest('POST', { action: "get_items", params: { ids } }, authToken);
  };
  
  const filterUniqueItems = (items: { id: string }[]) => {
    return items.filter((item, index) => {
      return items.findIndex(prevItem => prevItem.id === item.id) === index;
    });
  };
  
  

  const loadPage = async (offsetModifier: number) => {
    setLoading(true);
    const offset = (page.current + offsetModifier) * ITEMS_PER_PAGE_LIMIT;
    page.current += offsetModifier;

    try {
        const response = await makeRequest('POST', { action: "get_ids", params: { offset, limit: ITEMS_PER_PAGE_LIMIT } }, authToken);
        const items = await fetchItems(response.result);
        setItems(filterUniqueItems(items.result));
        // Fetch filters
        await getFilterByBrandFields();
        await getFilterByPriceFields();
        await getFilterByNameFields();
    } catch (error) {
        console.error('Error:', error);
        page.current -= offsetModifier;
    } finally {
        setLoading(false);
    }
};
  
  const LoadNextPage = async () => {
    await loadPage(1);
  };
  
  const LoadPrevPage = async () => {
    await loadPage(-1);
  };
  



  const filterTable = async (columnName: string, filterItem: string) => {  
    try {
      const response = await makeRequest("POST", { action: "filter", params: { [columnName]: filterItem } }, authToken);
      const items = await fetchItems(response.result);
      setItems(items.result.filter(((item: { id: string }, index: number) => items.result.findIndex((prevItem: { id: string }) => prevItem.id === item.id) === index)));
    } catch (error) {
      console.error('Error:', error);
    } finally {
    setFilterLoading(false); 
    }
  };


const getField = async (field: string) => {
    setLoading(true);
    const offset = page.current * ITEMS_PER_PAGE_LIMIT;
    
    try {
      const response = await makeRequest("POST", { action: "get_fields", params: { field, offset, limit: ITEMS_PER_PAGE_LIMIT } }, authToken);
      
      switch (field) {
        case 'brand':
          setFilterByBrand(Object.assign({}, filterByBrand, response.result));
          break;
        case 'price':
          setFilterByPrice(Object.assign({}, filterByPrice, response.result));
          break;
        case 'product':
          setFilterByName(Object.assign({}, filterByName, response.result));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getFilterByBrandFields = async () => {
    await getField('brand');
  };
  
  const getFilterByPriceFields = async () => {
    await getField('price');
  };
  
  const getFilterByNameFields = async () => {
    await getField('product');
  };
  

const columns = useMemo(() => getColumns(), []);


const filterData = [
    { title: 'Filter By Brand', filterType: 'brand', filterItems: filterByBrand },
    { title: 'Filter By Price', filterType: 'price', filterItems: filterByPrice },
    { title: 'Filter By Product', filterType: 'product', filterItems: filterByName }
];

const FilterSection = () => (
    <Box sx={{
    margin: '16px 0', 
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    }}>
        {filterData.map(({ title, filterType, filterItems }) => (
            <Box key={filterType} mr={2}>
                <Typography>{title}</Typography>
                <ProjectsFilters
                    filterItem={searchFilter}
                    setFilterItem={setSearchFilter}
                    filterItems={filterItems}
                    filterType={filterType}
                    setFilterLoading={setFilterLoading}
                />
            </Box>
        ))}
    </Box>
);

useEffect(() => {
    getIds();
}, []);


useEffect(() => {
    if (searchFilter.value === '') {
        page.current = 0
        getIds();
    } else {
        filterTable(searchFilter.filterType, searchFilter.value);
    }
    
    // Fetch filter fields
    getFilterByNameFields();
    getFilterByPriceFields();
    getFilterByBrandFields();
}, [searchFilter]);



  return ( 
    <Box>
        <FilterSection />
        <CustomTable 
            columns={columns}
            rows={items}
            loading={!items.length || loading || filterLoading}
            previous={LoadPrevPage}
            next={LoadNextPage}
            disablePrev={disablePrev}
        />
    </Box>
  );
}
