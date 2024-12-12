'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Input } from './ui/input';
import { Button } from './ui/button';

const FormPayment = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expireMonth, setExpireMonth] = useState('');
  const [expireYear, setExpireYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [holderName, setHolderName] = useState('');
  const [basket, setBasket] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [response, setResponse] = useState(null);

  const products = [
    { id: 'P101', name: 'Kahve', category: 'İçecek', price: 20 },
    { id: 'P102', name: 'Çikolata', category: 'Atıştırmalık', price: 15 },
    { id: 'P103', name: 'Kitap', category: 'Hobi', price: 50 },
  ];

  const addToBasket = (product: any) => {
    setBasket([...basket, product]);
    setTotalPrice((prev) => prev + product.price);
  };

  const handlePayment = async () => {
    const paymentCard = {
      cardHolderName: holderName,
      cardNumber: cardNumber,
      expireMonth: expireMonth,
      expireYear: expireYear,
      cvc: cvc,
      registerCard: '0',
    };

    const buyer = {
      id: 'BY789',
      name: 'Efe Görkem',
      surname: 'Ümit',
      gsmNumber: '+905350000000',
      email: 'john.doe@example.com',
      identityNumber: '74300864791',
      lastLoginDate: '2015-10-05 12:43:35',
      registrationDate: '2013-04-21 15:12:09',
      registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      ip: '85.34.78.112',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34732',
    };

    const shippingAddress = {
      contactName: 'Jane Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34742',
    };

    const billingAddress = {
      contactName: 'Jane Doe',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
      zipCode: '34742',
    };

    const basketItems = basket.map((item) => ({
      id: item.id,
      name: item.name,
      category1: item.category,
      itemType: 'PHYSICAL',
      price: item.price.toFixed(2),
    }));

    const paymentData = {
      price: totalPrice.toFixed(2),
      paidPrice: totalPrice.toFixed(2),
      currency: 'TRY',
      basketId: 'B67832',
      paymentCard: paymentCard,
      buyer: buyer,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      basketItems: basketItems,
    };

    try {
      const response = await axios.post('http://localhost:3001/api/payment', paymentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResponse(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="grid grid-cols-2">
      <div className="h-screen bg-sky-600 flex flex-col gap-4 items-center justify-center">
        <h1 className="text-3xl text-white">Ödeme Formu</h1>
        <div className="flex flex-col w-96 gap-3">
          <Input
            type="text"
            placeholder="Kart Sahibi"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Kart Numarası"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <div className="flex flex-row gap-3">
            <Input
              type="text"
              placeholder="Son Kullanma Ayı"
              value={expireMonth}
              onChange={(e) => setExpireMonth(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Son Kullanma Yılı"
              value={expireYear}
              onChange={(e) => setExpireYear(e.target.value)}
            />
          </div>
          <Input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
          />
          <Button onClick={handlePayment}>Ödeme Yap</Button>
        </div>
        <div className="mt-4 text-white">
          <h2 className="text-lg">Sepetiniz:</h2>
          {basket.map((item, index) => (
            <p key={index}>
              {item.name} - {item.price} TL
            </p>
          ))}
          <h3 className="mt-2">Toplam: {totalPrice} TL</h3>
        </div>
      </div>
      <div className="h-screen bg-gray-100 p-5">
        <h2 className="text-xl mb-4">Ürünler</h2>
        <div className="grid gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 border rounded-md bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm">{product.price} TL</p>
              </div>
              <Button onClick={() => addToBasket(product)}>Sepete Ekle</Button>
            </div>
          ))}
        </div>
        {response && (
          <div className="mt-5 bg-white p-4 border rounded-lg">
            <h2>Sonuç:</h2>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPayment;