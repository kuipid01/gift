"use client";
import { db } from "../../../firebase";
import useCartServices from "@/app/utils/store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";

import "./shimmer.css";
import Related from "@/app/components/Related";
const Product = () => {
  const params = useParams<{ slug: string }>();
  const { slug } = params;

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
  type Item = {
    name: string;
    price: number;
    qty: number;
    img: string;
    size?: string;
    color?: string;
    id: string;
  };
  const [loading, setLoading] = useState(true);

  const [product, setProduct] = useState<Product>();
  const { increase, items, decrease, remove } = useCartServices();
  const productIsInCart = items?.find((item: Item) => item.id === slug);
  const cartItem = {
    name: product?.title ?? "Default Title", // Provide a default value or handle the case where 'title' is undefined
    price: product?.price ?? 0, // Provide a default value or handle the case where 'price' is undefined
    qty: 1,
    img: product?.images?.[0] ?? "/model.jpg", // Provide a default value or handle the case where 'images' or its first element is undefined
    size: product?.size ?? "Default Size", // Provide a default value or handle the case where 'size' is undefined
    color: product?.color ?? "Default Color", // Provide a default value or handle the case where 'color' is undefined
    id: product?.id ?? "default-id", // Provide a default value or handle the case where 'id' is undefined
  };

  const getProductById = async () => {
    const productId = slug;
    try {
      if (!productId) {
        setLoading(false);
        alert("Something went wrong");
        // console.error("Invalid productId");
        return null;
      }
      const productRef = doc(db, "products", productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = {
          id: productSnapshot.id,
          ...productSnapshot.data(),
        } as Product;
        setProduct(productData);
        setLoading(false);
        return productData;
      } else {
        setLoading(false);
        console.log("product not found");
        return null;
      }
    } catch (error) {
      setLoading(false);
      //console.error("Error fetching product by ID:", error);
      return null;
    }
  };
  useEffect(() => {
    getProductById();
  }, []);

  return (
    <div className=" border-b border-light bg-light-gray flex flex-col gap-[30px]  py-[50px] px-[10%] min-h-screen">
      <div className=" flex gap-1 items-center">
        <span className=" cursor-pointer">Shop</span>{" "}
        <ChevronRight size={20} color="#eadcdc" />
        <span className=" cursor-pointer">Ready to wear</span>{" "}
        <ChevronRight size={20} color="#eadcdc" />
        <span className=" cursor-pointer">Outwear</span>
      </div>
      {loading && (
        <div className=" flex gap-5  min-h-[500px] w-full">
          <div className="shimmer rounded-md flex-1 "></div>
          <div className="shimmer rounded-md flex-1 "></div>
        </div>
      )}
      {!loading && (
        <div className="md:h-screen h-fit flex md:flex-row flex-col gap-[20px]">
          <div className=" md:hidden">
            <Carousel>
              <CarouselContent>
                {product?.images?.map((item) => (
                  <CarouselItem key={item}>
                    {" "}
                    <div className="h-[500px] relative">
                      <Image
                        src={item}
                        alt="Your Image"
                        fill
                        style={{ objectFit: "cover" }}
                        objectPosition="top"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="hidden md:flex w-full h-[500px]  md:h-full gap-[20px] md:flex-1 flex-shrink-0">
            <div className="hidden md:flex w-[30%]  flex-col gap-[20px]">
              {product?.images?.slice(0, 3).map((item) => (
                <div className="h-[300px] relative" key={item}>
                  <Image
                    src={item}
                    alt="Your Image"
                    fill
                    style={{ objectFit: "cover" }}
                    objectPosition="top"
                  />
                </div>
              ))}
            </div>
            <div className=" relative h-full w-full md:flex-1">
              <div className=" w-full h-full">
                <Image
                  src={product?.images[0] || ""}
                  alt="Your Image"
                  fill
                  style={{ objectFit: "cover" }}
                  objectPosition="top"
                />
              </div>
            </div>
          </div>
          <div className=" h-full text-[20px] flex flex-col gap-[10px] w-full md:w-[30%]">
            <div className=" flex items-center md:items-start w-full justify-center md:justify-start flex-col ">
              <p className=" capitalize">{product?.title}</p>
              <p className=" font-bold">#{product?.price}</p>
            </div>

            <div className=" flex rounded md:border-0 border-dark border-2 md:flex-col gap-[10px]">
              <div className="flex-1 flex items-center md:items-start justify-between px-3 md:flex-col md:px-0 md:flex-auto flex-row-reverse">
                <span>Color:{product?.color || null}</span>
                {product?.color && (
                  <div className=" w-5 h-5 rounded-sm  bg-black"></div>
                )}
              </div>
              <select
                className=" flex-1 px-2 flex flex-col gap-3 md:flex-auto bg-transparent border-l-2 border-dark md:rounded-sm py-3  md:border-2"
                name=""
                id=""
              >
                <option value="">Select Size</option>
                <option value="xs">Xtra Small</option>
                <option value="s">Small</option>
                <option value="md"> Medium </option>
                <option value="lg"> Large</option>
                <option value="xlg"> Xtra Large </option>
                <option value="xxlg"> Xtra Xtra Large</option>
              </select>
            </div>
            {productIsInCart ? (
              <div className="flex items-center text-[20px]  justify-start  flex-1">
                <span className=" mr-3"> Change Quantity</span>
                <button
                  onClick={() => decrease(cartItem)}
                  className=" h-[40px] border-2 border-dark w-[40px] rounded-sm"
                >
                  {" "}
                  -{" "}
                </button>
                <p className=" h-[40px] w-[40px] flex justify-center items-center">
                  {productIsInCart?.qty}
                </p>
                <button
                  onClick={() => increase(cartItem)}
                  className=" h-[40px] border-2 border-dark w-[40px] rounded-sm"
                >
                  {" "}
                  +{" "}
                </button>
              </div>
            ) : (
              <button
                onClick={() => increase(cartItem)}
                className=" bg-dark text-white py-3 rounded-sm"
              >
                Add To Cart
              </button>
            )}

            <p className=" font-light leading-8 text-left text-[18px]">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque,
              quaerat qui fugit perspiciatis nulla suscipit ipsa a mollitia quis
              ad quibusdam minima magni aperiam corporis impedit quam voluptates
              rerum rem.
            </p>
            <div>
              <h1>Important Details</h1>
              <ol className=" list-disc pl-[2rem]">
                {product?.details &&
                  product?.details.map((item, i) => <li key={i}>{item} </li>)}
              </ol>
            </div>
          </div>
        </div>
      )}

      <Related category={product ? product.category : "trouser"} />
    </div>
  );
};

export default Product;
