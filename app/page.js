"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
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

    if (error) {
      console.error(error);
      return;
    }

    setVendors(data || []);
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

  async function deleteVendor(id) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.from("vendors").delete().eq("id", id);

    if (!error) {
      loadVendors();
    }
  }

  const filtered = vendors.filter((v) =>
    `${v.name} ${v.category} ${v.location} ${v.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32 }}>Festa Vendors 🎉</h1>
      <p>{vendors.length} vendors loaded</p>

      <input
        placeholder="Search vendors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginTop: 20, display: "grid", gap: 8 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button
          onClick={addVendor}
          style={{
            padding: 12,
            background: "#111827",
            color: "white",
            borderRadius: 10,
            border: "none",
            fontWeight: "bold",
          }}
        >
          Add Vendor
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        {filtered.map((v) => (
          <div
            key={v.id}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ margin: 0 }}>{v.name}</h3>
            <p style={{ color: "#e11d48", fontWeight: "bold" }}>
              {v.category}
            </p>
            <p>{v.location}</p>
            <p style={{ fontWeight: "bold" }}>${v.price}</p>
            <p>{v.description}</p>

            <button
              onClick={() => deleteVendor(v.id)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: 10,
                background: "#dc2626",
                color: "white",
                borderRadius: 8,
                border: "none",
                fontWeight: "bold",
              }}
            >
              Delete Vendor
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}