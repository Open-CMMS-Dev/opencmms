import Link from "next/link"
import { notFound } from "next/navigation"
import { moduleRegistry } from "@/core/modules/registry"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ModulesPageProps {
  params: { module?: string[] | string }
  searchParams?: Record<string, string | string[] | undefined>
}

function buildSlug(value: string[] | string | undefined): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  return [value]
}

export default async function ModulesCatchAllPage({ params, searchParams }: ModulesPageProps) {
  const slug = buildSlug(params.module)

  if (slug.length === 0) {
    const modules = moduleRegistry
      .getAllModules()
      .filter((module) => module.id !== "core")

    return (
      <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle>{module.name}</CardTitle>
              <CardDescription>
                {module.description || "Module description coming soon"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                className="text-sm font-medium text-primary hover:underline"
                href={`/modules/${module.id}`}
              >
                Open module →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const [moduleId, ...pageSlug] = slug
  const resolved = moduleRegistry.resolveModulePage(moduleId, pageSlug)

  if (!resolved) {
    notFound()
  }

  const PageComponent = resolved.page.component

  return (
    <PageComponent params={resolved.params} searchParams={searchParams} />
  )
}
