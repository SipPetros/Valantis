import { ArrowForwardIos } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import * as React from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

export default function DataTable({
columns, rows, next, previous, disableNext=false, disablePrev, loading=true,
}: {
columns: any, rows: any, next: () => void, previous: () => void, disableNext?: boolean, disablePrev?: boolean, loading: boolean }) {
  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        hideFooter
        loading={loading}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        disableColumnMenu
        disableRowSelectionOnClick
        disableColumnFilter
      />
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <IconButton onClick={() => previous && previous()} disabled={disablePrev}>
            <ArrowForwardIos sx={{ rotate: '180deg' }} />
        </IconButton>
        <IconButton onClick={() => next && next()} disabled={disableNext}>
            <ArrowForwardIos />
        </IconButton>
        </Box>
    </div>
  );
}