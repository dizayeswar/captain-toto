import { getCurrentProfile } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default async function AppSidebar() {
  const profile = await getCurrentProfile();
  return <Sidebar profile={profile} />;
}
