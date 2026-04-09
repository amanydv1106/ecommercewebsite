'use client'
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function PublicLayout({ children }) {

    const dispatch = useAppDispatch()
    const {user} = useUser()
    const {getToken} = useAuth()

    const {cartItems} = useAppSelector((state)=>state.cart)

    useEffect(()=>{
        dispatch(fetchProducts({}))
    },[])

    useEffect(()=>{
        if(user){
            dispatch(fetchCart({getToken}))
            dispatch(fetchAddress({getToken}))
            dispatch(fetchUserRatings({getToken}))
        }
    },[user])

    useEffect(()=>{
        if(user){
            dispatch(uploadCart({getToken}))
        }
    },[cartItems])




    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
