import './App.css';
import Payment from './Payment'
import Completion from './Completion'

import {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import {loadStripe} from '@stripe/stripe-js';

function App() {
  const [ stripePromise, setStripePromise ] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch("http://localhost:3001/stripe/config");
      const {publishableKey} = await response.json();
      setStripePromise(loadStripe(publishableKey));
    };
    fetchConfig();
    
  }, []);

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Payment stripePromise={stripePromise} />} />
          <Route path="/completion" element={<Completion stripePromise={stripePromise} />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;