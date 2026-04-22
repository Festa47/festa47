return (
  <div
    style={{
      minHeight: "100vh",
      background: "#fff7fb",
      padding: 20,
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ fontSize: 36 }}>Festa Vendors 🎉</h1>

      {/* FORM */}
      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: 24,
        }}
      >
        {["name", "category", "location", "price", "description"].map((field) => (
          <input
            key={field}
            placeholder={field}
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        ))}

        <button
          onClick={addVendor}
          style={{
            width: "100%",
            padding: 12,
            background: "#111827",
            color: "#fff",
            borderRadius: 12,
            border: "none",
            fontWeight: "bold",
          }}
        >
          Add Vendor
        </button>
      </div>

      {/* LIST */}
      {vendors.map((v) => (
        <div
          key={v.id}
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2>{v.name}</h2>
          <p style={{ color: "#db2777", fontWeight: "bold" }}>
            {v.category}
          </p>
          <p>📍 {v.location}</p>
          <p style={{ fontWeight: "bold" }}>${v.price}</p>
          <p>{v.description}</p>
        </div>
      ))}
    </div>
  </div>
);