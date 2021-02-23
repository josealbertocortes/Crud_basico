from django.shortcuts import (get_object_or_404, 
                              render, 
                              HttpResponseRedirect, redirect) 
# relative import of forms 
from .models import GeeksModel 
from .forms import GeeksForm 
from django.http import JsonResponse

def creacion_json(request):
    # add the dictionary during initialization 
    if request.method == "POST":
        titulo = request.POST["titulo"]
        description = request.POST["descripcion"]
        geek = GeeksModel.objects.create(title=titulo,description=description)
        geek.save()
        respuesta =["Creacion de contenido"]
    return JsonResponse(respuesta,safe=False)  
    
def create_view(request): 
    # dictionary for initial data with  
    # field names as keys 
    context ={} 
    
  
    # add the dictionary during initialization 
    if request.method == "POST":
        titulo = request.POST["titulo"]
        description = request.POST["descripcion"]
        geek = GeeksModel.objects.create(title=titulo,description=description)
        geek.save()
        return redirect("/")
          
    
    return render(request, "create_view.html", context) 

def list_view(request): 
    # dictionary for initial data with  
    # field names as keys 
    context ={} 
  
    # add the dictionary during initialization 
    context["dataset"] = GeeksModel.objects.all() 
          
    return render(request, "list_view.html", context) 

# pass id attribute from urls 
def detail_view(request, id): 
    # dictionary for initial data with  
    # field names as keys 
    context ={} 
  
    # add the dictionary during initialization 
    context["data"] = GeeksModel.objects.get(id = id) 
          
    return render(request, "detail_view.html", context) 

# update view for details 
def update_view(request, id): 
    # dictionary for initial data with  
    # field names as keys 
    context ={} 
  
    # fetch the object related to passed id 
    obj = get_object_or_404(GeeksModel, id = id) 
  
    # pass the object as instance in form 
    if request.method == "POST":
        titulo = request.POST["titulo"]
        description = request.POST["descripcion"]
        obj.title = titulo
        obj.description = description
        obj.save()
        return redirect("/"+"detail/"+id) 
  
    # add form dictionary to context 
    context["titulo"] = obj.title
    context["descripcion"] = obj.description

  
    return render(request, "update_view.html", context) 


# delete view for details 
def delete_view(request, id): 
    # dictionary for initial data with  
    # field names as keys 
    context ={} 
  
    # fetch the object related to passed id 
    obj = get_object_or_404(GeeksModel, id = id) 
  
  
    if request.method =="POST": 
        # delete object 
        obj.delete() 
        # after deleting redirect to  
        # home page 
        return HttpResponseRedirect("/") 
  
    return render(request, "delete_view.html", context) 

