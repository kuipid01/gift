"use server";
import { cookies } from "next/headers";

export async function createCookie(data: {
  email: string;
  id: string | undefined;
}) {
  cookies().set({
    name: "user",
    value: JSON.stringify(data),
    httpOnly: true,
    path: "/",
  });
}
