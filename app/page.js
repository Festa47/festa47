"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    async function loadVendors() {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data, error } = await supabase.from("vendors").select("*");

      if (!error) {
        setVendors(data || []);
      }
    }

    loadVendors();
  }, []);

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
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>Festa Vendors 🎉</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Discover vendors for your next event
        </p>

        {vendors.length === 0 ? (
          <p>No vendors found yet.</p>
        ) : (
          vendors.map((v) => (
            <div
              key={v.id}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 20,
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                border: "1px solid #f3d6e6",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24 }}>{v.name}</h2>
              <p style={{ margin: "8px 0", color: "#db2777", fontWeight: "bold" }}>
                {v.category}
              </p>
              <p style={{ margin: "6px 0", color: "#555" }}>📍 {v.location}</p>
              <p style={{ margin: "6px 0", color: "#111", fontWeight: "bold" }}>
                ${v.price}
              </p>
              <p style={{ marginTop: 10, color: "#444", lineHeight: 1.5 }}>
                {v.description}
              </p>
              <button
                style={{
                  marginTop: 14,
                  background: "#111827",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Request Booking
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}