import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { createPaymentIntent } from '../apis';
import AuthContext from '../contexts/AuthContext';

const PaymentForm = ({ amount, items, onDone, color }) => {
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const params = useParams();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (paymentData) => {
    const res = await loadRazorpay();

    if (!res) {
      toast('Razorpay SDK failed to load. Are you online?', { type: 'error' });
      return;
    }

    const options = {
      key: paymentData.key,  // Use the key from backend response
      amount: paymentData.amount,
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Test Transaction',
      order_id: paymentData.order_id,
      handler: async function (response) {
        // Handle successful payment here
        toast('Payment Successful', { type: 'success' });
        onDone();
      },
      prefill: {
        name: 'Your Name',
        email: 'email@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Your Address',
      },
      theme: {
        color: color,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const paymentData = {
      amount,
      place: params.id,
      table: params.table,
      detail: items,
    };

    const json = await createPaymentIntent(paymentData, auth.token);

    if (json?.success) {
      displayRazorpay(json);
      setLoading(false);
    } else if (json?.error) {
      toast(json.error, { type: 'error' });
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Button variant="standard" style={{ backgroundColor: color }} className="mt-4" block type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay'}
      </Button>
    </Form>
  );
};

export default PaymentForm;
