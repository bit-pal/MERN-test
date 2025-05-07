
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, Calendar, Flag, MessageSquare, Save, Share, Linkedin, TrendingUp } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import { ContentItem } from "@/types";

// Mock data for featured content
const featuredContent: ContentItem[] = [
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
  }
];

const Dashboard = () => {
  const { user, addCredits } = useAuth();
  const [stats, setStats] = useState({
    contentViewed: 0,
    contentSaved: 0,
    contentShared: 0,
    creditsEarned: 0
  });

  // Mock data fetch on component mount
  useEffect(() => {
    // In a real app, fetch these stats from an API
    setStats({
      contentViewed: 12,
      contentSaved: 5,
      contentShared: 3,
      creditsEarned: user?.credits || 0
    });
  }, [user]);

  // Mock handlers for content interaction
  const handleSaveContent = (contentId: string) => {
    console.log(`Content saved: ${contentId}`);
    // In a real app, make an API call to save the content
  };

  const handleShareContent = (contentId: string) => {
    console.log(`Content shared: ${contentId}`);
    // In a real app, make an API call to record the share
  };

  const handleReportContent = (contentId: string, reason: string) => {
    console.log(`Content reported: ${contentId}, Reason: ${reason}`);
    // In a real app, make an API call to report the content
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        {/* Welcome section */}
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 mt-2">Track your learning progress and discover new content</p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Content Viewed</p>
                <p className="text-2xl font-bold mt-1">{stats.contentViewed}</p>
              </div>
              <BookOpen className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Content Saved</p>
                <p className="text-2xl font-bold mt-1">{stats.contentSaved}</p>
              </div>
              <Save className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Content Shared</p>
                <p className="text-2xl font-bold mt-1">{stats.contentShared}</p>
              </div>
              <Share className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Credits Earned</p>
                <p className="text-2xl font-bold mt-1">{stats.creditsEarned}</p>
              </div>
              <Award className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
        </div>
        
        {/* Credit system explainer */}
        <Card className="mb-8 bg-gradient-to-r from-linkedin-blue to-linkedin-lightBlue text-white">
          <CardHeader>
            <CardTitle>LearnHub Credit System</CardTitle>
            <CardDescription className="text-white text-opacity-80">
              Earn and spend credits as you engage with content
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">View Content</h3>
              </div>
              <p className="text-sm text-white text-opacity-80">
                Earn 1 credit every time you view educational content
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Save className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Save Content</h3>
              </div>
              <p className="text-sm text-white text-opacity-80">
                Earn 2 credits when you save content for later
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Share className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Share Content</h3>
              </div>
              <p className="text-sm text-white text-opacity-80">
                Earn 3 credits when you share content with others
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Featured content section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured Content</h2>
            <Button variant="outline" asChild>
              <Link to="/feed">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {featuredContent.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onSave={handleSaveContent}
                onShare={handleShareContent}
                onReport={handleReportContent}
              />
            ))}
          </div>
        </div>
        
        {/* Premium features section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <MessageSquare className="h-5 w-5 text-linkedin-blue mr-2" />
                  <CardTitle className="text-lg">Expert Discussions</CardTitle>
                </div>
                <CardDescription>
                  Join exclusive discussions with industry experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Get insights directly from professionals in your field
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-linkedin-blue mr-1" />
                    <span className="text-sm font-semibold">20 credits</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Unlock
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-linkedin-blue mr-2" />
                  <CardTitle className="text-lg">Webinar Access</CardTitle>
                </div>
                <CardDescription>
                  Attend live webinars on trending topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Get notified about upcoming live sessions from thought leaders
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-linkedin-blue mr-1" />
                    <span className="text-sm font-semibold">50 credits</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Unlock
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-linkedin-blue mr-2" />
                  <CardTitle className="text-lg">Industry Reports</CardTitle>
                </div>
                <CardDescription>
                  Access premium industry analysis and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Download in-depth reports on industry trends and forecasts
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-linkedin-blue mr-1" />
                    <span className="text-sm font-semibold">100 credits</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Unlock
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* LinkedIn integration promo */}
        <Card className="border-linkedin-blue">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Linkedin className="h-10 w-10 text-linkedin-blue mr-4" />
                <div>
                  <h3 className="text-xl font-bold">LinkedIn Integration</h3>
                  <p className="text-gray-600">Get personalized content from your professional network</p>
                </div>
              </div>
              <Button className="bg-linkedin-blue hover:bg-linkedin-lightBlue">
                Connect LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
