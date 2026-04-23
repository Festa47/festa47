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

  async function deleteVendor(id) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.from("vendors").delete().eq("id", id);
    loadVendors();
  }

  const filtered = vendors.filter((v) =>
    (v.name + v.category + v.location)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Festa Vendors 🎉</h1>

      {/* SEARCH */}
      <input
        placeholder="Search vendors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ADD FORM */}
      <div style={{ marginTop: 20 }}>
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
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button onClick={addVendor}>Add Vendor</button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {filtered.map((v) => (
          <div key={v.id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h3>{v.name}</h3>
            <p>{v.category}</p>
            <p>{v.location}</p>
            <p>${v.price}</p>
            <p>{v.description}</p>

            <button onClick={() => deleteVendor(v.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}