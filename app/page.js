"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    async function loadVendors() {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("vendors")
        .select("*");

      if (!error) {
        setVendors(data || []);
      }
    }

    loadVendors();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Festa Vendors 🎉</h1>

      {vendors.length === 0 ? (
        <p>No vendors found yet.</p>
      ) : (
        vendors.map((v) => (
          <div key={v.id} style={{ marginBottom: 12 }}>
            <h2>{v.name}</h2>
            <p>{v.category}</p>
            <p>{v.location}</p>
            <p>${v.price}</p>
            <p>{v.description}</p>
          </div>
        ))
      )}
    </div>
  );
}