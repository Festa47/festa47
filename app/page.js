"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);

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

    const { data } = await supabase.from("vendors").select("*");
    setVendors(data || []);
  }

  async function addVendor() {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.from("vendors").insert([
      {
        ...form,
        price: Number(form.price),
      },
    ]);

    setForm({
      name: "",
      category: "",
      location: "",
      price: "",
      description: "",
    });

    loadVendors();
  }

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>Festa Vendors 🎉</h1>

      {/* FORM */}
      <div style={{ marginBottom: 30 }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <button onClick={addVendor}>Add Vendor</button>
      </div>

      {/* LIST */}
      {vendors.map((v) => (
        <div key={v.id} style={{ marginBottom: 12 }}>
          <h2>{v.name}</h2>
          <p>{v.category}</p>
        </div>
      ))}
    </div>
  );
}