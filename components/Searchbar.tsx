import { Search } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Searchbar({ value, onChange }: SearchBarProps) {
  return (
    <View>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input>
          <InputField
            placeholder="Search coins..."
            value={value}
            onChangeText={(text) => onChange(text)}
            className="pl-10 bg-card/50 border-border focus:ring-primary focus:border-primary"
          />
          <InputSlot>
            <InputIcon>
              <Search />
            </InputIcon>
          </InputSlot>
        </Input>
      </div>
    </View>
  );
}
