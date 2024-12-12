const express = require('express');
const bodyParser = require('body-parser');
const Iyzipay = require('iyzipay');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL
});

app.post('/api/payment', (req, res) => {
    const { paymentCard, buyer, shippingAddress, billingAddress } = req.body;

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const basketItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        category1: 'Default',
        category2: 'Default',
        itemType: 'PHYSICAL',
        price: (item.price * item.quantity).toFixed(2)
    }));

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: totalPrice,
        paidPrice: totalPrice,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        basketId: 'B67832',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems
    };

    iyzipay.payment.create(request, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        cart = []; // Ödeme başarılıysa sepeti temizle
        res.status(200).json(result);
    });
});

let cart = []; // Sepet verilerini tutacak basit bir array

// Sepete ürün ekleme
app.post('/api/cart/add', (req, res) => {
    const { id, name, price, quantity } = req.body;

    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += quantity; // Eğer ürün zaten varsa miktarını artır
    } else {
        cart.push({ id, name, price, quantity });
    }
    res.status(200).json({ message: 'Ürün sepete eklendi', cart });
});

// Sepeti listeleme
app.get('/api/cart', (req, res) => {
    res.status(200).json(cart);
});

// Sepetten ürün çıkarma
app.post('/api/cart/remove', (req, res) => {
    const { id } = req.body;
    cart = cart.filter(item => item.id !== id);
    res.status(200).json({ message: 'Ürün sepetten çıkarıldı', cart });
});

// Sepeti temizleme
app.post('/api/cart/clear', (req, res) => {
    cart = [];
    res.status(200).json({ message: 'Sepet temizlendi' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
