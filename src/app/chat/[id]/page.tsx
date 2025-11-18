import { notFound } from "next/navigation";

import { env } from "@/lib/env";
import { Chat } from "@/components/chat/chat";

const DEFAULT_AGENT = "jarvis";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // TODO: Add backend chat fetching when ready
  // const res = await fetch(`${env.SERVER_BASE_URL}/chat/${id}`, {
  //   cache: "no-store",
  // });

  // if (res.status === 404) {
  //   notFound();
  // }

  // const session = await res.json();
  // const messages = session.messages; // assuming that the API returns UIMessage[]

  // return (
  //   <Chat
  //     id={session.id}
  //     initialMessages={messages}
  //     initialAgent={session.agentId ?? DEFAULT_AGENT}
  //   />
  // );

  return <Chat id={id} key={id} initialAgent={DEFAULT_AGENT} />;
}
