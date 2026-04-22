"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [form, setForm] = useState({
    name: "",
    category: "",
    location: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data, error } = await supabase.from("vendors").select("*");
    if (!error) setVendors(data || []);
  }

  async function addVendor() {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.from("vendors").insert([
      {
        name: form.name,
        category: form.category,
        location: form.location,
        price: Number(form.price),
        description: form.description,
      },
    ]);

    if (!error) {
      setForm({
        name: "",
        category: "",
        location: "",
        price: "",
        description: "",
      });
      loadVendors();
    }
  }

  const filteredVendors = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vendors;

    return vendors.filter((v) => {
      const name = String(v.name || "").toLowerCase();
      const category = String(v.category || "").toLowerCase();
      const location = String(v.location || "").toLowerCase();
      const description = String(v.description || "").toLowerCase();
const categories = [
  "All",
  ...Array.from(new Set(vendors.map((v) => v.category))),
];
      return (
        name.includes(q) ||
        category.includes(q) ||
        location.includes(q) ||
        description.includes(q)
      );
    });
  }, [vendors, search]);

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
        <h1 style={{ fontSize: 36, marginBottom: 8, color: "#111827" }}>
          Festa Vendors 🎉
        </h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>
          Discover vendors for your next event
        </p>

        <div
          style={{
            background: "#ffffff",
            padding: 16,
            borderRadius: 16,
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            marginBottom: 16,
          }}
        >
          <input
            placeholder="Search vendors, category, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
        </div>
<div
  style={{
    display: "flex",
    gap: 8,
    overflowX: "auto",
    marginBottom: 16,
    paddingBottom: 4,
  }}
>
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => setSelectedCategory(category)}
      style={{
        whiteSpace: "nowrap",
        padding: "10px 14px",
        borderRadius: 999,
        border: selectedCategory === category ? "none" : "1px solid #e5e7eb",
        background: selectedCategory === category ? "#111827" : "#ffffff",
        color: selectedCategory === category ? "#ffffff" : "#374151",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      {category}
    </button>
  ))}
</div>
        <div
          style={{
            background: "#ffffff",
            padding: 16,
            borderRadius: 16,
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            marginBottom: 24,
            display: "grid",
            gap: 10,
          }}
        >
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={inputStyle}
          />

          <button onClick={addVendor} style={buttonStyle}>
            Add Vendor
          </button>
        </div>

        {filteredVendors.length === 0 ? (
          <p>No matching vendors found.</p>
        ) : (
          filteredVendors.filter((v) =>
    selectedCategory === "All" ? true : v.category === selectedCategory
  )
  .map((v) => (
            <div
              key={v.id}
              style={{
                background: "#ffffff",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                border: "1px solid #f3d6e6",
              }}
            >
              <h2 style={{ margin: "0 0 8px", color: "#111827" }}>{v.name}</h2>
              <p style={{ margin: "0 0 8px", color: "#db2777", fontWeight: "bold" }}>
                {v.category}
              </p>
              <p style={{ margin: "0 0 8px", color: "#4b5563" }}>📍 {v.location}</p>
              <p style={{ margin: "0 0 8px", color: "#111827", fontWeight: "bold" }}>
                ${v.price}
              </p>
              <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.5 }}>
                {v.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: 12,
  background: "#111827",
  color: "#ffffff",
  borderRadius: 12,
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};