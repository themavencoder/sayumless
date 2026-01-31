import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "sayumless - stop saying um";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#1c1917",
            display: "flex",
          }}
        >
          say
          <span style={{ color: "#a3a3a3" }}>um</span>
          less
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#57534e",
            marginTop: 20,
          }}
        >
          See exactly how you sound when you speak
        </div>
        <div
          style={{
            marginTop: 50,
            background: "#d97706",
            color: "white",
            padding: "16px 40px",
            borderRadius: 30,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          Try it free
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
