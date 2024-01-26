"use client";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const Page = () => {
  const storage = getStorage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [detailsInput, setDetailsInput] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);
  const [addingImages, setAddingImages] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [indexTobePassed, setIndexTobePassed] = useState(1);
  const [screenWidth, setScreenWidth] = useState(0);
  type Form = {
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
  };
  const [formData, setFormData] = useState<Form>({
    title: "",
    price: 0,
    color: "",
    size: "",
    category: "",
    images: [],
    quantityAvailable: 0,
    details: [],
    tags: [],
    likes: 0,
  });
  const [stage, setStage] = useState([
    {
      id: 1,
      stage: true,
      move: false,
    },
    {
      id: 2,
      stage: false,
      move: false,
    },
    {
      id: 3,

      stage: false,
      move: false,
    },
  ]);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    // Add event listener on component mount
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log(screenWidth);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    // Handle the case where files might be null
    const selected = files ? Array.from(files) : [];
    setSelectedFiles(selected);
  };
  console.log(selectedFiles);
  const handleUpload = async () => {
    const uploadPromises = Array.from(selectedFiles).map((file) => {
      const timestamp = new Date().getTime();
      const storageRef = ref(
        storage,
        `images/${timestamp}_${file.name.replace(/\s/g, "")}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<void>(async (resolve, reject) => {
        try {
          setAddingImages(true);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              // You can update UI here using onUpload('uploading', progress)
            },
            (error) => {
              console.error("Error uploading image:", error);
              // Update UI for error state using onUpload('error')
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setFormData((prev) => ({
                ...prev,
                images: [...(prev.images ?? []), downloadURL],
              }));
              console.log("File available at", downloadURL);
              // Update UI for success state using onUpload('success')
              resolve();
            }
          );
          setAddingImages(false);
        } catch (error) {
          console.error("Error during upload:", error);
          // Handle other errors here
          reject(error);
          setAddingImages(false);
        }
      });
    });

    try {
      await Promise.all(uploadPromises);
      // All uploads successful, update UI using onUpload('complete')
    } catch (error) {
      console.error("Error uploading images:", error);
      // Handle overall error
    }
  };

  const handleStageForward = (index: number) => {
    const { title, price, images, category, details, tags } = formData;
    if (index === 1) {
      if (!title || !price) {
        setBtnDisabled(true);
        setError("Fill all inputs to continue");
        return;
      } else {
        setBtnDisabled(false);
      }
    }
    if (index === 2) {
      if (selectedFiles.length <= 0 || selectedFiles.length <= 2 || !category) {
        setBtnDisabled(true);
        setError("Please add images(more than 2) and a category");
        return;
      }
      handleUpload();
    }

    const submitForm = async () => {
      const newProductData = {
        ...formData,
        timeAdded: Timestamp.now().toDate(),
      };
      try {
        setAddingProduct(true);
        await addDoc(collection(db, "products"), newProductData);
        toast({
          description: "Product has been added successfully",
        });
        setAddingProduct(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (indexTobePassed >= stage.length) {
      submitForm();
      return;
    }

    setStage((prev) =>
      prev.map((item) =>
        item.id - 1 === index ? { ...item, stage: true } : { ...item }
      )
    );
    setIndexTobePassed((prev) => prev + 1);
  };
  const transformVal =
    (indexTobePassed - 1) * (screenWidth > 800 ? 600 : 400) + "px";

  const translateVal = {
    transform: `translateX(-${transformVal})`,
    transition: `all .3s ease-in-out`,
  };

  const addDetail = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      details: [...prevFormData.details, detailsInput],
    }));
    setDetailsInput("");
  };
  const addTags = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: [...(prevFormData.tags ?? []), tagsInput],
    }));
    setTagsInput("");
  };
  if (addingProduct)
    return (
      <div className=" min-h-screen flex justify-center items-center">
        <p>Product is been added</p>
      </div>
    );

  return (
    <section className="min-h-screen text-[20px] flex flex-col bg-light justify-center items-center">
      {error && <p className="mb-5 text-sm">{error}</p>}
      <div className=" py-5 max-w-[400px] md:max-w-[600px] text-light bg-dark overflow-x-hidden  rounded gap-3 ">
        <div
          style={translateVal}
          className={`  overflow-x-hidden flex  w-fit `}
        >
          <div className=" px-4  py-2 flex-shrink-0  w-[400px] md:w-[600px] ">
            <div className=" flex mb-3 flex-col gap-3 ">
              <label htmlFor="title">Enter Product Title</label>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className=" text-dark focus:outline-dark outline-none py-2 px-3  rounded"
                type="text"
                placeholder="Red Shirt"
              />
            </div>
            <div className=" flex flex-col gap-3 ">
              <label htmlFor="price">Enter Product Price</label>
              <input
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className=" text-dark outline-none focus:outline-dark py-2 px-3  rounded"
                type="number"
                placeholder="4000"
              />
            </div>
          </div>
          <div className=" px-4  py-2 flex-shrink-0  w-[400px] md:w-[600px] ">
            <div className=" flex flex-col gap-3 ">
              <label htmlFor="title">Upload Images </label>
              <input
                className=" focus:outline-dark outline-none py-2 px-3  rounded"
                type="file"
                onChange={handleFileChange}
                multiple
              />
            </div>
            <div className="text-dark flex flex-col gap-3 ">
              <label htmlFor="price">Enter Product Category</label>
              <select
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className=" focus:outline-dark outline-none py-2 px-3  rounded"
                name="category"
                id="category"
              >
                <option value="">Select Category</option>
                <option value="shirt">Shirt</option>
                <option value="trouser">Trouser</option>
                <option value="shoe">shoe</option>
                <option value="shoe">no category</option>
              </select>
            </div>
          </div>
          <div className=" px-4 flex flex-col gap-3 text-[15px]  py-2 flex-shrink-0  w-[400px] md:w-[600px] ">
            <div className=" flex flex-col gap-3 ">
              <label htmlFor="title">Products Details </label>
              <div className=" flex gap-2">
                <input
                  value={detailsInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  className=" text-dark placeholder:text-dark/40 flex-1 focus:outline-dark outline-none py-2 px-3  rounded"
                  type="text"
                  placeholder="Enter specific details about products"
                />{" "}
                <button
                  onClick={addDetail}
                  className=" w-[150px] h-[50px] rounded border-2 border-light bg-dark text-light"
                >
                  Add detail
                </button>
              </div>
              {formData?.details.length > 0 ? (
                <ol className=" px-3 py-1 flex flex-col gap-2 border border-light-gray">
                  {formData.details.map((details, i) => (
                    <li className=" items-center flex" key={i}>
                      {" "}
                      * {details}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Details will appear here</p>
              )}
            </div>
            <div className=" flex flex-col gap-3 ">
              <label htmlFor="title">Tags related to product </label>
              <div className=" flex gap-2">
                <input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className=" text-dark placeholder:text-dark/40 flex-1 focus:outline-dark outline-none py-2 px-3  rounded"
                  type="text"
                  placeholder="Enter tags related to products"
                />{" "}
                <button
                  onClick={addTags}
                  className=" w-[150px] h-[50px] rounded border-2 border-light bg-dark text-light"
                >
                  Add Tag
                </button>
              </div>
              {formData?.tags ? (
                <ol className="px-3 py-1 flex flex-col gap-2 border border-light-gray">
                  {(formData.tags ?? []).map((tags, i) => (
                    <li className=" items-center flex" key={i}>
                      {" "}
                      * {tags}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Tags will appear here</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => handleStageForward(indexTobePassed)}
        className={`" ${
          btnDisabled
            ? "bg-dark/30 cursor-not-allowed"
            : " cursor-pointer bg-dark "
        }  w-[200px] mt-4 py-3 rounded text-white "`}
      >
        Next
      </button>
      <div className=" w-[80%] md:w-1/3 gap-[20px] mt-5 h-3 bg-dark/10  rounded-md flex justify-between items-center">
        {stage.map((item, i) => (
          <div
            className={` flex-1 h-full rounded-md ${
              item.stage ? "bg-green-500" : " bg-dark/50"
            }  `}
            key={i}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Page;
