from django.contrib import admin
from django.urls import path

from wb_analytics.views import parse_products, ProductList

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', ProductList.as_view(), name='products'),
    path('api/parse/<str:query>/', parse_products, name='parse-products'),
]
