import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from './components/Filters';
import ProductTable from './components/ProductTable';
import Charts from './components/Charts';
import './styles.css';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert
} from '@mui/material';

export default function App() {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    minRating: 4,
    minReviews: 100,
    sort: 'popular'
  });

  const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'rate', label: 'По рейтингу' },
    { value: 'priceup', label: 'По возрастанию цены' },
    { value: 'pricedown', label: 'По убыванию цены' },
    { value: 'newly', label: 'По новинкам' },
    { value: 'benefit', label: 'Сначала выгодные' }
  ];

  const fetchProducts = async () => {
    try {
      const params = {
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        min_rating: filters.minRating,
        min_reviews: filters.minReviews,
        sort: filters.sort
      };
      const response = await axios.get('http://localhost:8000/api/products/', { params });
      setProducts(response.data);
      setSortedProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setError('Ошибка загрузки данных');
    }
  };

  const parseProducts = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/parse/${encodeURIComponent(searchQuery)}/`,
        { params: { sort: filters.sort } }
      );
      await fetchProducts();
      setSuccess(`Успешно получено ${response.data.created} товаров`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Ошибка парсинга:', error);
      setError(error.response?.data?.error || 'Ошибка при парсинге товаров');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleSortChange = (sortModel) => {
    if (!sortModel || sortModel.length === 0) {
      setSortedProducts([...products]);
      return;
    }

    const { field, sort } = sortModel[0];
    const sorted = [...products].sort((a, b) => {
      if (a[field] < b[field]) return sort === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return sort === 'asc' ? 1 : -1;
      return 0;
    });

    setSortedProducts(sorted);
  };

  return (
    <div className="app">
      <h1>Аналитика Wildberries</h1>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Введите название товара"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && parseProducts()}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={filters.sort}
            label="Сортировка"
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={parseProducts}
          disabled={isLoading || !searchQuery.trim()}
          sx={{ height: 56 }}
        >
          {isLoading ? 'Загрузка...' : 'Поиск'}
        </Button>
      </Box>

      {isLoading && <LinearProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Filters filters={filters} setFilters={setFilters} />
      <ProductTable
        products={sortedProducts}
        onSortChange={handleSortChange}
      />
      <Charts
        products={products}
        sortedProducts={sortedProducts}
      />
    </div>
  );
}
