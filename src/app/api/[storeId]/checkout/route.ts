import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

export async function OPTIONS(req: Request) {
  return new NextResponse(null, { status: 200, headers: { ...corsHeaders } });
}

type POSTParameters = {
  params: {
    storeId: string;
  };
};

const createCheckoutSessionSchema = z.object({
  productIds: z.array(z.string().uuid("product is required")).min(1, "Orders must have at least one product"),
});

export async function POST(req: Request, { params }: POSTParameters) {
  try {
    const validationResult = createCheckoutSessionSchema.safeParse(await req.json());
    console.log(JSON.stringify(validationResult, null, 2));
    if (!validationResult.success) {
      return new NextResponse((validationResult.error.message as any)?.message ?? validationResult.error.message, {
        status: 400,
      });
    }
    const { productIds } = validationResult.data;
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const DEFAULT_QUANTITY = 1;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(product => ({
      quantity: DEFAULT_QUANTITY,
      price_data: {
        currency: "USD",
        product_data: { name: product.name },
        unit_amount: product.price.toNumber() * 100,
      },
    }));
    const order = await prisma.order.create({
      data: {
        storeId: params.storeId,
        paidAt: null,
        orderItems: {
          create: products.map(product => ({
            productId: product.id,
            quantity: DEFAULT_QUANTITY,
            unitPrice: product.price,
          })),
        },
      },
    });
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      success_url: `${process.env.FRONT_END_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONT_END_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });
    return NextResponse.json({ url: session.url }, { status: 200, headers: { ...corsHeaders } });
  } catch (error) {
    console.error(`[POST] /:storeId/checkout -> ${error}`);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
