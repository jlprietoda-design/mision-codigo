import { AppNavbar } from '@/components/layout/AppNavbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNavbar />
      <div className="pt-16">{children}</div>
    </>
  )
}
