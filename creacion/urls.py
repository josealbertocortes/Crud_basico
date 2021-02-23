from django.urls import path 
  
# importing views from views..py 
from .views import detail_view, delete_view, list_view, update_view,create_view, creacion_json
  
app_name='crud'

urlpatterns = [ 
    path('creacion',create_view,name="create"),
    path('',list_view,name="list"),
    
    path('update/<id>',update_view,name="update"),
    path('detail/<id>', detail_view,name="detail" ), 
    path('delete/<id>', delete_view,name="delete" ),
    path('creacion_json', creacion_json,name="creacion_json" ),
] 