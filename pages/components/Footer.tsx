"use client";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [footerLinks, setFooterLinks] = useState([
    {
      id: 1,
      name: "Gift Wears",
      displayLinks: false,
    },
    {
      id: 2,
      name: "Company",
      displayLinks: false,
    },
    {
      id: 3,
      name: "Company",
      displayLinks: false,
    },
    {
      id: 4,
      name: "Mail",
      displayLinks: false,
    },
  ]);
  const handleNavReveal = (id: number) => {
    setFooterLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, displayLinks: !item.displayLinks }
          : { ...item, displayLinks: false }
      )
    );
  };
  // const FooterLinks = [
  //   {
  //     id: 1,
  //     name: "Gift Wears",
  //     displayLinks: false,
  //   },
  //   {
  //     id: 2,
  //     name: "Company",
  //     displayLinks: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Company",
  //     displayLinks: false,
  //   },
  //   {
  //     id: 4,
  //     name: "Mail",
  //     displayLinks: false,
  //   },
  // ];
  return (
    <footer className=" relative bg-light-gray justify-center flex items-center px-3 py-4 md:px-0 md:py-0 text-[17px] tracking-wide h-fit  md:h-[50vh]  md:text-dark ">
      <div className=" w-full h-fit md:w-[80%] flex flex-col md:flex-row  justify-between md:items-center md:gap-[20px] mx-auto">
        <div className=" flex flex-col gap-4">
          <>
            <div className=" hidden md:flex flex-col">
              <h1 className=" border-b items-center flex border-dark h-[50px] md:h-auto md:border-0 font-bold text-[20px]">
                Gift Wears
              </h1>

              <ul>
                <li>
                  <p>Email:</p>
                  <p>Kuipidtech@gmail.com</p>
                </li>
                <li>
                  <p>Phone:</p>
                  <p>+234 91 5701 666 9</p>
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:hidden">
              <h1
                onClick={() => handleNavReveal(1)}
                className=" border-b items-center flex border-dark h-[50px] md:h-auto md:border-0 font-bold text-[20px]"
              >
                Gift Wears
              </h1>
              {footerLinks[0].displayLinks && (
                <ul>
                  <li>
                    <p>Email:</p>
                    <p>Kuipidtech@gmail.com</p>
                  </li>
                  <li>
                    <p>Phone:</p>
                    <p>+234 91 5701 666 9</p>
                  </li>
                </ul>
              )}
            </div>
          </>
        </div>
        <div className=" flex flex-col gap-4">
          <>
            <h1 className="border-b md:flex hidden items-center  border-dark h-[50px] md:h-auto md:border-0  font-bold text-[20px]">
              Company
            </h1>

            <ul className=" md:flex hidden  flex-col gap-1">
              <li>About</li>
              <li>Stores</li>
              <li>Career</li>
              <li>Shipping</li>
            </ul>

            <h1
              onClick={() => handleNavReveal(2)}
              className="border-b md:hidden items-center flex border-dark h-[50px] md:h-auto md:border-0  font-bold text-[20px]"
            >
              Company
            </h1>
            {footerLinks[1].displayLinks && (
              <ul className=" flex flex-col gap-1">
                <li>About</li>
                <li>Stores</li>
                <li>Career</li>
                <li>Shipping</li>
              </ul>
            )}
          </>
        </div>
        <div className=" flex flex-col gap-4">
          <h1
            onClick={() => handleNavReveal(3)}
            className="md:flex hidden border-b items-center  border-dark h-[50px] md:h-auto md:border-0  font-bold text-[20px]"
          >
            Socials
          </h1>

          <ul className=" hidden md:flex flex-col gap-1">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Twitter</li>
            <li className=" invisible pointer-events-none">Test</li>
          </ul>
          <div className="md:hidden h-[50px]  border-b border-dark flex items-center gap-3">
            <Twitter />

            <Facebook />

            <Instagram />
          </div>
        </div>
        <div className=" flex flex-col gap-4">
          <>
            <h1 className="border-b items-center hidden md:flex border-dark h-[50px] md:h-auto md:border-0  font-bold text-[20px]">
              Newsletter
            </h1>

            <div className=" hidden md:flex flex-col gap-4 ">
              <p>
                Subscribe to receive updates, access <br /> to exclusive deals
                and more.
              </p>
              <input
                placeholder="Your email address"
                type="text "
                className=" placeholder:text-dark w-full p-2  outline-none bg-transparent border border-dark h-[50px] md:h-auto"
              />
              <button className=" h-[50px] w-1/2 bg-dark text-white">
                Submit
              </button>
            </div>

            <h1
              onClick={() => handleNavReveal(4)}
              className="border-b items-center md:hidden flex border-dark h-[50px] md:h-auto md:border-0  font-bold text-[20px]"
            >
              Newsletter
            </h1>
            {footerLinks[3].displayLinks && (
              <>
                <p>
                  Subscribe to receive updates, access <br /> to exclusive deals
                  and more.
                </p>
                <input
                  placeholder="Your email address"
                  type="text "
                  className=" placeholder:text-dark w-full p-2  outline-none bg-transparent border border-dark h-[50px] md:h-auto"
                />
                <button className=" h-[50px] w-1/2 bg-dark text-white">
                  Submit
                </button>
              </>
            )}
          </>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
