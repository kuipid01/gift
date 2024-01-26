"use client";
import "./shimmer.css";
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import useUserServices from "../utils/userStore";
import { db } from "@/firebase";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
const Page = () => {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { user, logoutUser } = useUserServices();

  // Fetch latest orders from Firestore
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      if (!user) return;
      const q = query(collection(db, "orders"), where("id", "==", user?.uid));
      const querySnapshot = await getDocs(q);

      const ordersFromFirebase = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersFromFirebase);
    } catch (error) {
      toast({
        description: "An error occurred, try again! 🤔",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const checkUser = () => {
    if (!user) {
      router.push("/login");
    }
    setLoadingUser(false);
  };

  useEffect(() => {
    checkUser();
    setMounted(true);
  }, [user]);

  useEffect(() => {
    if (!loadingUser) {
      fetchOrders();
    }
  }, [loadingUser]);
  if (!mounted || loadingUser) {
    return <div className="shimmer h-screen  w-full"> </div>; // or loading spinner or placeholder
  }

  return (
    <div className=" min-h-screen w-full">
      <div className=" w-full">
        <div className=" bg-dark overflow-x-hidden py-3 mt-5 text-light flex gap-5  px-5">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((item, i) => (
            <p
              key={i}
              className=" -pl-[20px] text-[18px] md:text-[50px] uppercase "
            >
              Orders
            </p>
          ))}
        </div>
        <div className="text-[15px] font-medium sm:text-[20px] w-full py-3 border-y-2 mt-5 px-6 border-dark flex justify-between">
          <span className=" w-[30%]">Transaction Id</span>
          <span className=" w-[20%]">Payment Status</span>
          <span className=" flex-1 text-center">Transaction Amount</span>
          <span className="  text-center flex-1 ">Delivered</span>
        </div>
        {loadingUser &&
          [0, 1, 3, 4, 5].map((item) => (
            <div
              key={item}
              className=" shimmer text-[20px] w-full py-3  mt-5 px-6 border-dark flex justify-between"
            ></div>
          ))}
        {orders.length > 0 &&
          orders?.map((order) => (
            <div
              key={order?.id}
              className=" text-[20px] w-full py-3 border-y-2 mt-5 px-6 border-dark flex justify-between"
            >
              <span className=" w-[30%]">{order.transactionId}</span>
              <span className=" w-[20%]">
                {order.paid ? "Paid ✔" : "Unpaid"}
              </span>
              <span className=" font-black flex-1 text-center">
                # {order?.total || "1000"}
              </span>
              <div className=" font-black flex justify-center items-center flex-1 text-center">
                <div
                  className={` flex  ${
                    order.delivered ? "justify-end" : "justify-start"
                  } w-[100px] p-1 h-[40px] border-2 border-dark rounded-2xl`}
                >
                  {order.delivered ? (
                    <div className="w-1/2 h-full  rounded-2xl bg-green-400"></div>
                  ) : (
                    <div className="w-1/2 h-full rounded-2xl bg-red-400"></div>
                  )}
                </div>
              </div>
            </div>
          ))}

        {user && !loadingUser && orders.length < 1 ? (
          <p className="my-6 capitalize text-[20px]">
            You&apos;ve not placed an order yet ....{" "}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
