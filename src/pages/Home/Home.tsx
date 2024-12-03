import React, { useState } from "react";
import { InputData, Message } from "../../data";
import { Order, useSortData } from "../../hooks/useSortData";
import { Stack } from "../../components/Stack";
import { Layout } from "../../components/Layout";
import { Button } from "../../components/Button";
import { AddNewTile } from "./AddNewTile";
import ToggleSwitch from "../../components/Switch";

export const Home: React.FC = () => {
  const [tiles, setTiles] = useState(InputData);
  const [order, setOrder] = useState(Order.Initial);
  const { data } = useSortData(tiles, order);
  const [draggingStack, setDraggingStack] = useState<number | string | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const onDragUpdate = (event: string, stackId: string | number) => {
    if (event === "start") {
      setDraggingStack(stackId);
    } else {
      setDraggingStack(null);
    }
  };

  const onSubmit = (message: Message) => {
    setTiles([...tiles, { ...message }]);
    setIsAddDialogOpen(false);
  };

  const onCancel = () => {
    setIsAddDialogOpen(false);
  };

  return (
    <Layout
      headerActions={
        <div className="flex gap-3 items-center">
          <div className="flex items-center">
            <div className="mr-1">Order:</div>
            <ToggleSwitch
              offLabel="Initial"
              onLabel="Sort"
              onToggle={(e) => setOrder(!e ? Order.Initial : Order.Sorted)}
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <span className="md:hidden">+</span>
            <span className="hidden md:inline-block">Add Tile</span>
          </Button>
        </div>
      }
    >
      <AddNewTile
        isOpen={isAddDialogOpen}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      <div className="p-3 h-full">
        <div className="flex gap-3">
          {data
            ? data.map(({ key, messageList }) => {
                return (
                  <Stack
                    key={key}
                    date={key}
                    messages={messageList}
                    onDragUpdate={onDragUpdate}
                    disabled={!!draggingStack && draggingStack !== key}
                  />
                );
              })
            : null}
        </div>
      </div>
    </Layout>
  );
};
