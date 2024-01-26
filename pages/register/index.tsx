"use client";
import React, { useEffect, useState } from "react";
import useUserServices from "../utils/userStore";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";
const Page = () => {
  const Userschema = yup
    .object({
      email: yup.string().email().required().lowercase().trim(),
      password: yup
        .string()
        .required()
        .lowercase()
        .trim()
        .min(6, "Password must exceed 5 characters"),
      firstname: yup.string().required().lowercase().trim(),
      lastname: yup.string().required().lowercase().trim(),
    })
    .required();
  // interface User extends yup.InferType<typeof Userschema> {
  //   email: string;
  //   password: string;
  //   // using interface instead of type generally gives nicer editor feedback
  // }
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { registerUser } = useUserServices();
  const router = useRouter();
  const onSubmit = async (data: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }) => {
    setSubmitting(true);
    try {
      console.log("@register");
      const { email, password, firstname, lastname } = data;

      const res = await registerUser({ email, password, firstname, lastname });
      if (!res) return;
      const newUserData = {
        email,
        displayName: res.displayName,
        id: res.uid,
        verified: res.emailVerified,
        firstname,
        lastname,
        timeAdded: Timestamp.now().toDate(),
      };
      const doc = await addDoc(collection(db, "users"), newUserData);
      alert("Verification link sent to your mail ✔.");
      setSubmitting(false);
      router.push("/");
    } catch (error) {
      setSubmitting(false);
      console.log(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Userschema),
  });

  // useEffect(() => {
  //   handleLoginUser();
  // }, []);
  const textAnim = {
    initial: {
      opacity: 0,
      x: -5,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className="w-full relative h-[90vh]  bg-lighter-grey flex justify-center items-center">
      <div className="flex blur-md md:blur-0 w-full   h-full absolute left-0 top-0">
        <Image
          alt="svg"
          width={400}
          height={500}
          src="/svglogin1.svg"
          className=" absolute bottom-0 right-[100px]"
        />
        <Image
          alt="svg"
          width={100}
          height={350}
          src="/bgbox.svg"
          className=" absolute bottom-0 left-0"
        />
        <Image
          alt="svg"
          width={100}
          height={350}
          src="/bgbox.svg"
          className=" absolute bottom-0 right-0"
        />
        <Image
          alt="svg"
          width={100}
          height={350}
          src="/box2.svg"
          className=" absolute bottom-0 left-[100px]"
        />

        <Image
          alt="svg"
          width={150}
          height={150}
          src="/tv.svg"
          className=" absolute bottom-[30%] left-[10%]"
        />
        <Image
          alt="svg"
          width={100}
          height={80}
          src="/tv.svg"
          className=" absolute top-[30%] right-[20%]"
        />
        <Image
          alt="svg"
          width={40}
          height={40}
          src="/circle.svg"
          className=" absolute top-[40%] left-[3%]"
        />
        <Image
          alt="svg"
          width={40}
          height={40}
          src="/circle.svg"
          className=" absolute top-[9%] right-[2%]"
        />
        <Image
          alt="svg"
          width={20}
          height={20}
          src="/circle.svg"
          className=" absolute top-[37%] left-[20%]"
        />
        <Image
          alt="svg"
          width={40}
          height={40}
          src="/circle.svg"
          className=" absolute top-[10%] left-[30%]"
        />
        <Image
          alt="svg"
          width={40}
          height={40}
          src="/circle.svg"
          className=" absolute top-[30%] right-[20%]"
        />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" shadow-lg items-left w-[80%] z-[300] md:max-w-[350px] h-fit  md:min-h-[60vh] py-[25px] px-[30px] flex flex-col rounded-2xl bg-white "
      >
        <h1 className="font-bold text-center text-xl">User Sign Up</h1>
        <p className="text-center text-[15px]  font-light my-3 ">
          Here Enter your details to get to sign up to your account
        </p>
        <motion.input
          variants={textAnim}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1,
            type: "linear",
          }}
          type="email"
          className="w-full placeholder:text-dark outline-dark px-3 rounded-lg border border-lighter-grey bg-lighter-grey/20 shadow py-2"
          placeholder="Enter Email"
          {...register("email")}
        />
        <p className=" capitalize mt-1 text-red-400 ml-1">
          {errors.email?.message}
        </p>
        <motion.input
          variants={textAnim}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1,
            type: "linear",
          }}
          type="text"
          className="w-full placeholder:text-dark outline-dark px-3 rounded-lg border border-lighter-grey bg-lighter-grey/20 shadow py-2"
          placeholder="Enter Firstname"
          {...register("firstname")}
        />
        <p className=" capitalize mt-1 text-red-400 ml-1">
          {errors.firstname?.message}
        </p>
        <motion.input
          variants={textAnim}
          initial="initial"
          animate="animate"
          transition={{
            duration: 1,
            type: "linear",
          }}
          type="text"
          className="w-full placeholder:text-dark outline-dark px-3 rounded-lg border border-lighter-grey bg-lighter-grey/20 shadow py-2"
          placeholder="Enter Lastname"
          {...register("lastname")}
        />
        <p className=" capitalize mt-1 text-red-400 ml-1">
          {errors.lastname?.message}
        </p>
        <div className="relative w-full mt-3 outline-dark  rounded-lg border border-lighter-grey bg-lighter-grey/20 shadow ">
          <motion.input
            variants={textAnim}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1,
              type: "linear",
            }}
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className="w-full py-2 px-3 placeholder:text-dark bg-lighter-grey/20 outline-dark  "
            placeholder="Enter Password"
          />

          <div
            onClick={handleTogglePasswordVisibility}
            className="absolute  w-fit h-[20px] cursor-pointer top-1/2 -translate-y-1/2  right-2 flex items-center focus:outline-none"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </div>
        </div>
        <p className=" capitalize mb-3 mt-1 text-red-400 ml-1">
          {errors.password?.message}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className={` w-full h-[45px] font-medium rounded-lg ${
            submitting
              ? "bg-gray-400 pointer-events-none"
              : "bg-dark pointer-events-auto "
          } transition-all  text-white`}
        >
          Sign Up{" "}
        </button>

        <p className=" font-light my-3">
          {`Have an account?`}{" "}
          <Link className=" text-dark text-[15px] font-medium " href="/login">
            {" "}
            Log in
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Page;
