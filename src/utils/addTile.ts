import { MESSAGE_MAX_LENGTH } from "../constants";
import { TileForm } from "../types/tile";

export const isAddTileFormValid = (newTileFormData: TileForm) => {
  return (
    newTileFormData.date &&
      newTileFormData.message &&
      newTileFormData.message.length <= MESSAGE_MAX_LENGTH&&
      !newTileFormData.error.date &&
      !newTileFormData.error.message
  );
}