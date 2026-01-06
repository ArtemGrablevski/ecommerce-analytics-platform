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
    <Card sx={{ minWidth: 400, minHeight: 400 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <div style={{ height: 350, width: '100%' }}>
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
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;