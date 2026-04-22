"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);
  const [message, setMessage] = useState("Loading vendors...");

  useEffect(() => {
    async function loadVendors() {
      try {
        const supabase = getSupabaseClient();

        if (!supabase) {
          setMessage("Supabase client missing.");
          return;
        }

        const { data, error } = await supabase.from("vendors").select("*");

        if (error) {
          console.error("Supabase error:", error);
          setMessage(`Supabase error: ${error.message}`);
          return;
        }

        console.log("Vendors data:", data);
        setVendors(data || []);
        setMessage(data && data.length > 0 ? "" : "No vendors found yet.");
      } catch (err) {
        console.error("Unexpected error:", err);
        setMessage(`Unexpected error: ${err.message}`);
      }
    }

    loadVendors();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Festa Vendors 🎉</h1>

      {message && <p>{message}</p>}

      {vendors.map((v) => (
        <div key={v.id} style={{ marginBottom: 12 }}>
          <h2>{v.name}</h2>
          <p>{v.category}</p>
          <p>{v.location}</p>
          <p>{v.price}</p>
          <p>{v.description}</p>
        </div>
      ))}
    </div>
  );
}