export const maxDuration = 30;

// NOTE: you could use this if you wanted serverless chat route
//
// export async function POST(req: Request) {
//   const { messages }: { messages: UIMessage[] } = await req.json();
//
//   const result = streamText({
//     model: openai("gpt-4.1"),
//     messages: convertToModelMessages(messages),
//   });
//
//   return result.toUIMessageStreamResponse();
// }
