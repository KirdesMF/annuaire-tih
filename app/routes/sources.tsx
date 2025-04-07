import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sources')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sources"!</div>
}
