import { LinearGradient } from "expo-linear-gradient";
import { X } from "lucide-react-native";
import React from "react";
import { Animated, Pressable, View } from "react-native";
import { Input, InputField } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Searchbar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const clearSearch = () => {
    onChange("");
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className="relative"
    >
      <View className="relative overflow-hidden rounded-2xl">
        {isFocused && (
          <LinearGradient
            colors={[
              "#1A5D4D",
              "rgba(255, 255, 255, 0.1)",
              "rgba(255, 255, 255, 0.1)",
            ]}
            start={{ x: 0, y: 0.7 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0 rounded-2xl"
          />
        )}

        <View
          className={`${
            isFocused ? "m-[2px]" : ""
          } bg-transparent backdrop-blur-xl rounded-2xl border ${
            isFocused ? "border-gray-600" : "border-white/90"
          }`}
        >
          <View className="relative flex-row items-center px-4 py-1">
            <View className="flex-1">
              <Input
                variant="outline"
                size="md"
                className="border-0 bg-transparent h-12"
                style={{ backgroundColor: "transparent" }}
              >
                <InputField
                  placeholder="Search coins..."
                  placeholderTextColor="#6b7280"
                  value={value}
                  onChangeText={onChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="text-white text-base border-0 bg-transparent focus:ring-0"
                />
              </Input>
            </View>

            {value.length > 0 && (
              <Pressable
                onPress={clearSearch}
                className="ml-2 p-1.5 rounded-full active:scale-90 transition-transform"
              >
                <X className="text-gray-400" color="white" size={18} />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
