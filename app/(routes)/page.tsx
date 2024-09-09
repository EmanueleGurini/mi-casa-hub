import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user:", user);

  if (!user) {
    revalidatePath("/", "layout");
    redirect("/login");
  }

  return <main>Hello, MICASA</main>;
}
