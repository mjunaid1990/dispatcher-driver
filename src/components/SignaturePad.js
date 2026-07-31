import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';

const DOT_SIZE = 6;

const SignaturePad = forwardRef(({
  height = 220,
  strokeColor = '#000000',
  strokeWidth = 3,
  backgroundColor = '#ffffff',
  borderRadius = 12,
}, ref) => {
  const strokesRef = useRef([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const [, forceRender] = useState(0);

  const bump = () => forceRender((v) => v + 1);

  const addPoint = (evt) => {
    const x = evt.nativeEvent.locationX;
    const y = evt.nativeEvent.locationY;
    const current = strokesRef.current;
    const lastStroke = current[current.length - 1];
    const lastPoint = lastStroke ? lastStroke[lastStroke.length - 1] : null;
    if (lastPoint && Math.abs(lastPoint[0] - x) < 2 && Math.abs(lastPoint[1] - y) < 2) return;
    if (lastStroke) {
      lastStroke.push([x, y]);
    } else {
      current.push([[x, y]]);
    }
    bump();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        strokesRef.current.push([]);
        addPoint(evt);
      },
      onPanResponderMove: (evt) => addPoint(evt),
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  useImperativeHandle(ref, () => ({
    clear: () => {
      strokesRef.current = [];
      bump();
    },
    isEmpty: () => strokesRef.current.length === 0,
    capture: () => {
      const strokes = strokesRef.current.filter((s) => s.length > 0);
      if (strokes.length === 0) return null;
      const { width, height: h } = dimensionsRef.current;
      if (!width || !h) return null;
      const polylines = strokes
        .map(
          (stroke) =>
            `<polyline points="${stroke
              .map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`)
              .join(' ')}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`
        )
        .join('');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${h}">${polylines}</svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    },
    getStrokes: () => {
      const { width, height: h } = dimensionsRef.current;
      if (!width || !h) return [];
      return strokesRef.current
        .filter((s) => s.length > 0)
        .map((stroke) => stroke.map((p) => [p[0] / width, p[1] / h]));
    },
  }));

  return (
    <View
      style={[
        styles.pad,
        { height, backgroundColor, borderRadius },
      ]}
      onLayout={(e) => {
        dimensionsRef.current = {
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        };
      }}
      {...panResponder.panHandlers}
    >
      {strokesRef.current.map((stroke, strokeIndex) =>
        stroke.map((point, pointIndex) => (
          <View
            key={`${strokeIndex}-${pointIndex}`}
            style={[
              styles.dot,
              {
                left: point[0] - DOT_SIZE / 2,
                top: point[1] - DOT_SIZE / 2,
                backgroundColor: strokeColor,
              },
            ]}
          />
        ))
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  pad: {
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});

export default SignaturePad;
