import React from 'react';
import {
    Box, Tooltip, Typography,
} from '@mui/material';
import { GridCellParams, GridColDef } from '@mui/x-data-grid';




export const getColumns = (
    // eslint-disable-next-line no-unused-vars
  ) => {
    const columns: GridColDef[] = [
      {
        field: 'id',
        headerName: "Id",
        width: 250,
        filterable: false,
        sortable: false,
        renderCell: (
          params: GridCellParams,
        ) => (
          <Typography>{params.row.id}</Typography>
        ),
      },
      {
        field: 'name',
        headerName: "Name",
        width: 250,
        filterable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => (
          <Tooltip title={params.row.product} placement="top" arrow>
            <Typography>{params.row.product}</Typography>
          </Tooltip>
        ),
      },
      {
        field: 'brand',
        headerName: 'Brand',
        width: 250,
        filterable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => (
          <Box sx={{ textAlign: 'center' }}>
            <Tooltip title={params.row.brand} arrow placement="top">
            <Typography>{params.row.brand}</Typography>
            </Tooltip>
          </Box>
        ),
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 250,
        filterable: false,
        sortable: false,
        renderCell: (params: GridCellParams) => (
          <Tooltip title={params.row.brand} arrow placement="top">
            <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {params.row.price}
            </Typography>
          </Tooltip>
        ),
      },
    ];
  
    return columns;
  };