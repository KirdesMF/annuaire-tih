import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_admin/admin/dashboard"!</div>
}
