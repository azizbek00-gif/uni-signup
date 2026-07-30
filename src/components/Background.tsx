export default function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background:
          "linear-gradient(135deg,#312E81 0%,#4F46E5 42%,#7C3AED 78%,#3730A3 100%)",
        backgroundSize: "220% 220%",
        animation: "uv-grad 16s ease infinite",
      }}
    >
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(70px)",
          opacity: 0.5,
          width: 420,
          height: 420,
          background: "#818CF8",
          top: "-8%",
          left: "-6%",
          animation: "uv-float1 14s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(70px)",
          opacity: 0.5,
          width: 380,
          height: 380,
          background: "#22D3EE",
          bottom: "-10%",
          right: "-4%",
          animation: "uv-float2 18s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          filter: "blur(70px)",
          opacity: 0.5,
          width: 300,
          height: 300,
          background: "#F0ABFC",
          top: "40%",
          right: "30%",
          animation: "uv-float1 20s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
    </div>
  );
}
