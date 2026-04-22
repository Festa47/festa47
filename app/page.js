"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabase";

export default function Page() {
  const [message, setMessage] = useState("Loading vendors...");

  useEffect(() => {
    async function run() {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          setMessage("Supabase client missing");
          return;
        }

        const { data, error } = await supabase.from("vendors").select("*");
        if (error) {
          setMessage(`Supabase error: ${error.message}`);
          return;
        }

        setMessage(`Loaded ${data?.length || 0} vendors`);
      } catch (err) {
        setMessage(`Unexpected error: ${err.message}`);
      }
    }

    run();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Festa Vendors 🎉</h1>
      <p>{message}</p>
    </div>
  );
}