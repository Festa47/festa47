"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);
  const [message, setMessage] = useState("Loading vendors...");

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();

      if (!supabase) {
        setMessage("Supabase environment variables are missing.");
        return;
      }

      const { data, error } = await supabase.from("vendors").select("*");

      if (error) {
        console.error(error);
        setMessage("Could not load vendors.");
        return;
      }

      setVendors(data || []);
      if (!data || data.length === 0) {
        setMessage("No vendors found yet.");
      } else {
        setMessage("");
      }
    }

    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Festa Vendors</h1>

      {message && <p>{message}</p>}

      {vendors.map((v) => (
        <div key={v.id}>
          <h2>{v.name}</h2>
          <p>{v.category}</p>
          <p>{v.price}</p>
        </div>
      ))}
    </div>
  );
}