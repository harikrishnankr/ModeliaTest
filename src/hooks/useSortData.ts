import { compareAsc, getYear, parseISO } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Message } from "../data";

export enum Order {
  Initial = "INITIAL",
  Sorted = "SORTED"
}

type InputMap = Map<string, Message[]> | null;

export function useSortData(source: Message[], order: Order) {
  const [data, setData] = useState<{ key: string, messageList: Message[] }[]>([]);

  const sortData = useCallback(() => {
    const map: InputMap = new Map();
    source.forEach((msg) => {
      const parsedDate = parseISO(msg.date);
      const year = getYear(parsedDate).toString();
      /**
       * Grouping the tiles together
       */
      if (!map.has(year)) {
        map.set(year, [msg]);
      } else {
        map.get(year)?.push(msg);
        /**
         * Sort the tile list ascending order of date
         */
        if (order === Order.Sorted) {
          map.set(year , map.get(year)?.sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))) as Message[]);
        }
      }
    });
    setData(Array.from(map.entries()).map(([key, messageList]) => {
      return {
        key,
        messageList,
      }
    }).sort((a, b) => (+a.key > +b.key ? -1 : 1)));
  }, [source, order]);

  useEffect(() => {
    sortData();
  }, [source, sortData, order]);

  return { data };
}
