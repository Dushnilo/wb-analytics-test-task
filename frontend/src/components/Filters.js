import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import './Filters.css';

export default function Filters({ filters, setFilters }) {
    const handlePriceChange = (event, newValue) => {
        setFilters({
            ...filters,
            minPrice: newValue[0],
            maxPrice: newValue[1]
        });
    };

    return (
        <div className="filters-simple">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span>Диапазон цен (руб.):</span>
                <TextField
                    size="small"
                    label="От"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    sx={{ width: 80 }}
                    inputProps={{ min: 0, max: filters.maxPrice }}
                />
                <span>-</span>
                <TextField
                    size="small"
                    label="До"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    sx={{ width: 80 }}
                    inputProps={{ min: filters.minPrice }}
                />
            </Box>

            <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={handlePriceChange}
                min={0}
                max={50000}
                step={1}
                sx={{ width: '100%', mt: 1 }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <TextField
                    type="number"
                    size="small"
                    label="Рейтинг от"
                    value={filters.minRating}
                    onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                    inputProps={{ step: 0.1, min: 0, max: 5 }}
                    sx={{ width: 120 }}
                />

                <TextField
                    type="number"
                    size="small"
                    label="Отзывов от"
                    value={filters.minReviews}
                    onChange={(e) => setFilters({ ...filters, minReviews: e.target.value })}
                    inputProps={{ step: 100, min: 0 }}
                    sx={{ width: 120 }}
                />
            </Box>
        </div>
    );
}
