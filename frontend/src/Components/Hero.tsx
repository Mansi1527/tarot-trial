"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import emailjs from "emailjs-com";

export const Hero = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    amount: "",
    slot: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<{ time: string;date: string; bookedBy?: string }[]>([]);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDROUTE}/api/slots/`);
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };
    fetchSlots();
  }, []);

  const sendEmail = async (name: any, email: any, amount: any, slot: any, date: any, orderId: any) => {
    if (!user.name || !user.email || !user.amount || !user.slot || !user.date || !orderId) {
      console.error("Missing required fields:", { user, orderId });
      alert("Missing required details. Please try again.");
      return;
    }
  
    
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name,
        email,
        amount,
        slot,  // ✅ Ensure slot is sent
        date,  // ✅ Ensure date is sent
        orderId,
        },
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
      );
      console.log("sending data to email as",name,email,slot,date,orderId,amount)
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Email error:", error);
      alert("Failed to send email. Try again.");
    }
  };
  

  const handlePayment = async () => {
    setLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKENDROUTE}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: user.amount }),
      });
  
      const data = await response.json();
      if (!data.orderId) {
        alert("Failed to create order. Try again.");
        setLoading(false);
        return;
      }
  
      console.log("Order ID received:", data.orderId);
      setOrderId(data.orderId); // ✅ Updating orderId
  
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Number(user.amount) * 100,
        currency: "INR",
        name: "Your Company",
        description: "Payment for services",
        order_id: data.orderId,
        handler: async function () {
          try {
            console.log("Payment Successful! Booking slot...");
  
            // ✅ Wait for `orderId` state update before sending email
            setTimeout(async () => {
              const bookingResponse = await fetch(`${process.env.BACKENDROUTE}/api/slots/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  time: user.slot,
                  date: user.date,
                  email: user.email,
                  name: user.name,
                }),
              });
  
              const bookingResult = await bookingResponse.json();
              if (!bookingResponse.ok) throw new Error(bookingResult.message || "Failed to book slot");
  
              alert("Payment & Slot Booking Successful!");
  
              console.log("Sending email with:", {
                name: user.name,
                email: user.email,
                amount: user.amount,
                slot: user.slot,
                date: user.date,
                orderId: data.orderId, // ✅ Using `data.orderId` directly
              });
  
              sendEmail(user.name, user.email, user.amount, user.slot, user.date, data.orderId); // ✅ Pass orderId manually
            }, 1000);
          } catch (error) {
            console.error("Slot Booking Error:", error);
            alert("Failed to book slot. Please try again.");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#3399cc" },
      };
  
      new (window as any).Razorpay(options).open();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen h-full flex justify-center items-center bg-gray-100 p-4">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      <div className="bg-white p-6 rounded-lg shadow-md w-full mt-100 max-w-md overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-center text-black">Payment Page</h2>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={user.amount}
            onChange={(e) => setUser({ ...user, amount: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="date"
            value={user.date}
            onChange={(e) => setUser({ ...user, date: e.target.value })}
            className="border p-2 w-full rounded"
          />
        </div>

        <h3 className="text-lg font-semibold mt-4 text-center">Select a Slot</h3>
<div className="grid grid-cols-3 gap-2 mt-2">
  {Array.from({ length: 10 }, (_, i) => {
    const time = `${9 + i}:00 AM`;
    const isBooked = slots.some(
      (slot) => slot.time === time && slot.date === user.date && slot.bookedBy
    );
    const isSelected = user.slot === time;

    return (
      <button
        key={time}
        className={`p-2 rounded text-sm font-medium ${
          isBooked
            ? "bg-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-green-500 text-white"
            : "bg-blue-500 text-white"
        }`}
        onClick={() => setUser({ ...user, slot: time })}
        disabled={isBooked}
      >
        {time}
      </button>
    );
  })}
</div>


        <button
          onClick={handlePayment}
          className="bg-green-500 text-white p-2 rounded w-full mt-4"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};
