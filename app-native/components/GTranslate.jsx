import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const GTranslate = () => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://translate.google.com" }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default GTranslate;
