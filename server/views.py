import json
import razorpay
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.shortcuts import render

from rest_framework import generics
from . import models, serializers, permissions


# Create your views here.

class PlaceList(generics.ListCreateAPIView):
  serializer_class = serializers.PlaceSerializer

  def get_queryset(self):
    return models.Place.objects.filter(owner_id=self.request.user.id)

  def perform_create(self, serializer):
    serializer.save(owner=self.request.user)

class PlaceDetail(generics.RetrieveUpdateDestroyAPIView):
  permission_classes = [permissions.IsOwnerOrReadOnly]
  serializer_class = serializers.PlaceDetailSerializer
  queryset = models.Place.objects.all()

class CategoryList(generics.CreateAPIView):
  permission_classes = [permissions.PlaceOwnerOrReadOnly]
  serializer_class = serializers.CategorySerializer

class CategoryDetail(generics.UpdateAPIView, generics.DestroyAPIView):
  permission_classes = [permissions.PlaceOwnerOrReadOnly]
  serializer_class = serializers.CategorySerializer
  queryset = models.Category.objects.all()

class MenuItemList(generics.CreateAPIView):
  permission_classes = [permissions.PlaceOwnerOrReadOnly]
  serializer_class = serializers.MenuItemSerializer
  
  def get_queryset(self):
    queryset = models.MenuItem.objects.all()
    diet = self.request.query_params.get('diet')
    if diet:
      queryset = queryset.filter(diet=diet)
    return queryset

class MenuItemDetail(generics.UpdateAPIView, generics.DestroyAPIView):
  permission_classes = [permissions.PlaceOwnerOrReadOnly]
  serializer_class = serializers.MenuItemSerializer
  queryset = models.MenuItem.objects.all()

def home(request):
 
    return render(request, 'index.html',)
 
# authorize razorpay client with API Keys.
razorpay_client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))

@csrf_exempt
def create_payment_intent(request):
    try:
        data = json.loads(request.body)
        amount_in_paise = int(data['amount'] * 100)  # Convert amount to paise as Razorpay expects amount in paise

        # Create Razorpay order
        intent = razorpay_client.order.create({
            "amount": amount_in_paise,
            "currency": "INR",
            "payment_capture": '1'
        })

        # Create the order in your database
        order = models.Order.objects.create(
            place_id=data['place'],
            table=data['table'],
            detail=json.dumps(data['detail']),
            amount=data['amount'],
            payment_intent=intent['id']
        )

        return JsonResponse({
            "success": True,
            "order": order.id,
            "order_id": intent['id'],  # Include Razorpay order ID in the response
            "amount": amount_in_paise,
            "key": settings.RAZOR_KEY_ID  # Include the Razorpay key in the response
        })
    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e),
        })
  

class OrderList(generics.ListAPIView):
  serializer_class = serializers.OrderSerializer

  def get_queryset(self):
    return models.Order.objects.filter(place__owner_id=self.request.user.id, place_id=self.request.GET.get('place'))

class OrderDetail(generics.UpdateAPIView):
  permission_classes = [permissions.PlaceOwnerOrReadOnly]
  serializer_class = serializers.OrderSerializer
  queryset = models.Order.objects.all()
  