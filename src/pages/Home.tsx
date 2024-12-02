import React, { useState } from "react";
import { InputData } from "../data";
import { Order, useSortData } from "../hooks/useSortData";
import { Stack } from "../components/Stack";
import { Layout } from "../components/Layout";
import { Button } from "../components/Button";
import Dialog from "../components/Dialog";
import DateInput from "../components/DateInput";
import TextArea from "../components/TextArea";

const INIT_FORM_DATA = {
  date: "",
  message: "",
  error: {
    date: "",
    message: "",
  },
};

export const Home: React.FC = () => {
  const [tiles, setTiles] = useState(InputData);
  const [order, setOrder] = useState(Order.Initial);
  const { data } = useSortData(tiles, order);
  const [draggingStack, setDraggingStack] = useState<number | string | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTileFormData, setNewTileFormData] = useState({ ...INIT_FORM_DATA });

  const onDragUpdate = (event: string, stackId: string | number) => {
    if (event === "start") {
      setDraggingStack(stackId);
    } else {
      setDraggingStack(null);
    }
  };

  const onSubmit = () => {
    if (
      newTileFormData.date &&
      newTileFormData.message &&
      !newTileFormData.error.date &&
      !newTileFormData.error.message
    ) {
      setNewTileFormData({ ...INIT_FORM_DATA });
      setIsAddDialogOpen(false);
      setTiles([
        ...tiles,
        { date: newTileFormData.date, message: newTileFormData.message },
      ]);
    }
  };

  const onCancel = () => {
    setNewTileFormData({ ...INIT_FORM_DATA });
    setIsAddDialogOpen(false);
  };

  return (
    <Layout
      headerActions={
        <>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Tile</Button>
          <Button onClick={() => setOrder(Order.Initial)} className="ml-4">
            Initial Order
          </Button>
          <Button onClick={() => setOrder(Order.Sorted)} className="ml-4">
            Sorted Order
          </Button>
        </>
      }
    >
      <Dialog
        isOpen={isAddDialogOpen}
        onClose={onCancel}
        className="max-w-[480px]"
      >
        <div className="h-12 p-3">
          <h1 className="font-bold text-lg">Add New Tile</h1>
        </div>
        <div className="p-3">
          <div className="mb-3">
            <DateInput
              label="Date"
              onChange={(e) => {
                setNewTileFormData({
                  ...newTileFormData,
                  date: e,
                });
              }}
              onError={(e) => {
                setNewTileFormData((data) => ({
                  ...data,
                  error: {
                    ...newTileFormData.error,
                    date: e,
                  },
                }));
              }}
            />
          </div>
          <div className="mb-3">
            <TextArea
              label="Message"
              value={newTileFormData.message}
              onChange={(e) =>
                setNewTileFormData({
                  ...newTileFormData,
                  message: e.target.value,
                  error: {
                    ...newTileFormData.error,
                    message: !e.target.value ? "This field is required" : "",
                  },
                })
              }
              onBlur={(e) => {
                setNewTileFormData({
                  ...newTileFormData,
                  message: e.target.value,
                  error: {
                    ...newTileFormData.error,
                    message: !e.target.value ? "This field is required" : "",
                  },
                });
              }}
              maxLength={200}
              error={newTileFormData.error.message}
            />
          </div>
        </div>
        <div className="p-3 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Submit</Button>
        </div>
      </Dialog>
      <div className="p-3">
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
