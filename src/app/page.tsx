"use client";

import { nanoid } from "nanoid";

import { Chat } from "@/components/chat/chat";

export default function Home() {
  const id = `tid_${nanoid()}`;

  return <Chat id={id} key={id} />;
}
