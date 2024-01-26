"use client";
import Image from "next/image";
import Link from "next/link";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import Loadingshimmer from "./Loadingshimmer";

const New = () => {
  const [newProducts, setNewProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);

  type Product = {
    id: string;
    title: string;
    price: number;
    color?: string;
    size?: string;
    category: string;
    images: string[];
    quantityAvailable?: number;
    details: string[];
    tags?: string[];
    likes?: number;
    timeAdded: Date;
  };
  // Fetch latest products from Firestore
  const fetchLatestProducts = async () => {
    try {
      setLoading(true);
      // Create a query to the "products" collection, ordering by "createdAt" in descending order
      const q = query(collection(db, "products"), orderBy("timeAdded"));

      // Execute the query and get the documents
      const querySnapshot = await getDocs(q);

      // Extract the data from the documents
      const latestProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      // Reverse the order
      const reversedProducts = latestProducts.reverse();

      setNewProducts(reversedProducts);
      if (reversedProducts) {
        setLoading(false);
      }

      return reversedProducts;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching latest products:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  return (
    <>
      <section className="min-h-screen py-7  h-fit bg-light-gray flex justify-center items-center">
        <div className="w-[90%] mx-auto">
          <div className="flex mb-3 justify-between uppercase font-bold text-[20px]">
            <h3>NEW IN</h3>
            <Link className=" w-fit border-b-2 border-dark" href="/">
              SEE ALL
            </Link>
          </div>
          <div className="w-full min-h-screen flex flex-wrap gap-[10px] md:gap-[20px] justify-between">
            {loading
              ? [0, 1, 2, 3, 4, 5].map((item, i) => <Loadingshimmer key={i} />)
              : newProducts?.slice(0, 20).map((item, i) => (
                  <Link
                    href={`/product/${item.id}`}
                    key={i}
                    className="flex relative border border-light  w-[calc(50%-10px)] md:w-[calc(33.3333%-20px)] flex-col justify-between h-[350px] md:h-[500px]"
                  >
                    <div className="w-full h-[90%] relative">
                      <Image
                        src={item?.images[0] ?? "/model.jpg"}
                        alt="Your Image"
                        fill
                        style={{ objectFit: "cover" }}
                        objectPosition="top"
                      />
                    </div>
                    <div className="p-3 flex flex-col justify-between capitalize font-normal text-[18px] md:text-[20px]">
                      <span>{item.title.slice(0, 30)}</span>
                      <span className="font-bold">#{item.price}</span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>
      <div className=" w-full relative h-[40vh] md:h-[60vh] flex justify-center items-center ">
        <div className="w-full  h-full absolute top-0 left-0">
          <Image
            src="/bgFooter.jpg"
            alt="Your Image"
            fill
            objectFit="cover"
            objectPosition="center"
          />
        </div>
        <div
          className=" w-full  h-full absolute top-0 left-0 bg-dark opacity-50
           "
        ></div>
        <h1 className=" text-[35px] md:text-[50px] relative  font-bold text-light">
          Harmattan Collection 2024
        </h1>
      </div>
    </>
  );
};

export default New;
