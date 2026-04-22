"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);
  const [message, setMessage] = useState("Loading vendors...");

  useEffect(() => {
    async function loadVendors() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setMessage("Supabase client missing.");
        console.error("Supabase client missing");
        return;
      }

      const { data, error } = await supabase.from("vendors").select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) {
        setMessage(`Supabase error: ${error.message}`);
        return;
      }

      setVendors(data || []);
      setMessage(data && data.length > 0 ? "" : "No vendors found yet.");
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