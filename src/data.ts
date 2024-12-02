export type Message = Record<"date" | "message", string>;

export const InputData: Message[] = [
  { date: "2021-06-24", message: "message E" },
  { date: "2021-06-21", message: "message D" },
  { date: "2020-06-18", message: "message A" },
  { date: "2021-06-20", message: "message C" },
  { date: "2020-06-19", message: "message B" },
  { date: "2021-06-29", message: "message F" },
];
