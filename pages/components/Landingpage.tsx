import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Landingpage = () => {
  const bgStyle = {
    background:
      "linear-gradient(90deg, rgba(239,239,239,1) 50%, rgba(198,199,192,1) 100%)",
  };
  const textStyle = {
    fontFamily: "'Mirage', sans-serif",
  };

  return (
    <>
      <div
        // style={bgStyle}
        className="h-[90vh] bg-light-gray overflow-hidden flex items-center w-full relative "
      >
        <div className=" z-50 absolute bottom-[15%] md:bottom-auto md:relative md:left-auto md:translate-x-0  left-1/2 md:w-fit  -translate-x-1/2 justify-center items-center md:items-start text-white  text-center md:text-left  md:text-dark flex flex-col space-y-2 md:ml-[8%] uppercase w-full">
          <h1 className="text-[25px] md:text-[35px] tracking-wider  font-bold ">
            joy, one outfit at a time.
          </h1>
          <p className=" w-[70%] md:w-fit text-[15px] md:text-[20px] tracking-wide font-medium">
            Where style becomes a statement, and every day is a celebration.
          </p>
          <Link
            className=" w-fit border-b-2 border-white md:border-dark"
            href="/shop"
          >
            Shop Now
          </Link>
        </div>
        <Image
          className=" absolute object-cover scale-x-[-1] right-0  bottom-0 md:top-1/2 md:-translate-y-1/2"
          alt="model"
          width={700}
          height={700}
          src="/modelnew.png"
        />
        <div className=" w-full h-full opacity-20  absolute top-0 left-0 bg-dark"></div>
      </div>
      <div className=" bg-light h-[50vh] flex flex-col space-y-3 justify-center items-center">
        <small className=" text-[20px]">UP TO</small>
        <h1 className=" text-[60px] font-bold">60% OFF</h1>
        <p className=" text-[20px] text-center">
          Farther and Final <br /> Reductions
        </p>
        <ChevronDown />
      </div>
      <div className="  ">
        <div className=" md:px-0 w-[100%] h-screen mx-auto flex">
          <div className=" flex-1  border relative h-full bg-light-gray">
            <Image
              src="/Mod.jpg"
              alt="Your Image"
              fill
              objectFit="cover"
              objectPosition="top"
            />
            <div className=" absolute top-0 left-0 w-full h-full bg-dark  opacity-30"></div>
            <Link
              className=" absolute bottom-[20%] text-light font-bold text-[25px] tracking-wide left-1/2 -translate-x-1/2"
              href="/products"
            >
              In Trend
            </Link>
          </div>
          <div className=" flex-1 border  relative h-full bg-lighter-grey">
            <Image
              src="/mod1.jpg"
              alt="Your Image"
              fill
              objectFit="cover"
              objectPosition="top"
            />
            <div className=" absolute top-0 left-0 w-full h-full bg-dark  opacity-30"></div>

            <Link
              className=" absolute bottom-[20%] text-light font-bold text-[25px] tracking-wide left-1/2 -translate-x-1/2"
              href="/products"
            >
              {" "}
              Summer{" "}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landingpage;
