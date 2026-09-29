import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#f54a00",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 7,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#020617",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 7,
            bottom: 7,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#020617",
          }}
        />
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: 5,
              height: 18,
              borderRadius: 3,
              background: "#ffffff",
              transform: "rotate(-45deg)",
            }}
          />
          <div
            style={{
              width: 5,
              height: 18,
              borderRadius: 3,
              background: "#020617",
              transform: "rotate(-45deg)",
              marginLeft: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
