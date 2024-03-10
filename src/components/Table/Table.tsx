import { ArrowForwardIos } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';


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