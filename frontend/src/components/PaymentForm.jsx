import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement, IdealBankElement, PaymentElement } from '@stripe/react-stripe-js';

const PaymentForm = () => {
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Simulate fetching a client secret from your backend (replace with actual API call)
    fetch('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount: 1000, currency: 'usd' }), // Example data (adjust based on your API)
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable submit button while loading
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        ideal: elements.getElement(IdealBankElement), // For iDEAL payments
        // Add more payment methods as needed
      },
    });

    if (result.error) {
      // Handle payment error
      console.error('Payment error:', result.error.message);
    } else {
      // Handle successful payment
      console.log('Payment successful!');
    }
  };

  const paymentFormStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f6f9fc',
  };

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  };

  const formRowStyle = {
    marginBottom: '20px',
  };

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const payButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#008cdd',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const disabledButtonStyle = {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  return (
    <div style={paymentFormStyle}>
      <h2 style={headingStyle}>Payment Details</h2>
      {/* <PaymentElement/> */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={formRowStyle}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" style={inputStyle} required />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" style={inputStyle} required />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" style={inputStyle} required />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" style={inputStyle} required />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="country" style={inputStyle} required />
        </div>
        <div style={formRowStyle}>
          <label htmlFor="postalCode">Postal Code</label>
          <input type="text" id="postalCode" name="postalCode" style={inputStyle} required />
        </div>
        <div style={formRowStyle}>
          <label>Card Details</label>
          <CardElement style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} />
        </div>
        <div style={formRowStyle}>
          <label>Choose Payment Method:</label>
          <IdealBankElement />
          {/* Add more payment method options here */}
        </div>
        <button type="submit" style={stripe ? payButtonStyle : { ...payButtonStyle, ...disabledButtonStyle }} disabled={!stripe}>
          Pay $10.00
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
