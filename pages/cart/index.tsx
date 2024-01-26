"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import useCartServices from "../utils/store";
import useUserServices from "../utils/userStore";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

const Cartpage = () => {
  type Trans = {
    transaction_id: number | string;
    tx_ref: string;
  };
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(false);
  const { user } = useUserServices();

  const {
    increase,
    items,
    totalPrice,
    clear,
    decrease,
    remove,
  } = useCartServices();

  const config = {
    public_key: "FLWPUBK_TEST-cf4564e4f7931f5cc9f23aa36942617c-X",
    tx_ref: Date.now().toString(),
    amount: totalPrice,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user?.email ?? "N/A",
      phone_number: user?.phoneNumber ?? "N/A",
      name: user?.displayName || user?.email || "Guest",
    },
    customizations: {
      title: "Product Checkout Page",
      description: "Payment for items in cart",
      logo:
        "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };
  const addToOrders = async () => {
    const newOrderData = {
      delivered: false,
      paid: true,
      id: user?.uid,
      transactionId: transaction?.transaction_id,

      timeAdded: Timestamp.now().toDate(),
    };
    const doc = await addDoc(collection(db, "orders"), newOrderData);
    if (doc) {
      toast({
        description: "Payment done , Order details in your mail 🎉🎉🎉",
      });

      clear();
      setLoading(false);
      router.push("/");
    } else {
      setLoading(false);
      return;
    }
  };
  const handleFlutterPayment = useFlutterwave(config as any);
  const [stagesOfPayment, setStagesOfPayment] = useState([
    { id: 1, desc: "Orders", stillOnTab: true },
    { id: 2, desc: "Payment", stillOnTab: false },
    { id: 3, desc: "Confirmation", stillOnTab: false },
  ]);
  const [transaction, setTransaction] = useState<Trans>();
  console.log(transaction);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleCheckOut = () => {
    handleFlutterPayment({
      callback: (response) => {
        // console.log(response, response.status);
        if (response.status === "successful") {
          const { transaction_id, tx_ref } = response;
          setTransaction((prev) => ({ ...prev, transaction_id, tx_ref }));

          if (transaction) {
            setLoading(true);
            sendEmail();
          }
        } else {
          setLoading(false);
          toast({
            description: "Payment failed , please try again 🤷‍♀️",
          });
          // console.log("Payment Failed");
        }
        closePaymentModal();
      },
      onClose: () => {},
    });
  };
  const myForm = useRef();

  const newArray = items?.map((obj) => obj.name);
  const sendEmail = () => {
    // Replace the placeholders with your actual service ID, template ID, and public key
    const serviceId = "service_mo5rd0o";
    const templateId = "template_f3v0u3d";
    const publicKey = "YvI7FrI1htokZeo2H";

    const templateParams = {
      to_name: user?.email,
      transaction_Id: transaction?.transaction_id,
      transaction_ref: transaction?.tx_ref,
      displayName: user?.displayName || user?.email,
      amount: totalPrice,
      from_name: "Giftwears",
      newArray: newArray.join("\n"), // Use '\n' for line breaks in the email template
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((result) => {
        console.log("transaction mail");
        if (result) {
          addToOrders();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  if (!mounted) return;
  return (
    <div className="border-b overflow-hidden bg-lighter-grey border-light flex flex-col gap-[30px]  py-[50px] px-[10%] min-h-screen">
      <div className=" hidden w-full py-4 md:flex justify-between">
        {stagesOfPayment.map(({ id, desc, stillOnTab }) => (
          <div className=" flex flex-1 flex-col items-start" key={id}>
            <p>{id}</p>
            <p>{desc}</p>
            <div
              className={`mt-5 relative bg-dark/10 
               w-full`}
            >
              {" "}
              <span
                className={`w-4 absolute -left-1 top-1/2 -translate-y-1/2 h-4 rounded-full ${
                  stillOnTab ? "bg-dark" : "bg-dark/50"
                }`}
              ></span>{" "}
              <div
                className={` rounded-full  w-[calc(100%-4px)]  h-2 ${
                  stillOnTab ? "bg-dark" : "bg-transparent"
                }  `}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden w-screen -translate-x-1/2 left-1/2 relative py-3 md:flex items-center justify-center overflow-hidden text-[20px] bg-light-gray  gap-5">
        {[1, 2, 3, 4].map((text) => (
          <p key={text}>Free delivery to Lagos and Abuja </p>
        ))}
      </div>
      <div className=" flex flex-col gap-4">
        <div className=" hidden md:flex justify-between items-center py-3 border-b border-dark ">
          <div className=" w-1/2 ">Product</div>
          <div className=" flex-1 "> Quantity</div>
          <div className=" flex-1 "> Price</div>
        </div>
        <div className=" flex md:hidden w-full  py-3 border-b border-dark "></div>
        <div className=" w-full flex flex-col gap-2">
          {items.length >= 1 ? (
            items.map((item, i) => (
              <div
                key={i}
                className=" w-full   flex justify-between h-[250px] md:h-[200px] items-start py-3 border-b border-dark "
              >
                <div className="flex gap-2 w-[80%] md:w-1/2 h-full ">
                  <div className=" bg-light-gray relative w-1/2 md:w-1/3 min-h-full">
                    <Image
                      alt="cartImage"
                      objectFit="contain"
                      src={item.img}
                      fill
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className=" capitalize">{item.name}</p>
                    <p>Color:{item.color || "Not Specified"}</p>
                    <p>Size:{item.size || "Not Specified"}</p>
                    <p>Qty:{item.qty || "1"}</p>
                    <span className=" text-[20px] font-bold">
                      {" "}
                      #{item.price}
                    </span>{" "}
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-start  flex-1">
                  <button
                    onClick={() => decrease(item)}
                    className=" h-[40px] border-2 border-dark w-[40px] rounded-sm"
                  >
                    {" "}
                    -{" "}
                  </button>
                  <p className=" h-[40px] w-[40px] flex justify-center items-center">
                    {item.qty}
                  </p>
                  <button
                    onClick={() => increase(item)}
                    className=" h-[40px] border-2 border-dark w-[40px] rounded-sm"
                  >
                    {" "}
                    +{" "}
                  </button>
                </div>
                <div className="  flex-1 flex justify-between itc">
                  <span className=" md:flex hidden text-[20px] font-bold">
                    {" "}
                    #{item.price}
                  </span>{" "}
                  <X
                    className="  cursor-pointer"
                    onClick={() => remove(item)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div>
              <h1>Cart empty , lets go shopping</h1>
            </div>
          )}
          <div className=" flex justify-end">
            <div className="flex  flex-col gap-2 w-full md:w-1/2 float-right ">
              <div className=" capitalize text-[20px] gap-3 flex flex-col ">
                <div className=" flex justify-between">
                  <span>Subtotal: </span> #{totalPrice}
                </div>
                <div className=" flex justify-between">
                  <span>Shipping: </span> #4000
                </div>
              </div>
              <hr className=" w-full h-[2px] bg-light-gray" />
              <button
                disabled={loading}
                onClick={handleCheckOut}
                className={` ${
                  loading
                    ? "bg-gray-400 pointer-events-none cursor-not-allowed"
                    : "bg-dark pointer-events-auto cursor-pointer"
                } text-[20px] wfull h-[50px] bg-dark rounded text-white`}
              >
                Checkout
              </button>
              <Link
                href="/products"
                className=" flex justify-center items-center text-[20px] wfull h-[50px] bg-transparent border-2  border-dark rounded text-dark"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <form ref={myForm.current}>
            <input type="hidden" name="email" value={user?.email ?? null} />
            <input
              type="hidden"
              name="displayName"
              value={user?.displayName ? user.displayName : user?.email}
            />
            <input type="hidden" name="subTotal" value={totalPrice || '0'} />
            <input type="hidden" name="from_name" value="Kanlearn" />
            <input type="hidden" name="videoLink" value={newArray} />
          
          </form> */}
    </div>
  );
};

export default Cartpage;
