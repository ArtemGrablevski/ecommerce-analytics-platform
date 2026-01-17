import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface DataTableProps {
  title: string;
  data: any[];
  columns: GridColDef[];
}

const DataTable: React.FC<DataTableProps> = ({ title, data, columns }) => {
  const rows = data.map((item, index) => ({
    id: index,
    ...item
  }));

  return (
    <Card sx={{ minWidth: 400, minHeight: 480 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <div style={{ height: 410, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            disableRowSelectionOnClick
            autoHeight={false}
            hideFooter={rows.length <= 5}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f1f5f9',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f8fafc',
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;