"use client";
import { create } from "zustand";
import { useToast } from "@/components/ui/use-toast";
import { initializeApp } from "firebase/app";

import { cookies } from "next/headers";

import {
  GoogleAuthProvider,
  User,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail,
} from "firebase/auth";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyANHSRQj2vvpdmows1WTfXdj3zbxjHDCto",
  authDomain: "react-netflix-clone-3723e.firebaseapp.com",
  projectId: "react-netflix-clone-3723e",
  storageBucket: "react-netflix-clone-3723e.appspot.com",
  messagingSenderId: "321165397369",
  appId: "1:321165397369:web:417d09a9149119320bb3a8",
  measurementId: "G-BT0GZ50L23",
};
// Get authentication instance and navigation hook

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
export type UserInfo = {
  email: string | null;
  password: string;
  displayName: string | null;
  id?: string;
}; // Added optional properties for displayName and id

const initialState: UserInfo = {
  email: "",
  password: "",
  displayName: "", // Added initial value for displayName
  id: "", // Added initial value for id
};

export const userStore = create<UserInfo>()(
  persist(() => initialState, {
    name: "user",
  })
);

export default function useUserServices() {
  const { toast } = useToast();
  const auth = getAuth();
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  // Effect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup the subscription on unmount or if dependencies change
    return () => unsubscribe();
  }, [auth]);
  return {
    user: user,
    registerUser: async (userInfo: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    }) => {
      try {
        const { email, password, firstname, lastname } = userInfo;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await sendEmailVerification(user);
        const { email: emailIn, displayName, uid } = user; // Corrected destructuring
        userStore.setState({ email: emailIn, displayName, id: uid });
        // console.log(user);
        toast({
          description: "User Created Successful ✔ ",
        });
        setUser(user);
        return user;
      } catch (error) {
        toast({
          description: "An error occured ,try again! 🤔",
        });

        console.log(error);
      }
    },
    loginUser: async (userInfo: { email: string; password: string }) => {
      try {
        const { email, password } = userInfo;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        setUser(user);
        const { email: emailIn, displayName, uid } = user; // Corrected destructuring
        userStore.setState({ email: emailIn, displayName, id: uid });

        toast({
          description: "Login Successful✔ ",
        });
        return user;
      } catch (error) {
        toast({
          description: "An error occured ,try again with correct details! 🤔",
        });
        console.log(error); // Added error handling
      }
    },
    logoutUser: async () => {
      console.log("shey we dey here");
      await signOut(auth);
      setUser(null);
      userStore.setState({ email: "", displayName: "", id: "" });
      console.log("success");
    },
    init: () => userStore.setState(initialState),
  };
}
