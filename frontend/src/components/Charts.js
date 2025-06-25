import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

export default function Charts({ products, sortedProducts }) {
    const priceRanges = [
        { min: 0, max: 1000, label: '0-1К' },
        { min: 1000, max: 2000, label: '1К-2К' },
        { min: 2000, max: 3000, label: '2К-3К' },
        { min: 3000, max: 4000, label: '3К-4К' },
        { min: 4000, max: 5000, label: '4К-5К' },
        { min: 5000, max: 6000, label: '5К-6К' },
        { min: 6000, max: 7000, label: '6К-7К' },
        { min: 7000, max: 8000, label: '7К-8К' },
        { min: 8000, max: 9000, label: '8К-9К' },
        { min: 9000, max: 10000, label: '9К-10К' },
        { min: 10000, max: Infinity, label: '10К+' }
    ];

    const priceData = {
        labels: priceRanges.map(range => range.label),
        datasets: [{
            label: 'Количество товаров',
            data: priceRanges.map(range =>
                products.filter(p =>
                    p.sale_price >= range.min &&
                    p.sale_price < range.max
                ).length
            ),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    };

    const discountData = {
        labels: sortedProducts.map(() => ''),
        datasets: [{
            label: 'Размер скидки (%)',
            data: sortedProducts.map(p => ((p.price - p.sale_price) / p.price * 100).toFixed(1)),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };

    return (
        <div style={{ display: 'flex', marginTop: 40 }}>
            <div style={{ width: '50%' }}>
                <Bar data={priceData} options={{ responsive: true }} />
            </div>
            <div style={{ width: '50%' }}>
                <Line
                    data={discountData}
                    options={{
                        responsive: true,
                        scales: { x: { ticks: { display: false }, grid: { display: false } } },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title: (context) => sortedProducts[context[0].dataIndex].name,
                                    label: (context) => `Скидка: ${context.parsed.y}%`
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
}
