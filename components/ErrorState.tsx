import { Button, ButtonText } from "@/components/ui/button";
import { AlertCircle } from "lucide-react-native";
import { Text, View } from "react-native";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <View className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="w-16 h-16 text-destructive" />
      <Text className="text-xl font-semibold text-foreground">
        Oops! Something went wrong
      </Text>
      <Text className="text-muted-foreground text-center max-w-md">
        {message}
      </Text>
      {onRetry && (
        <Button onPress={onRetry} variant="outline" className="mt-2">
          <ButtonText> Try Again</ButtonText>
        </Button>
      )}
    </View>
  );
};
