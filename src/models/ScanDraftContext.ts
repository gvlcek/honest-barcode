import { createContext, type Dispatch, type SetStateAction } from "react";

interface DraftThumbnail {
  scanId: string;
  base64: string;
}

export const ScanDraftContext = createContext<{
  thumbnail: DraftThumbnail | null;
  setThumbnail: Dispatch<SetStateAction<DraftThumbnail | null>>;
}>({
  thumbnail: null,
  setThumbnail: () => {},
});
