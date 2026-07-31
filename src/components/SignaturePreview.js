import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

const DOT_SIZE = 6;

const SignaturePreview = ({ strokes = [], height = 100, borderRadius = 12 }) => {
  const [dims, setDims] = useState({ width: 0, height: 0 });

  return (
    <View
      style={[styles.container, { height, borderRadius }]}
      onLayout={(e) =>
        setDims({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })
      }
    >
      {dims.width > 0 &&
        strokes.map((stroke, strokeIndex) =>
          stroke.map((point, pointIndex) => (
            <View
              key={`${strokeIndex}-${pointIndex}`}
              style={[
                styles.dot,
                {
                  left: point[0] * dims.width - DOT_SIZE / 2,
                  top: point[1] * dims.height - DOT_SIZE / 2,
                },
              ]}
            />
          ))
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#000000',
  },
});

export default SignaturePreview;
