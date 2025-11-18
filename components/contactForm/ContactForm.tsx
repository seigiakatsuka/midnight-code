"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import styles from "./ContactForm.module.css";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | string,
    fieldName?: string
  ) => {
    if (typeof e === "string" && fieldName) {
      setFormData((prev) => ({ ...prev, [fieldName]: e }));
    } else if (typeof e !== "string") {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
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
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldGroup>
          <FieldLegend>Contact Form</FieldLegend>
          <FieldDescription>
            Please fill out all required fields.
          </FieldDescription>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="First, Last"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="youremail@email.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Quick project summary."
              rows={5}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="website">Website (optional)</FieldLabel>
            <Input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="budget">
              Do you have a budget (optional)
            </FieldLabel>
            <Select
              name="budget"
              value={formData.budget}
              onValueChange={(value) => handleChange(value, "budget")}
              defaultValue=""
            >
              <SelectTrigger id="budget">
                <SelectValue placeholder="Select your budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-1000">Under $1000</SelectItem>
                <SelectItem value="1000-2000">$1000-$2000</SelectItem>
                <SelectItem value="2000-3000">$2000-$3000</SelectItem>
                <SelectItem value="No budget">No budget</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              We will verify this during our first meeting.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="deadline">
              Do you have a deadline (optional)
            </FieldLabel>
            <Select
              name="deadline"
              value={formData.deadline}
              onValueChange={(value) => handleChange(value, "deadline")}
              defaultValue=""
            >
              <SelectTrigger id="deadline">
                <SelectValue placeholder="Select your deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                <SelectItem value="3-4 weeks">3-4 weeks</SelectItem>
                <SelectItem value="1-2 months">1-2 months</SelectItem>
                <SelectItem value="No deadline">No deadline</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              We will verify this during our first meeting.
            </FieldDescription>
          </Field>
        </FieldGroup>
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
    </div>
  );
}
