import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { modalStyles as m } from "@/src/shared/styles/modalStyles";

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function StartSessionModal({ visible, onConfirm, onCancel }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={m.backdrop}>
        <View style={m.content}>
          <View style={m.confirmIconWrap}>
            <Ionicons name="play" size={28} color="#0b4c29" />
          </View>
          <Text style={m.title}>Start Session</Text>
          <Text style={m.body}>
            Are you sure you want to start this route session?
          </Text>
          <View style={m.buttons}>
            <TouchableOpacity style={m.cancelButton} onPress={onCancel}>
              <Text style={m.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={m.confirmButton} onPress={onConfirm}>
              <Text style={m.confirmText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
