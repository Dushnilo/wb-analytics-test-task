import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from './components/Filters';
import ProductTable from './components/ProductTable';
import Charts from './components/Charts';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    minRating: 4,
    minReviews: 100
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          min_price: filters.minPrice,
          max_price: filters.maxPrice,
          min_rating: filters.minRating,
          min_reviews: filters.minReviews
        };

        const response = await axios.get('http://localhost:8000/api/products/', { params });
        console.log('Ответ от API:', response.data);
        setProducts(response.data);
        setSortedProducts(response.data);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    fetchData();
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
      <Filters filters={filters} setFilters={setFilters} />
      <ProductTable
        products={products}
        onSortChange={handleSortChange}
      />
      <Charts
        products={products}
        sortedProducts={sortedProducts}
      />
    </div>
  );
}
