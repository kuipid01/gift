"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Loadingshimmer from "../components/Loadingshimmer";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/firebase";

const Products = () => {
  const [data, setData] = useState([]);

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);

  const fetchPaginatedData = async () => {
    try {
      const q = query(
        collection(db, "products"),
        orderBy("timeAdded", "desc"),
        limit(15)
      );

      if (lastVisible) {
        const paginatedQuery = query(
          collection(db, "products"),
          orderBy("timeAdded", "desc"),
          startAfter(lastVisible),
          limit(15)
        );

        const paginatedSnapshot = await getDocs(paginatedQuery);
        const paginatedData = paginatedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData((prevData) => [...prevData, ...paginatedData]);
        // setLoading(true);
        setLastVisible(
          paginatedSnapshot.docs[paginatedSnapshot.docs.length - 1]
        );
      } else {
        const initialSnapshot = await getDocs(q);
        const initialData = initialSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setData(initialData);
        setLoading(false);
        setLastVisible(initialSnapshot.docs[initialSnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching paginated data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaginatedData();
    setLoading(true);
    setIsClient(true);
  }, []);
  return (
    <>
      <div className="border-b border-light z-[7000] bg-light-gray flex flex-col gap-[30px] py-[50px] px-[10px] min-h-screen">
        <div className="flex border-y-2 gap-[20px] border-dark py-2 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6, 8, 9, 10, 11].map((word, i) => (
            <h1
              className="-translate-x-[50px] uppercase text-[35px] md:text-[50px] font-light tracking-wide"
              key={i}
            >
              PRODUCTS
            </h1>
          ))}
        </div>

        <div>
          <div className="flex mb-3 justify-between tracking-wide uppercase font-bold text-[20px]">
            <h3>Product Views/Models</h3>
            <select className="px-3 outline-none w-fit border-b-2 border-dark">
              <option value="">FILTERS</option>
              <option value="cheap">CHEAPEST</option>
              <option value="exp">EXPENSIVE</option>
            </select>
          </div>

          <div className="w-full flex min-h-screen relative flex-wrap gap-[10px] md:gap-[20px] justify-evenly">
            {loading
              ? [0, 1, 2, 3, 4, 5].map((item, i) => <Loadingshimmer key={i} />)
              : data.map((item, i) => (
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
            {/* {data.map((item, i) => (
              <Link
                href={`/product/${item.id}`}
                key={i}
                className="flex relative border border-light  w-full sm:w-[calc(50%-10px)] md:w-[calc(33.3333%-20px)] flex-col justify-between h-[500px]"
              >
                <div className="w-full h-[90%] relative">
                  <Image
                    className="object-cover object-top"
                    src={item.images[0] ?? "/model.jpg"}
                    alt="Your Image"
                    priority
                    sizes="(max-width: 768px) 100vw"
                    fill
                  />
                </div>
                <div className="flex text-center justify-center font-normal capitalize text-[18px] md:text-[20px]">
                  <span>{item.title}</span>
                </div>
                <div className="flex justify-center uppercase text-[20px]">
                  <span
                    style={{
                      fontWeight: "bold",
                    }}
                    className="tracking-widest  font-black "
                  >
                    #{item.price}
                  </span>
                </div>
              </Link>
            ))} */}
          </div>
        </div>
        <button
          style={{
            marginTop: "3rem",
          }}
          className="py-3 mt-6 mx-auto rounded transition-all font-bold uppercase text-center  flex text-dark hover:bg-gray-500 px-4 bg-white"
          onClick={() => fetchPaginatedData()}
        >
          Load More
        </button>
      </div>
    </>
  );
};

export default Products;
