// ===========================================
// CYBER.DEV Portfolio — Zod Validation Schemas
// ===========================================

import { z } from "zod";

// Contact Form
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim(),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang")
    .trim()
    .toLowerCase(),
  message: z
    .string()
    .min(10, "Pesan minimal 10 karakter")
    .max(2000, "Pesan maksimal 2000 karakter")
    .trim(),
});

// Login Form
export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid").trim().toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

// Experience Form
export const experienceSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(255, "Judul maksimal 255 karakter")
    .trim(),
  companyOrEvent: z
    .string()
    .min(2, "Nama perusahaan/event minimal 2 karakter")
    .max(255)
    .trim(),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(["WORK", "COMPETITION", "ACHIEVEMENT"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD")
    .optional()
    .nullable(),
});

// Certificate Form
export const certificateSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(255, "Judul maksimal 255 karakter")
    .trim(),
  issuer: z
    .string()
    .min(2, "Penerbit minimal 2 karakter")
    .max(255)
    .trim(),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD"),
  credentialUrl: z.string().url("URL tidak valid").optional().nullable().or(z.literal("")),
  imageUrl: z.string().optional().nullable(),
});

// Project / Write-up Form
export const contentSchema = z.object({
  type: z.enum(["PROJECT", "WRITEUP"]),
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(255, "Judul maksimal 255 karakter")
    .trim(),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung")
    .trim(),
  summary: z.string().max(500, "Ringkasan maksimal 500 karakter").optional().nullable(),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  thumbnailUrl: z.string().optional().nullable(),
  githubSyncUrl: z.string().url("URL tidak valid").optional().nullable().or(z.literal("")),
  featured: z.boolean().default(false),
  technologies: z.array(z.string()).default([]), // Array of tech names
});

// Technology Form
export const technologySchema = z.object({
  name: z
    .string()
    .min(1, "Nama teknologi wajib diisi")
    .max(100)
    .trim(),
  iconUrl: z.string().url().optional().nullable().or(z.literal("")),
  category: z.enum(["RED_TEAM", "WEB_DEV", "AI_DATA", "DEVOPS", "LANGUAGE", "OTHER"]),
});

// Type exports for form usage
export type ContactInput = z.infer<typeof contactSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type ContentInput = z.infer<typeof contentSchema>;
export type TechnologyInput = z.infer<typeof technologySchema>;
