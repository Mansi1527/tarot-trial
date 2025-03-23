import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";

// Ensure environment variables exist
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay API keys are missing. Please check your environment variables.");
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Force the function to use Node.js runtime
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
    try {
        // Create an order with a random receipt ID
        const order = await razorpay.orders.create({
            amount: 100 * 100, // Amount in paise (₹1 = 100 paise)
            currency: "INR",
            receipt: "receipt_" + Math.random().toString(36).substring(7),
        });

        return NextResponse.json({ orderId: order.id }, { status: 200 });
    } catch (err) {
        console.error("Error creating order:", err);
        return NextResponse.json(
            { error: "Error creating order" },
            { status: 500 }
        );
    }
}
