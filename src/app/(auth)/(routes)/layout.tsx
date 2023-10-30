import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

type RootLayoutProps = {
  children: string;
};
export default async function AuthLayout({ children }: RootLayoutProps) {
  const session = await getServerSession();
  if (session && session.user) redirect("/");
  return <>{children}</>;
}
