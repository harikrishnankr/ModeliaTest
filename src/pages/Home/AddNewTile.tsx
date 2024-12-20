import React, { useState } from "react";
import Dialog from "../../components/Dialog";
import DateInput from "../../components/DateInput";
import TextArea from "../../components/TextArea";
import { Button } from "../../components/Button";
import { Message } from "../../data";
import { INIT_FORM_DATA, MESSAGE_MAX_LENGTH } from "../../constants";
import { isAddTileFormValid } from "../../utils/addTile";

interface AddNewTileProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (e: Message) => void;
}

export const AddNewTile: React.FC<AddNewTileProps> = ({
  isOpen,
  onCancel,
  onSubmit,
}) => {
  const [newTileFormData, setNewTileFormData] = useState({ ...INIT_FORM_DATA });

  const submit = () => {
    if (isAddTileFormValid(newTileFormData)) {
      setNewTileFormData({ ...INIT_FORM_DATA });
      onSubmit({
        date: newTileFormData.date,
        message: newTileFormData.message,
      });
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onCancel} className="max-w-[480px]">
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
            maxLength={MESSAGE_MAX_LENGTH}
            error={newTileFormData.error.message}
          />
        </div>
      </div>
      <div className="p-3 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={submit}
          disabled={!isAddTileFormValid(newTileFormData)}
        >
          Submit
        </Button>
      </div>
    </Dialog>
  );
};
