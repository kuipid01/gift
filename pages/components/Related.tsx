import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase";
import Link from "next/link";
const Related = ({ category }: any) => {
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
  const [products, setProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  console.log(products);
  const [loading, setLoading] = useState(false);
  // Fetch latest orders from Firestore
  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Create a query to the "products" collection, ordering by "createdAt" in descending order
      const q = query(
        collection(db, "products"),
        where("category", "==", category)
      );

      // Execute the query and get the documents
      const querySnapshot = await getDocs(q);

      // Extract the data from the documents
      const ordersFromFirebase = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      setProducts(ordersFromFirebase);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // toast({
      //   description: "An error occured ,try again! 🤔",
      // });
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
    setMounted(true);
  }, [category]);
  return (
    <div className=" w-full mt-[5rem]">
      <h1 className=" text-[25px]">Others:</h1>
      <div className=" w-full  flex gap-[20px] flex-wrap ">
        {products?.map((item, i) => (
          <Link
            href={`/product/${item.id}`}
            className="md:w-[calc(33.333%-20px)] bg-lighter-grey p-2 rounded-md shadow-lg w-[calc(50%-20px)]  text-[20px] h-[300px]"
            key={i}
          >
            <div className=" relative w-full h-[80%] md:h-[75%]">
              <Image
                src={item.images[0] || "/model.jpg"}
                alt="Your Image"
                fill
                style={{ objectFit: "cover" }}
                objectPosition="top"
              />
            </div>
            <div className=" flex md:flex-row flex-col mt-2 justify-between items-center">
              <span className=" font-bold text-dark capitalize">
                {" "}
                {item.title}
              </span>
              <span> #{item.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Related;
