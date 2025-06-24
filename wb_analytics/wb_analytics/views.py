import requests

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product


@api_view(['GET'])
def parse_products(request, article):
    try:
        base_url = 'https://catalog.wb.ru/catalog/pants/v2/catalog'
        params = {
            'appType': 1,           # Тип приложения (1 - веб)
            'curr': 'rub',          # Валюта
            'dest': -1029256,       # ID региона доставки (1029256 - Москва)
            'cat': int(article),    # Артикул категории
            'page': 1,              # Номер страницы (пагинация)
            'sort': 'popular',      # Сортировка (
                                    # popular - По популярности,
                                    # rate - По популярности,
                                    # priceup - По возрастанию цены,
                                    # pricedown - По убыванию цены,
                                    # newly - По новинкам,
                                    # benefit - Сначала выгодные)
        }
        response = requests.get(base_url, params=params, timeout=10,)

        if response.status_code != 200:
            raise Exception(response.status_code)

        data = response.json()
        if not len(data['data']['products']):
            return Response(status=404)

        products = data['data']['products']
        count = 0
        for product in products:
            name = product.get('name', None)
            price = None
            sale_price = None
            rating = product.get('reviewRating', None)
            reviews = product.get('feedbacks', None)

            if product.get('sizes'):
                price = product['sizes'][0].get('price', {}).get('basic')
                if price is not None:
                    price = float(price / 100)

                sale_price = product['sizes'][0].get(
                    'price', {}).get('product')
                if sale_price is not None:
                    sale_price = float(sale_price / 100)

            Product.objects.create(
                name=name,
                price=price,
                sale_price=sale_price,
                rating=rating,
                reviews=reviews
            )
            count += 1

        return Response({'status': 'success', 'category_id': article,
                         'created': count})

    except Exception as e:
        return {'error': str(e)}


class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    # serializer_class = ProductSerializer
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = {
    #     'price': ['gte', 'lte'],  # Фильтр по диапазону цен
    #     'rating': ['gte'],         # Минимальный рейтинг
    #     'reviews': ['gte'],        # Минимальное количество отзывов
    # }
