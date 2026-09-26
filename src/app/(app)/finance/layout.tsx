import { FinanceFrame } from "@/components/finance/frame";

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return <FinanceFrame>{children}</FinanceFrame>;
}
