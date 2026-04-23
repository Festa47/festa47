"use client";

import { useEffect, useState } from "react";
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

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    customer_name: "",
    customer_email: "",
    event_date: "",
    notes: "",
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
      alert("Vendor added!");
    }
  }

  async function deleteVendor(id) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { error } = await supabase.from("vendors").delete().eq("id", id);

    if (!error) {
      loadVendors();
      alert("Vendor deleted!");
    }
  }

  async function requestBooking() {
    const supabase = getSupabaseClient();
    if (!supabase || !selectedVendor) return;

    const { error } = await supabase.from("bookings").insert([
      {
        vendor_name: selectedVendor.name,
        customer_name: bookingForm.customer_name,
        customer_email: bookingForm.customer_email,
        event_date: bookingForm.event_date,
        notes: bookingForm.notes,
      },
    ]);

    if (!error) {
      alert("Booking request sent!");
      setBookingForm({
        customer_name: "",
        customer_email: "",
        event_date: "",
        notes: "",
      });
      setSelectedVendor(null);
    }
  }

  const categories = [
    "All",
    ...Array.from(new Set(vendors.map((v) => v.category).filter(Boolean))),
  ];

  const filteredVendors = vendors.filter((v) => {
    const matchesCategory =
      selectedCategory === "All" || v.category === selectedCategory;

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (v.name || "").toLowerCase().includes(q) ||
      (v.category || "").toLowerCase().includes(q) ||
      (v.location || "").toLowerCase().includes(q) ||
      (v.description || "").toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Festa Vendors 🎉</h1>

      {/* SEARCH */}
      <input
        placeholder="Search vendors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY FILTER */}
      <div style={{ marginTop: 10 }}>
        {categories.map((c) => (
          <button key={c} onClick={() => setSelectedCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* ADD VENDOR */}
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

      {/* VENDORS LIST */}
      <div style={{ marginTop: 20 }}>
        {filteredVendors.map((v) => (
          <div key={v.id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <h3>{v.name}</h3>
            <p>{v.category}</p>
            <p>{v.location}</p>
            <p>${v.price}</p>
            <p>{v.description}</p>

            <button
              onClick={() => {
                if (
                  confirm("Are you sure you want to delete this vendor?")
                ) {
                  deleteVendor(v.id);
                }
              }}
            >
              Delete
            </button>

            <button onClick={() => setSelectedVendor(v)}>
              Request Booking
            </button>
          </div>
        ))}
      </div>

      {/* BOOKING FORM */}
      {selectedVendor && (
        <div style={{ marginTop: 20, border: "1px solid black", padding: 10 }}>
          <h2>Book {selectedVendor.name}</h2>

          <input
            placeholder="Your Name"
            value={bookingForm.customer_name}
            onChange={(e) =>
              setBookingForm({
                ...bookingForm,
                customer_name: e.target.value,
              })
            }
          />
          <input
            placeholder="Your Email"
            value={bookingForm.customer_email}
            onChange={(e) =>
              setBookingForm({
                ...bookingForm,
                customer_email: e.target.value,
              })
            }
          />
          <input
            placeholder="Event Date"
            value={bookingForm.event_date}
            onChange={(e) =>
              setBookingForm({
                ...bookingForm,
                event_date: e.target.value,
              })
            }
          />
          <input
            placeholder="Notes"
            value={bookingForm.notes}
            onChange={(e) =>
              setBookingForm({
                ...bookingForm,
                notes: e.target.value,
              })
            }
          />

          <button onClick={requestBooking}>Submit Booking</button>
        </div>
      )}
    </div>
  );
}