import {
    PaymentElement,
    LinkAuthenticationElement
  } from '@stripe/react-stripe-js'
  import {useState} from 'react'
  import {useStripe, useElements} from '@stripe/react-stripe-js';
  
  export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      setIsLoading(true);
  
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/completion`,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occured.");
      }
  
      setIsLoading(false);
    }
  
    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement id="link-authentication-element"/>
        <PaymentElement id="payment-element"  />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text" disabled={isLoading}>
            {isLoading ? 'processing...': "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    )
  }