import { redirect } from "next/navigation";
import { ClaimFormWizard } from "@/components/claim-form/ClaimFormWizard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ClaimFormPage() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login?next=/claim-form");
    }
  } catch {
    redirect("/login?next=/claim-form");
  }

  return <ClaimFormWizard />;
}
