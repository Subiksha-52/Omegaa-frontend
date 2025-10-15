import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./PageBackground.css";

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="page-background">
        <div className="order-success-container">
          <h2>No order found.</h2>
          <Link to="/">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-background">
      <div className="order-success-container">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase.</p>
        <h3>Order Details:</h3>
        <ul>
          {order.items && order.items.map((item, idx) => (
            <li key={idx} style={{marginBottom: 8}}>
              <b>{item.product?.name || "Product"}</b> &times; {item.quantity}
              {item.product?.price && (
                <> — ₹{item.product.price} each</>
              )}
            </li>
          ))}
        </ul>
        <h4>Total: ₹{order.total}</h4>
        <p style={{marginTop: 16}}>Shipping to: <b>{order.address?.address}</b></p>
        <Link to="/" className="order-success-home-link">Back to Home</Link>
      </div>
    </div>
  );
}