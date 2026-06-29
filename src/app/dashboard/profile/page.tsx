import { requireProfile } from "@/lib/session";
import ProfileForm from "./profile-form";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const profile = await requireProfile();
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Your profile</h1>
      <p className="mt-1 text-slate-600">Update your contact details.</p>
      <ProfileForm
        fullName={profile.full_name}
        phone={profile.phone ?? ""}
        email={profile.email}
      />
    </div>
  );
}
