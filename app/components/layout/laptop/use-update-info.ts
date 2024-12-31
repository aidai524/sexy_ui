import { useState } from "react";
export default function useUpdateInfo() {
  const [likedListKey, setLikeListKey] = useState(0);
  const [flipListKey, setFlipListKey] = useState(0);
  const [createListKey, setCreateListKey] = useState(0);

  const updateInfo = (type: "liked" | "flip" | "create") => {
    if (type === "liked") {
      setLikeListKey(likedListKey + 1);
      return;
    }
    if (type === "flip") {
      setFlipListKey(flipListKey + 1);
      return;
    }
    if (type === "create") {
      setCreateListKey(createListKey + 1);
      return;
    }
  };

  return {
    updateInfo,
    likedListKey,
    flipListKey,
    createListKey
  };
}
