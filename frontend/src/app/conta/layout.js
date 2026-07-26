import StorefrontLayout from "../(storefront)/layout";
import { AccountAuthGuard } from "./AccountAuthGuard";

export const dynamic = "force-dynamic";

export default function AccountLayout({ children }) {
  return <StorefrontLayout>
    <AccountAuthGuard>{children}</AccountAuthGuard>
  </StorefrontLayout>;
}
