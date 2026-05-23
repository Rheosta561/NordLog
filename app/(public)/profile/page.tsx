import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Profile",
  description: `About ${siteConfig.author.name}`,
};

export default function ProfilePage() {
  return <ProfileClient />;
}
