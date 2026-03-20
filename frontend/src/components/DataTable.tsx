import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface DataTableProps {
  title: string;
  data: any[];
  columns: GridColDef[];
}

const DataTable: React.FC<DataTableProps> = ({ title, data, columns }) => {
  const theme = useTheme();
  
  // Защита от невалидных данных
  const validData = Array.isArray(data) ? data : [];
  
  const rows = validData.map((item, index) => ({
    id: index,
    ...item
  }));

  return (
    <Card sx={{ minWidth: 400, minHeight: 480 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 3
          }}
        >
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
              border: 'none',
              '& .MuiDataGrid-main': {
                borderRadius: 2,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#334155',
                border: 'none',
                borderRadius: '12px 12px 0 0',
                minHeight: '52px !important',
              },
              '& .MuiDataGrid-columnHeader': {
                border: 'none',
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: theme.palette.text.secondary,
                },
              },
              '& .MuiDataGrid-cell': {
                border: 'none',
                padding: '12px 16px',
                fontSize: '1rem',
                color: theme.palette.text.primary,
              },
              '& .MuiDataGrid-row': {
                backgroundColor: theme.palette.background.paper,
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(99, 102, 241, 0.04)' 
                    : 'rgba(99, 102, 241, 0.08)',
                  transform: 'scale(1.001)',
                  transition: 'all 0.2s ease',
                },
                '&:nth-of-type(even)': {
                  backgroundColor: theme.palette.mode === 'light' 
                    ? 'rgba(248, 250, 252, 0.5)' 
                    : 'rgba(51, 65, 85, 0.3)',
                },
              },
              '& .MuiDataGrid-footerContainer': {
                border: 'none',
                borderRadius: '0 0 12px 12px',
                backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#334155',
                minHeight: '48px',
              },
              '& .MuiTablePagination-root': {
                color: theme.palette.text.secondary,
              },
              '& .MuiDataGrid-selectedRowCount': {
                display: 'none',
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;