import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const isOrderStatus = (status: string): status is OrderStatus =>
  Object.values(OrderStatus).includes(status as OrderStatus);

export async function POST(request: NextRequest){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const {orderId, status } = await request.json()
        if (!orderId || !status || !isOrderStatus(status)) {
            return NextResponse.json({ error: 'invalid order payload' }, { status: 400 })
        }

        await prisma.order.update({
            where: { id: orderId, storeId },
            data: {status}
        })

        return NextResponse.json({message: "Order Status updated"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

export async function GET(request: NextRequest){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: {storeId},
            include: {user: true, address: true, orderItems: {include: {product: true}}},
            orderBy: {createdAt: 'desc' }
        })

        return NextResponse.json({orders})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
