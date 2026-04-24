// src/lib/api.ts
import { supabase } from "@/components/supabaseClient";

export async function extractDocument(file: File): Promise<{ markdown: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const { data, error } = await supabase.functions.invoke("extract_passport", {
    body: formData,
  });

  if (error) throw new Error(error.message);
  return { markdown: data.markdown };
}