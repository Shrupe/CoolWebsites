"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Moon, Sun, ExternalLink, ImageIcon } from "lucide-react"
import { useTheme } from "next-themes"

interface Website {
  id: string
  name: string
  description: string
  url: string
  tags: string[]
  screenshot_url?: string  
  created_at: string      
  featured?: boolean       
}

function WebsiteCard({ website }: { website: Website }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <a
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                {website.name}
                <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </CardTitle>
            {website.featured && (
              <Badge
                variant="secondary"
                className="mt-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
              >
                Featured
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {website.screenshot_url && (
            <img
                src={website.screenshot_url || "/placeholder.svg"}
                alt={`${website.name} screenshot`}
                loading="lazy"
                decoding="async"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                width={300}
                height={200}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
            />
            )}

        <CardDescription className="text-sm leading-relaxed">{website.description}</CardDescription>
        <div className="flex flex-wrap gap-2">
          {website.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CoolWebsitesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredWebsites, setFilteredWebsites] = useState<Website[]>([]);

    useEffect(() => {
      const fetchWebsites = async () => {
        const res = await fetch("http://localhost:8000/api/v1/websites?limit=100");
        const json = await res.json();
        setFilteredWebsites(json.items);
      };
      fetchWebsites();
    }, []);


function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

    const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const res = await fetch("http://localhost:8000/api/v1/websites/search", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
    });

    if (!res.ok) {
        console.error("Search failed");
        return;
    }

    const results: Website[] = await res.json();
        setFilteredWebsites(results);
    };


    const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        handleSearch()
    }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 transition-colors">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CW</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CoolWebsites
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Amazing{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Websites</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect tools, resources, and inspiration for your next project
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for websites... (e.g., 'best note-taking apps')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 shadow-sm"
                />
              </div>
              <Button
                onClick={handleSearch}
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {searchQuery ? `Results for "${searchQuery}"` : "Featured Websites"}
            </h3>
            <span className="text-gray-500 dark:text-gray-400">
              {filteredWebsites.length} website{filteredWebsites.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredWebsites.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No websites found</h4>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search terms or browse our featured websites
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWebsites.map((website) => (
                <WebsiteCard key={website.id} website={website} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200 dark:border-gray-800 mt-16">
          <p className="text-gray-500 dark:text-gray-400">
            Discover more amazing websites every day with{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CoolWebsites
            </span>
          </p>
        </footer>
      </main>
    </div>
  )
}
