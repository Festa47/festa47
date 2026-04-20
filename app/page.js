"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Page() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("vendors").select("*");
      setVendors(data || []);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Festa Vendors</h1>
      {vendors.map(v => (
        <div key={v.id}>
          <h2>{v.name}</h2>
          <p>{v.category}</p>
          <p>{v.price}</p>
        </div>
      ))}
    </div>
  );
}