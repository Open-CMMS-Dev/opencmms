import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Package, Wrench, Calendar, BarChart } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to OpenCMMS
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Open Source Computerized Maintenance Management System for modern organizations
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Asset Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track and manage your equipment, vehicles, and facility assets with ease.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create, assign, and track maintenance tasks and repair orders efficiently.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <CardTitle>Preventive Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Schedule and automate routine maintenance to prevent costly breakdowns.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <BarChart className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gain insights with comprehensive reporting and maintenance analytics.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of organizations already using OpenCMMS to streamline their maintenance operations.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/login">Start Your Free Trial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
            