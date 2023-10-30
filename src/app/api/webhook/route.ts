import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";

import { OrderRepository } from "../../../../server/repositories/order-repository";
import { StoreRepository } from "../../../../server/repositories/store-repository";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;
  console.log("Here:", { body, signature });

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = String(session.customer_details?.email);
    const customerName = String(session.customer_details?.name);
    const paymentId = String(session.id);

    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const shippingAddress = addressComponents.filter(c => c !== null).join(", ");

    const orderRepository = new OrderRepository();
    const storeRepository = new StoreRepository();
    const store = await storeRepository.findOne({ id: Number(session.metadata!.storeId) });
    if (!store) {
      return new NextResponse(`Webhook Error: cant locate store with id ${session.metadata?.storeId}`, { status: 400 });
    }
    await orderRepository.pay({
      id: Number(session.metadata!.orderId),
      customerEmail,
      customerName,
      paymentDate: new Date(),
      paymentId, // using session id for now
      shippingAddress,
      storeId: store.id,
    });
  }

  return new NextResponse(null, { status: 200 });
}
