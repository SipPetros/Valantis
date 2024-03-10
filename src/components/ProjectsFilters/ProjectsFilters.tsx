import React, { useCallback, useState } from 'react';
import {
  MenuItem, Box, InputAdornment, FormControl,
} from '@mui/material';
import { map } from 'lodash';
import { FilterList } from '@mui/icons-material';
import { StyledSelectField } from './styled';


 type ItemFilter = {
  label: string,
  key: string,
  value: string | number,
};


// eslint-disable-next-line no-unused-vars
export default function ProjectsFilters({ filterItem, setFilterItem, filterItems, filterType, setFilterLoading }: {filterItem: { filterType: string, value: string }, setFilterItem: (el: { filterType: string, value: string }) => void, filterItems: {}, filterType: string, setFilterLoading: ((e:boolean) => void)}) {
  const [open, setOpen] = useState(false);
  const disableSelectField = filterItem.value ? (filterItem.filterType !== filterType) : false
  const options = Object.entries(filterItems).filter(([key, value]) => value !== null).map(([key, value]) => ({
    key: key+1,
    value: value as string | number,
    label: value as string,
  }));

  const tabs: Array<ItemFilter> = [
    {
      label: 'All',
      key: 'all',
      value: '',
    },
    ...options.map(option => ({
      label: option.label,
      key: option.key,
      value: option.value,
    })),
  ];
  
  return (
    <Box sx={{ ml: '-1px', flex: 1 }}>
      <FormControl disabled={disableSelectField} fullWidth onClick={() => setOpen(!disableSelectField)}>
        <StyledSelectField
          open={open}
          labelId="demo-simple-select-label"
          id="projects_filters"
          displayEmpty
          value={filterItem?.value}
          onChange={event => {
            setFilterLoading(true)
            setFilterItem({filterType: filterType, value: event.target.value as string})
          }}
          onClose={e => { e.stopPropagation(); setOpen(false); }}
          startAdornment={(
            <InputAdornment sx={{ mr: 1, cursor: 'pointer' }} position="start">
              <FilterList />
            </InputAdornment>
        )}
          inputProps={{ IconComponent: () => null }}
        >
          {map(tabs, ({ key, label, value: tabValue }) => (
            <MenuItem
              title={label}
              key={key}
              value={tabValue}
            >
              {label}
            </MenuItem>
          ))}
        </StyledSelectField>
      </FormControl>
    </Box>
  );
}
