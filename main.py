import requests


def get_wb_info(article: str):
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
            return None

        products = data['data']['products']
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

                sale_price = product['sizes'][0].get('price', {}).get('product')
                if sale_price is not None:
                    sale_price = float(sale_price / 100)

            print(name, price, sale_price, rating, reviews)

    except Exception as e:
        return {'error': str(e)}


if __name__ == '__main__':
    cat_id = '8127'
    get_wb_info(cat_id)
    # print(product_data)
