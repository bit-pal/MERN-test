
import { useState } from "react";
import { ContentItem } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Award, Eye, Flag, Linkedin, Save, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContentCardProps {
  content: ContentItem;
  onSave: (contentId: string) => void;
  onShare: (contentId: string) => void;
  onReport: (contentId: string, reason: string) => void;
}

const ContentCard = ({ content, onSave, onShare, onReport }: ContentCardProps) => {
  const { user, addCredits } = useAuth();
  const { toast } = useToast();
  const [reportReason, setReportReason] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if content is already saved by user
  const isSaved = user?.savedContent?.includes(content.id);

  // Calculate time ago for display
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  // Handle content interaction with credit rewards
  const handleView = () => {
    // Reward credits for viewing content (only if not expanded yet)
    if (!isExpanded) {
      addCredits(1);
      toast({
        title: "Credit earned!",
        description: "You earned 1 credit for viewing this content.",
      });
    }
    setIsExpanded(true);
  };

  const handleSave = () => {
    onSave(content.id);
    addCredits(2);
    toast({
      title: "Credit earned!",
      description: "You earned 2 credits for saving content.",
    });
  };

  const handleShare = () => {
    onShare(content.id);
    addCredits(3);
    toast({
      title: "Credit earned!",
      description: "You earned 3 credits for sharing content.",
    });
  };

  const handleReport = (reason: string) => {
    onReport(content.id, reason);
    setReportReason("");
  };

  return (
    <Card className="feed-card w-full mb-4 overflow-hidden animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{content.title}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span>{content.author}</span>
              <span className="mx-1">•</span>
              <span>{getTimeAgo(content.publishedAt)}</span>
              {content.source === 'linkedin' && (
                <Linkedin className="ml-1 h-4 w-4 text-linkedin-blue" />
              )}
            </div>
          </div>
          {content.imageUrl && (
            <div className="ml-4 flex-shrink-0">
              <img 
                src={content.imageUrl} 
                alt={content.title} 
                className="h-16 w-16 object-cover rounded"
              />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className={isExpanded ? "" : "line-clamp-2"}>
          <p className="text-gray-600">{content.description}</p>
        </div>
        {!isExpanded && content.description.length > 100 && (
          <Button 
            variant="link" 
            className="p-0 h-auto text-linkedin-blue" 
            onClick={handleView}
          >
            Read more
          </Button>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={isSaved ? "text-linkedin-blue" : ""}
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1" /> 
                  <span className="text-xs">{content.saves}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save for later (+2 credits)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4 mr-1" /> 
                  <span className="text-xs">{content.shares}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share content (+3 credits)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4 mr-1" /> 
                <span className="text-xs">{content.reports}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Report Content</AlertDialogTitle>
                <AlertDialogDescription>
                  Please provide a reason for reporting this content.
                  <textarea
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Reason for reporting..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  disabled={!reportReason} 
                  onClick={() => handleReport(reportReason)}
                >
                  Submit Report
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => window.open(content.sourceUrl, '_blank')}
          >
            <Eye className="h-3 w-3 mr-1" /> View on LinkedIn
          </Button>
          <div className="ml-2 flex items-center">
            <Award className="h-4 w-4 text-linkedin-blue" />
            <span className="ml-1 text-xs">+1</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
