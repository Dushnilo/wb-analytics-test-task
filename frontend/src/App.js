import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from './components/Filters';
import ProductTable from './components/ProductTable';
import Charts from './components/Charts';
import './styles.css';
import { TextField, Button, Box } from '@mui/material';

export default function App() {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    minRating: 4,
    minReviews: 100
  });

  const fetchProducts = async () => {
    try {
      const params = {
        min_price: filters.minPrice,
        max_price: filters.maxPrice,
        min_rating: filters.minRating,
        min_reviews: filters.minReviews
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
      const response = await axios.get(`http://localhost:8000/api/parse/${encodeURIComponent(searchQuery)}/`);
      await fetchProducts(); // Обновляем данные после парсинга
    } catch (error) {
      console.error('Ошибка парсинга:', error);
      setError('Ошибка при парсинге товаров');
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

      {/* Поисковая строка */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Введите название товара"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && parseProducts()}
        />
        <Button
          variant="contained"
          onClick={parseProducts}
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? 'Загрузка...' : 'Поиск'}
        </Button>
      </Box>

      {error && <div className="error-message">{error}</div>}

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
