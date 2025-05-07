
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Book, Clock, Edit, Eye, Flag, MessageSquare, Save, Settings, Share, TrendingUp, User } from "lucide-react";
import { ContentItem, CreditTransaction } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Mock saved content
const savedContent: ContentItem[] = [
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
  }
];

// Mock credit transactions
const creditTransactions: CreditTransaction[] = [
  {
    id: "1",
    userId: "1",
    amount: 1,
    type: "earned",
    description: "Viewed content: The Future of AI in Education",
    timestamp: new Date(Date.now() - 86400000 * 1)
  },
  {
    id: "2",
    userId: "1",
    amount: 2,
    type: "earned",
    description: "Saved content: Digital Transformation: What Leaders Need to Know",
    timestamp: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: "3",
    userId: "1",
    amount: 3,
    type: "earned",
    description: "Shared content: Effective Networking Strategies",
    timestamp: new Date(Date.now() - 86400000 * 3)
  },
  {
    id: "4",
    userId: "1",
    amount: 20,
    type: "spent",
    description: "Unlocked premium feature: Expert Discussion",
    timestamp: new Date(Date.now() - 86400000 * 4)
  }
];

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Learning enthusiast passionate about professional development and staying current with industry trends.",
    jobTitle: "Software Engineer",
    company: "Tech Innovations Inc."
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, make an API call to update user profile
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated"
    });
    
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  <div className="h-24 w-24 bg-linkedin-blue rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">{user?.name}</h1>
                      <p className="text-gray-600">{profileData.jobTitle} at {profileData.company}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                  
                  {isEditingProfile ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={profileData.jobTitle}
                            onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            value={profileData.company}
                            onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows={3}
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" type="button" onClick={() => setIsEditingProfile(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <p className="text-gray-800">{profileData.bio}</p>
                      <div className="mt-4 flex items-center">
                        <Award className="h-5 w-5 text-linkedin-blue mr-2" />
                        <span className="font-semibold">{user?.credits || 0} Credits Available</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile content tabs */}
          <Tabs defaultValue="saved">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="saved">Saved Content</TabsTrigger>
              <TabsTrigger value="credits">Credit History</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>
            
            {/* Saved content tab */}
            <TabsContent value="saved" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Saved Content</h2>
                <span className="text-gray-500">{savedContent.length} items</span>
              </div>
              
              {savedContent.length > 0 ? (
                savedContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {content.imageUrl && (
                          <div className="w-full md:w-1/4">
                            <img 
                              src={content.imageUrl} 
                              alt={content.title} 
                              className="w-full h-40 md:h-full object-cover"
                            />
                          </div>
                        )}
                        <div className={`p-4 ${content.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                          <h3 className="text-lg font-semibold mb-2">{content.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{content.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span>{content.author}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" className="bg-linkedin-blue hover:bg-linkedin-lightBlue">
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share className="h-4 w-4 mr-1" /> Share
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                              <Flag className="h-4 w-4 mr-1" /> Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <Save className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-gray-700">No saved content yet</h3>
                  <p className="text-gray-500 mb-4">Save interesting content from the feed to access it later</p>
                  <Button asChild>
                    <a href="/feed">Browse Feed</a>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Credit history tab */}
            <TabsContent value="credits" className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Credit History</h2>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" /> View Analytics
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Credits Summary</CardTitle>
                  <CardDescription>
                    Track your credits earned and spent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Credits</p>
                      <p className="text-2xl font-bold flex items-center">
                        <Award className="h-5 w-5 text-linkedin-blue mr-2" />
                        {user?.credits || 0}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Earned</p>
                      <p className="text-2xl font-bold text-green-600">
                        +{creditTransactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Spent</p>
                      <p className="text-2xl font-bold text-red-600">
                        -{creditTransactions.filter(t => t.type === 'spent').reduce((sum, t) => sum + t.amount, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border-b last:border-0">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {transaction.type === 'earned' ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <Book className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(transaction.timestamp).toLocaleDateString()} at {new Date(transaction.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className={`font-bold ${transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Account settings tab */}
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    <CardTitle>Account Settings</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your account preferences and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notification Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="email-notifications" className="mr-2" defaultChecked />
                        <Label htmlFor="email-notifications">Email notifications</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="content-recommendations" className="mr-2" defaultChecked />
                        <Label htmlFor="content-recommendations">Content recommendations</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="credit-alerts" className="mr-2" defaultChecked />
                        <Label htmlFor="credit-alerts">Credit activity alerts</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="profile-visible" className="mr-2" defaultChecked />
                        <Label htmlFor="profile-visible">Make profile visible to other users</Label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="share-activity" className="mr-2" defaultChecked />
                        <Label htmlFor="share-activity">Share learning activity with connections</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">LinkedIn Integration</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-3 h-8 w-8 bg-linkedin-blue rounded-full flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">LinkedIn Account</p>
                          <p className="text-sm text-gray-500">Not connected</p>
                        </div>
                      </div>
                      <Button>Connect</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset Preferences</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-red-500" />
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Account Actions</h3>
                    <p className="text-gray-600 mb-4">
                      These actions are irreversible. Please be certain.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Delete All Saved Content
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Reset Credits
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={logout}>
                        Log Out
                      </Button>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
