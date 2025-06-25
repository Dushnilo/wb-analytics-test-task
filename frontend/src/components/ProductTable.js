import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'name', headerName: 'Название', width: 300, sortable: true },
    { field: 'price', headerName: 'Цена', width: 150, type: 'number', sortable: true },
    { field: 'sale_price', headerName: 'Цена со скидкой', width: 150, type: 'number', sortable: true },
    { field: 'rating', headerName: 'Рейтинг', width: 150, type: 'number', sortable: true },
    { field: 'reviews', headerName: 'Количество отзывов', width: 150, type: 'number', sortable: true },
];

export default function ProductTable({ products, onSortChange }) {
    return (
        <div style={{ height: 600, width: '100%', marginTop: 20 }}>
            <DataGrid
                rows={products}
                columns={columns}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'rating', sort: 'desc' }],
                    },
                }}
                onSortModelChange={onSortChange}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableColumnMenu={false}
                sortingMode="client"
            />
        </div>
    );
}
