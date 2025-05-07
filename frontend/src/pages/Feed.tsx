
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ContentCard from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContentItem } from "@/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { LinkedinIcon, Search } from "lucide-react";

// Mock data for LinkedIn feed content
const mockLinkedInContent: ContentItem[] = [
  {
    id: "1",
    title: "The Future of AI in Education",
    description: "Artificial Intelligence is revolutionizing how we learn. Discover the latest trends and how they impact educational content delivery and personalization.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: "Dr. Emily Chen",
    publishedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    saves: 145,
    shares: 89,
    reports: 2
  },
  {
    id: "2",
    title: "Effective Networking Strategies for Career Growth",
    description: "Building a strong professional network is essential for career advancement. Learn proven strategies to expand your connections and leverage them for growth.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    author: "Michael Johnson",
    publishedAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    saves: 98,
    shares: 54,
    reports: 1
  },
  {
    id: "3",
    title: "Digital Transformation: What Leaders Need to Know",
    description: "In today's rapidly changing business environment, digital transformation is essential for remaining competitive. This article outlines key considerations for business leaders navigating this transition.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: "Sarah Williams",
    publishedAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
    saves: 210,
    shares: 145,
    reports: 0
  },
  {
    id: "4",
    title: "The Power of Continuous Learning for Professional Development",
    description: "In today's rapidly evolving work environment, continuous learning has become essential for career advancement. This article explores effective strategies for lifelong learning and their impact on professional growth.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    author: "Robert Anderson",
    publishedAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
    saves: 76,
    shares: 38,
    reports: 1
  },
  {
    id: "5",
    title: "Building Resilient Teams in a Remote Work Environment",
    description: "Remote work presents unique challenges for team cohesion and resilience. Discover proven strategies to foster connection, communication, and collaboration among distributed teams.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: "Jennifer Lopez",
    publishedAt: new Date(Date.now() - 86400000 * 6), // 6 days ago
    saves: 124,
    shares: 67,
    reports: 3
  },
  {
    id: "6",
    title: "Data-Driven Decision Making: A Guide for Modern Leaders",
    description: "Learn how successful organizations are leveraging data analytics to make informed decisions and drive business growth. This practical guide offers insights into implementing data-driven strategies across departments.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    author: "David Chen",
    publishedAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
    saves: 155,
    shares: 92,
    reports: 1
  }
];

const Feed = () => {
  const [feedItems, setFeedItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setFeedItems(mockLinkedInContent);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handlers for content interaction
  const handleSaveContent = (contentId: string) => {
    // In a real app, make an API call to save content
    setFeedItems(prevItems => 
      prevItems.map(item => 
        item.id === contentId 
          ? { ...item, saves: item.saves + 1 } 
          : item
      )
    );
    
    toast({
      title: "Content saved",
      description: "The content has been saved to your profile"
    });
  };

  const handleShareContent = (contentId: string) => {
    // In a real app, make an API call to share content
    setFeedItems(prevItems => 
      prevItems.map(item => 
        item.id === contentId 
          ? { ...item, shares: item.shares + 1 } 
          : item
      )
    );
    
    // Simulate share dialog
    window.prompt("Share this link:", `https://example.com/content/${contentId}`);
    
    toast({
      title: "Content shared",
      description: "Thank you for sharing this content"
    });
  };

  const handleReportContent = (contentId: string, reason: string) => {
    // In a real app, make an API call to report content
    setFeedItems(prevItems => 
      prevItems.map(item => 
        item.id === contentId 
          ? { ...item, reports: item.reports + 1 } 
          : item
      )
    );
    
    toast({
      title: "Content reported",
      description: "Thank you for helping us maintain quality content"
    });
  };

  // Filter and sort content
  const getFilteredAndSortedContent = () => {
    let filtered = feedItems;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.author?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "recent":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case "popular":
          return (b.saves + b.shares) - (a.saves + a.shares);
        default:
          return 0;
      }
    });
  };

  const filteredContent = getFilteredAndSortedContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        {/* Feed header */}
        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold text-gray-900">LinkedIn Learning Feed</h1>
          <p className="text-gray-600 mt-2">
            Discover and engage with curated educational content from LinkedIn
          </p>
        </div>
        
        {/* Feed controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-auto flex-1">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* LinkedIn source indicator */}
        <div className="bg-linkedin-light border border-linkedin-blue/20 rounded-lg p-4 mb-6 flex items-center">
          <LinkedinIcon className="h-6 w-6 text-linkedin-blue mr-3" />
          <div>
            <h3 className="font-semibold text-gray-900">LinkedIn Content Feed</h3>
            <p className="text-sm text-gray-600">
              Content is aggregated from LinkedIn's professional learning resources
            </p>
          </div>
        </div>
        
        {/* Feed content */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedin-blue mb-4"></div>
              <p className="text-gray-500">Loading content from LinkedIn...</p>
            </div>
          ) : filteredContent.length > 0 ? (
            // Content cards
            filteredContent.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onSave={handleSaveContent}
                onShare={handleShareContent}
                onReport={handleReportContent}
              />
            ))
          ) : (
            // No results
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No content found matching your search.</p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Feed;
