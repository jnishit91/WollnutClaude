import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wollnut Labs — Enterprise GPU Cloud";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#3b5bdb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "white",
            }}
          >
            W
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "white",
            }}
          >
            Wollnut Labs
          </span>
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#8b8fa3",
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Enterprise GPU Cloud for AI/ML Workloads
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {["H100", "H200", "B200"].map((gpu) => (
            <div
              key={gpu}
              style={{
                padding: "12px 32px",
                borderRadius: "12px",
                border: "1px solid #2a2a3a",
                background: "#15151f",
                color: "white",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              {gpu}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
