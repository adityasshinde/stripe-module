import {useEffect, useState} from 'react';

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'

function Payment(props) {
  const { stripePromise } = props;
  const [ clientSecret, setClientSecret ] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const fetchClientSecret = async () => {
        const body={
            amount: 1200,
            currency: 'inr',
            paymentMethod:"pm_card_visa"
        }
        const response = await fetch('http://localhost:3001/stripe/create-payment-intent', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const {paymentIntent} = await response.json();
        setClientSecret(paymentIntent.client_secret);
        };
    fetchClientSecret();
  }, []);


  return (
    <>
      <h2 style={{textAlign:'center'}}>Complete Payment</h2>

      <p style={{textAlign:'center'}}>Amount: 1200</p>
        <p style={{textAlign:'center'}}>Currency: INR</p>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;