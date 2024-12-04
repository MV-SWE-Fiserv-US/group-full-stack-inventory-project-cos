import {
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import apiURL from "../../../api";
import { AuthContext } from "../../../AuthProvider";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { total } = location.state || { total: 0 };

  const { userId } = useContext(AuthContext);

  const createOrder = async () => {
    const response = await fetch(`${apiURL}/orders/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    return order.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const orderId = await createOrder();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success/${orderId}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setError(error.message);
    } else {
      setError("An unexpected error occurred.");
    }

    navigate(`/success/${orderId}`);
  };

  const paymentElementOptions = {
    layout: {
      type: "accordion",
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: true,
    },
  };

  return (
    <form id="payment-form" className="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement
        id="link-authentication-element"
        className="mb-5"
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        disabled={loading || !stripe || !elements}
        id="submit"
        className="btn"
      >
        <span id="button-text">
          {loading ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            `Pay now ($${total})`
          )}
        </span>
      </button>
      {error && <div id="payment-error">{error}</div>}
    </form>
  );
};

export default CheckoutForm;
