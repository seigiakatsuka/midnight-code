"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import styles from "./ContactForm.module.css";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
  website: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
});

type FormData = {
  name: string;
  email: string;
  message: string;
  website: string;
  budget: string;
  deadline: string;
};

type StatusType = "idle" | "loading" | "success" | "error";

type Status = {
  type: StatusType;
  message: string;
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    website: "",
    budget: "",
    deadline: "",
  });

  const [status, setStatus] = useState<Status>({
    type: "idle",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Sending..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      type ApiResponse = { error?: string; hint?: string };
      const resultUnknown: unknown = await response.json().catch(() => ({}));
      const result: ApiResponse =
        resultUnknown && typeof resultUnknown === "object"
          ? (resultUnknown as ApiResponse)
          : {};

      if (response.ok) {
        setStatus({ type: "success", message: "Message sent successfully!" });
        setFormData({
          name: "",
          email: "",
          message: "",
          website: "",
          budget: "",
          deadline: "",
        });
      } else {
        setStatus({
          type: "error",
          message: result?.error || result?.hint || "Failed to send message.",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input placeholder="Name" />
      </div>
      <Button type="submit" disabled={status.type === "loading"}>
        {status.type === "loading" ? "Sending..." : "Send Message"}
      </Button>
      {status.type === "success" && (
        <p className="text-green-600">{status.message}</p>
      )}
      {status.type === "error" && (
        <p className="text-red-600">{status.message}</p>
      )}
    </form>
  );
}
