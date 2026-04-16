import {
  User, Mail, Phone, MapPin, Lock, FileText,
  Check, X, Calendar, AlertCircle, Briefcase, Save
} from 'lucide-react';
import { useAuth } from "./AuthPass";
import { useState, useEffect } from 'react';
import { supabase } from "../supabaseClient";

/* =========================
   🔁 MAPPERS
========================= */
function mapApplicantToProfile(data: any) {
  return {
    firstName: data.app_first_name || '',
    middleName: data.app_middle_name || '',
    lastName: data.app_last_name || '',
    email: data.app_email || '',
    phone: data.app_present_tele_mobile || '',
    country: data.app_present_address_country || '',
    province: data.app_present_address_province || '',
    city: data.app_present_address_city || '',
    birthDay: data.app_dob_day || '',
    birthMonth: data.app_dob_month || '',
    birthYear: data.app_dob_year || '',
    maritalStatus: data.app_marital_status || '',
    height: data.app_height || '',
    weight: data.app_weight || '',
    passportNumber: data.app_passport_number || '',
    passportPlace: data.app_passport_place || '',
    passportIssueDate: data.app_passport_issue_date || '',
    passportExpiryDate: data.app_passport_expiry_date || '',
    nationality: data.app_nationality || '',
    preferredJobFields: data.app_preference || [],
  };
}

function mapProfileToApplicant(profile: any) {
  return {
    app_first_name: profile.firstName,
    app_middle_name: profile.middleName,
    app_last_name: profile.lastName,
    app_email: profile.email,
    app_present_tele_mobile: profile.phone,
    app_present_address_country: profile.country,
    app_present_address_province: profile.province,
    app_present_address_city: profile.city,
    app_dob_day: profile.birthDay,
    app_dob_month: profile.birthMonth,
    app_dob_year: profile.birthYear,
    app_marital_status: profile.maritalStatus,
    app_height: profile.height,
    app_weight: profile.weight,
    app_passport_number: profile.passportNumber,
    app_passport_place: profile.passportPlace,
    app_passport_issue_date: profile.passportIssueDate,
    app_passport_expiry_date: profile.passportExpiryDate,
    app_nationality: profile.nationality,
    app_preference: profile.preferredJobFields,
  };
}

/* =========================
   🧩 COMPONENT
========================= */
export default function ProfileSettings() {
  const { account } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const jobCategories = [
    'Healthcare', 'Construction', 'Hospitality', 'Information Technology',
    'Education', 'Manufacturing', 'Retail & Sales', 'Transportation & Logistics',
    'Finance & Accounting', 'Food & Beverage', 'Customer Service',
    'Security & Safety', 'Engineering', 'Administrative & Clerical',
    'Agriculture', 'Real Estate',
  ];

  useEffect(() => {
    if (!account?.t_applicant) return;
    setProfile(mapApplicantToProfile(account.t_applicant));
  }, [account]);

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    const { error } = await supabase
      .from("t_applicant")
      .update(mapProfileToApplicant(profile))
      .eq("applicant_id", account.applicant_id);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("❌ Failed to save");
    } else {
      alert("✅ Profile updated!");
    }
  };

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold">Profile Settings</h1>
        <p className="text-gray-500">Manage your personal info</p>
      </div>

      {/* BASIC INFO */}
      <Section title="Basic Information" icon={<User />}>
        <Input label="First Name" value={profile.firstName} onChange={(v) => setProfile({ ...profile, firstName: v })}/>
        <Input label="Middle Name" value={profile.middleName} onChange={(v) => setProfile({ ...profile, middleName: v })}/>
        <Input label="Last Name" value={profile.lastName} onChange={(v) => setProfile({ ...profile, lastName: v })}/>
        <Input label="Email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })}/>
        <Input label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })}/>
      </Section>

      {/* ADDRESS */}
      <Section title="Address" icon={<MapPin />}>
        <Input label="Country" value={profile.country} onChange={(v) => setProfile({ ...profile, country: v })}/>
        <Input label="Province" value={profile.province} onChange={(v) => setProfile({ ...profile, province: v })}/>
        <Input label="City" value={profile.city} onChange={(v) => setProfile({ ...profile, city: v })}/>
      </Section>

      {/* JOB FIELDS */}
      <Section title="Preferred Job Fields" icon={<Briefcase />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {jobCategories.map((job) => (
            <label key={job} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={profile.preferredJobFields.includes(job)}
                onChange={() => {
                  const exists = profile.preferredJobFields.includes(job);
                  setProfile({
                    ...profile,
                    preferredJobFields: exists
                      ? profile.preferredJobFields.filter((j: string) => j !== job)
                      : [...profile.preferredJobFields, job]
                  });
                }}
              />
              {job}
            </label>
          ))}
        </div>
      </Section>

      {/* PASSPORT */}
      <Section title="Passport Information" icon={<FileText />}>
        <Input label="Passport Number" value={profile.passportNumber} onChange={(v) => setProfile({ ...profile, passportNumber: v })}/>
        <Input label="Place of Issue" value={profile.passportPlace} onChange={(v) => setProfile({ ...profile, passportPlace: v })}/>
        <DateInput label="Issue Date" value={profile.passportIssueDate} onChange={(v) => setProfile({ ...profile, passportIssueDate: v })}/>
        <DateInput label="Expiry Date" value={profile.passportExpiryDate} onChange={(v) => setProfile({ ...profile, passportExpiryDate: v })}/>
      </Section>

      {/* PASSWORD */}
      <Section title="Change Password" icon={<Lock />}>
        <Input label="Current Password" type="password" value={profile.currentPassword || ''} onChange={(v) => setProfile({ ...profile, currentPassword: v })}/>
        <Input label="New Password" type="password" value={profile.newPassword || ''} onChange={(v) => setProfile({ ...profile, newPassword: v })}/>
      </Section>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded flex items-center justify-center gap-2"
      >
        <Save size={18} />
        {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}

/* =========================
   🧩 SMALL REUSABLE UI
========================= */

function Section({ title, icon, children }: any) {
  return (
    <div className="bg-white p-5 rounded shadow">
      <div className="flex items-center gap-2 mb-4 font-semibold">
        {icon}
        {title}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}

function DateInput({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}
