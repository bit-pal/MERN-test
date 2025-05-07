
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { AdminStats, ReportedContent, User } from "@/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Award, 
  CheckCircle, 
  Eye, 
  Flag, 
  Search, 
  Trash, 
  User as UserIcon, 
  Users, 
  XCircle 
} from "lucide-react";

// Mock data
const mockReportedContent: ReportedContent[] = [
  {
    id: "1",
    title: "The Future of AI in Education",
    description: "Artificial Intelligence is revolutionizing how we learn. Discover the latest trends and how they impact educational content delivery and personalization.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: "Dr. Emily Chen",
    publishedAt: new Date(Date.now() - 86400000 * 2),
    saves: 145,
    shares: 89,
    reports: 5,
    reportedBy: ["user1", "user2", "user3", "user4", "user5"],
    reportReasons: [
      "Contains inaccurate information", 
      "Promotes a product", 
      "Not educational content",
      "Misleading title",
      "Plagiarism concerns"
    ],
    status: "pending"
  },
  {
    id: "5",
    title: "Building Resilient Teams in a Remote Work Environment",
    description: "Remote work presents unique challenges for team cohesion and resilience. Discover proven strategies to foster connection, communication, and collaboration among distributed teams.",
    source: "linkedin",
    sourceUrl: "https://linkedin.com",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    author: "Jennifer Lopez",
    publishedAt: new Date(Date.now() - 86400000 * 6),
    saves: 124,
    shares: 67,
    reports: 3,
    reportedBy: ["user7", "user8", "user9"],
    reportReasons: [
      "Inappropriate content", 
      "Misleading information", 
      "Not relevant to professional learning"
    ],
    status: "pending"
  }
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    credits: 100,
    role: "user",
    savedContent: ["1", "3"],
    reportedContent: [],
    createdAt: new Date(Date.now() - 86400000 * 30)
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    credits: 500,
    role: "admin",
    savedContent: [],
    reportedContent: [],
    createdAt: new Date(Date.now() - 86400000 * 90)
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    credits: 75,
    role: "user",
    savedContent: ["2"],
    reportedContent: ["1"],
    createdAt: new Date(Date.now() - 86400000 * 15)
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@example.com",
    credits: 120,
    role: "moderator",
    savedContent: ["1", "4", "5"],
    reportedContent: [],
    createdAt: new Date(Date.now() - 86400000 * 45)
  }
];

const mockStats: AdminStats = {
  totalUsers: 156,
  totalContent: 432,
  topSavedContent: [
    {
      id: "3",
      title: "Digital Transformation: What Leaders Need to Know",
      description: "In today's rapidly changing business environment...",
      source: "linkedin",
      sourceUrl: "https://linkedin.com",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      author: "Sarah Williams",
      publishedAt: new Date(Date.now() - 86400000 * 3),
      saves: 210,
      shares: 145,
      reports: 0
    },
    {
      id: "1",
      title: "The Future of AI in Education",
      description: "Artificial Intelligence is revolutionizing how we learn...",
      source: "linkedin",
      sourceUrl: "https://linkedin.com",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      author: "Dr. Emily Chen",
      publishedAt: new Date(Date.now() - 86400000 * 2),
      saves: 145,
      shares: 89,
      reports: 5
    }
  ],
  mostActiveUsers: [
    {
      id: "4",
      name: "Michael Brown",
      email: "michael@example.com",
      credits: 120,
      role: "moderator",
      savedContent: ["1", "4", "5"],
      reportedContent: [],
      createdAt: new Date(Date.now() - 86400000 * 45)
    },
    {
      id: "1",
      name: "John Doe",
      email: "user@example.com",
      credits: 100,
      role: "user",
      savedContent: ["1", "3"],
      reportedContent: [],
      createdAt: new Date(Date.now() - 86400000 * 30)
    }
  ],
  pendingReports: 5
};

const Admin = () => {
  const [userSearch, setUserSearch] = useState("");
  const [contentSearch, setContentSearch] = useState("");
  const [reportedContentList, setReportedContentList] = useState(mockReportedContent);
  const [usersList, setUsersList] = useState(mockUsers);
  const { toast } = useToast();

  // Filter users based on search
  const filteredUsers = userSearch 
    ? usersList.filter(user => 
        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())
      )
    : usersList;

  // Filter reported content based on search
  const filteredReportedContent = contentSearch
    ? reportedContentList.filter(content =>
        content.title.toLowerCase().includes(contentSearch.toLowerCase()) ||
        content.author?.toLowerCase().includes(contentSearch.toLowerCase())
      )
    : reportedContentList;

  // Handle report actions
  const handleApproveContent = (contentId: string) => {
    setReportedContentList(prevList => 
      prevList.map(content => 
        content.id === contentId 
          ? { ...content, status: "reviewed" } 
          : content
      )
    );
    
    toast({
      title: "Content approved",
      description: "The content has been approved and will remain in the feed."
    });
  };

  const handleRemoveContent = (contentId: string) => {
    setReportedContentList(prevList => 
      prevList.map(content => 
        content.id === contentId 
          ? { ...content, status: "removed" } 
          : content
      )
    );
    
    toast({
      title: "Content removed",
      description: "The content has been removed from the feed."
    });
  };

  // Handle user actions
  const handleGrantCredits = (userId: string, amount: number) => {
    setUsersList(prevList => 
      prevList.map(user => 
        user.id === userId 
          ? { ...user, credits: user.credits + amount } 
          : user
      )
    );
    
    toast({
      title: "Credits granted",
      description: `${amount} credits have been added to the user's account.`
    });
  };

  const handleChangeUserRole = (userId: string, newRole: 'user' | 'moderator' | 'admin') => {
    setUsersList(prevList => 
      prevList.map(user => 
        user.id === userId 
          ? { ...user, role: newRole } 
          : user
      )
    );
    
    toast({
      title: "Role updated",
      description: `User's role has been updated to ${newRole}.`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-10">
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, content, and monitor platform metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold mt-1">{mockStats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Content</p>
                <p className="text-2xl font-bold mt-1">{mockStats.totalContent}</p>
              </div>
              <Eye className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Reported Content</p>
                <p className="text-2xl font-bold mt-1">{mockStats.pendingReports}</p>
              </div>
              <Flag className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Credits</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round(mockUsers.reduce((sum, user) => sum + user.credits, 0) / mockUsers.length)}
                </p>
              </div>
              <Award className="h-8 w-8 text-linkedin-blue opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="reported">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="reported">Reported Content</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>
          
          {/* Reported Content Tab */}
          <TabsContent value="reported" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reported Content</h2>
              <div className="relative w-64">
                <Input
                  placeholder="Search content..."
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            {filteredReportedContent.length > 0 ? (
              filteredReportedContent.map((content) => (
                <Card key={content.id} className={content.status === "removed" ? "opacity-60" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <CardTitle className="text-lg">{content.title}</CardTitle>
                          {content.status === "reviewed" && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Approved</span>
                          )}
                          {content.status === "removed" && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Removed</span>
                          )}
                          {content.status === "pending" && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending Review</span>
                          )}
                        </div>
                        <CardDescription>
                          By {content.author} • {new Date(content.publishedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className="flex items-center text-red-500 mr-2">
                          <Flag className="h-4 w-4 mr-1" />
                          {content.reports}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-gray-600 mb-3">{content.description}</p>
                    
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <h4 className="font-semibold mb-2">Report Reasons:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {content.reportReasons.map((reason, index) => (
                          <li key={index} className="text-sm text-gray-600">{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  
                  {content.status === "pending" && (
                    <CardFooter className="pt-2 flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="text-green-600" onClick={() => handleApproveContent(content.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleRemoveContent(content.id)}>
                        <XCircle className="h-4 w-4 mr-1" /> Remove
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(content.sourceUrl, '_blank')}>
                        <Eye className="h-4 w-4 mr-1" /> View Original
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <Flag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-700">No reported content</h3>
                <p className="text-gray-500 mb-4">All reported content has been reviewed</p>
              </div>
            )}
          </TabsContent>
          
          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <div className="relative w-64">
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-gray-500 text-sm font-medium">User</th>
                    <th className="px-4 py-3 text-gray-500 text-sm font-medium">Email</th>
                    <th className="px-4 py-3 text-gray-500 text-sm font-medium">Role</th>
                    <th className="px-4 py-3 text-gray-500 text-sm font-medium">Credits</th>
                    <th className="px-4 py-3 text-gray-500 text-sm font-medium">Joined</th>
                    <th className="px-4 py-3 text-gray-500 text-sm font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="bg-white">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-linkedin-blue rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{user.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : user.role === 'moderator'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-linkedin-blue mr-1" />
                          <span>{user.credits}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleGrantCredits(user.id, 50)}>
                            Grant Credits
                          </Button>
                          {user.role !== 'admin' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleChangeUserRole(
                                user.id, 
                                user.role === 'user' ? 'moderator' : 'user'
                              )}
                            >
                              {user.role === 'user' ? 'Make Moderator' : 'Remove Moderator'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-10">
                <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-700">No users found</h3>
                <p className="text-gray-500">Try a different search term</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
