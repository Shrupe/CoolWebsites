import { useState} from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
//import.meta.env.VITE_API_UR

type Website = {
  id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
  screenshot_url?: string;
  created_at: string;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Website[]>([]);
  const [loading, setLoading] = useState(false);

  const searchWebsites = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:8000/api/v1/websites/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!res.ok) {
      const errorText = await res.text(); //for debugging
      throw new Error(`Request failed: ${res.status} ${errorText}`);
    }

    const data = await res.json(); 
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Cool Websites Search</h1>
      <div className="flex gap-4 mb-8">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you're looking for..."
        />
        <Button onClick={searchWebsites}>Search</Button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-36" />)
        ) : (
          results.map((site) => (
            <Card key={site.id}>
              <CardContent className="p-4">
                <a
                  href={site.url}
                  className="text-xl font-semibold hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.name}
                </a>
                <p className="text-gray-600 mt-1">{site.description}</p>
                <div className="text-sm text-gray-400 mt-2">
                  Tags: {site.tags.join(', ')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
