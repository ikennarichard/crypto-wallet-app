import { palette } from "@/constants/colors";
import { Heart } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function FavoriteButton({
  isFavorite,
  onToggleFavorite,
  item,
}: {
  isFavorite: boolean;
  onToggleFavorite: any;
  item: any;
}) {
  return (
    <TouchableOpacity
      onPress={(e) => {
        e.stopPropagation();
        onToggleFavorite(item);
      }}
      className="w-8 h-8"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        borderRadius: 20,
      }}
    >
      <Heart
        color={isFavorite ? palette.lime : "gray"}
        fill={isFavorite ? palette.green : ""}
        size={24}
      />
    </TouchableOpacity>
  );
}
