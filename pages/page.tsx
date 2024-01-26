import Image from "next/image";
import Landingpage from "./components/Landingpage";
import New from "./components/New";

export default function Home() {
  return (
    <main className="">
      <Landingpage />
      <New />
    </main>
  );
}
