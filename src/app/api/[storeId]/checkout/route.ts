import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

import { stripe } from "@/lib/stripe";

import { OrderRepository } from "../../../../../server/repositories/order-repository";
import { ProductRepository } from "../../../../../server/repositories/product-repository";
import { StoreRepository } from "../../../../../server/repositories/store-repository";

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
  products: z
    .array(
      z.object({
        id: z.number(),
        quantity: z.number().min(1, "deve ter pelo menos um item para cada produto"),
      }),
    )
    .min(1, "Pedidos devem ter pelo menos um produto"),
});

export async function POST(req: Request, { params }: POSTParameters) {
  try {
    const validationResult = createCheckoutSessionSchema.safeParse(await req.json());
    if (!validationResult.success) {
      return new NextResponse((validationResult.error.message as any)?.message ?? validationResult.error.message, {
        status: 400,
      });
    }
    const productRepository = new ProductRepository();
    const storeRepository = new StoreRepository();
    const orderRepository = new OrderRepository();
    const store = await storeRepository.findOne({ id: Number(params.storeId) });
    if (!store) return new NextResponse("Forbidden", { status: 403 });

    const { products: cartItems } = validationResult.data;
    const products = await productRepository.findManyByIds(
      cartItems.map(item => item.id),
      store.id,
    );
    if (products.length !== cartItems.length) {
      return new NextResponse("Ocorreu um erro ao buscar os produtos selecionados", {
        status: 400,
      });
    }

    for (const product of products) {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (!cartItem) {
        return new NextResponse("Ocorreu um erro ao buscar os produtos selecionados", {
          status: 400,
        });
      }
      if (product.quantityInStock < cartItem.quantity) {
        return new NextResponse(
          `O produto '${product.name}' só possui  ${product.quantityInStock} unidade(s) em stock`,
          {
            status: 400,
          },
        );
      }
    }
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      return {
        quantity: cartItem?.quantity,
        price_data: {
          currency: store.currency,
          product_data: { name: product.name },
          unit_amount: product.price,
        },
      };
    });
    const order = await orderRepository.create({
      storeId: store.id,
      items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
    });
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: "required",
      success_url: `${store.url}/cart?success=1`,
      cancel_url: `${store.url}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
        storeId: store.id,
      },
    });
    console.log({ url: session.url });
    return NextResponse.json({ url: session.url }, { status: 200, headers: { ...corsHeaders } });
  } catch (error) {
    console.error(`[POST] /:storeId/checkout -> ${error}`);
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
