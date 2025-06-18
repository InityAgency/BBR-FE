"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  ExternalLink, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  FileText,
  User,
  MessageSquare
} from "lucide-react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { toast } from "sonner";

interface CareerForm {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  message: string;
  cv: string | null;
  position: string;
  status: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CareerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerId: string | null;
}

export function CareerDetailsModal({ isOpen, onClose, careerId }: CareerDetailsModalProps) {
  const [careerForm, setCareerForm] = useState<CareerForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingCV, setDownloadingCV] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchCareerDetails = async (id: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/career-contact-forms/${id}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCareerForm(data.data);
      setCurrentStatus(data.data.status);
    } catch (err: any) {
      console.error("Error fetching career details:", err);
      toast.error("Failed to load career application details");
    } finally {
      setLoading(false);
    }
  };

  const downloadCV = async (mediaId: string, fileName: string) => {
    try {
      setDownloadingCV(true);
      
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/media/${mediaId}/content`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`CV "${fileName}" downloaded successfully`);
    } catch (err: any) {
      console.error("Error downloading CV:", err);
      toast.error(`Failed to download CV: ${err.message}`);
    } finally {
      setDownloadingCV(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!careerForm) return;
    
    try {
      setIsUpdatingStatus(true);
      
      // Optimistično ažuriranje - odmah postaviti novi status
      setCurrentStatus(newStatus);
      
      const response = await fetch(
        `${API_BASE_URL}/api/${API_VERSION}/career-contact-forms/${careerForm.id}/status`,
        {
          method: 'PATCH',
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setCareerForm(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      console.error("Error updating status:", err);
      
      // Ako zahtev neuspešan, vrati stari status
      setCurrentStatus(careerForm.status);
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-900/20 hover:bg-blue-900/40 text-blue-300 border-blue-900/50';
      case 'IN REVIEW':
        return 'bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50';
      case 'ACCEPTED':
        return 'bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50';
      case 'REJECT':
        return 'bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50';
      default:
        return 'bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (isOpen && careerId) {
      fetchCareerDetails(careerId);
    } else {
      setCareerForm(null);
      setCurrentStatus("");
    }
  }, [isOpen, careerId]);

  const allowedStatuses = ["NEW", "IN REVIEW", "ACCEPTED", "REJECT"];

  const renderStatusBadge = () => (
    <div className="flex items-center gap-2">
      <Select
        onValueChange={handleStatusChange}
        value={currentStatus}
        disabled={isUpdatingStatus}
      >
        <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
          <Badge
            className={`${getStatusBadgeStyle(currentStatus)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80 ${
              isUpdatingStatus ? 'opacity-50' : ''
            }`}
          >
            {isUpdatingStatus ? 'Updating...' : currentStatus}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {allowedStatuses.map((status) => (
            <SelectItem
              key={status}
              value={status}
              className="text-sm"
            >
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-foreground" />
            <span className="text-foreground">Career Application Details</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : careerForm ? (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-secondary/40 border rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    {careerForm.fullName}
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium mt-1">
                    {careerForm.position}
                  </p>
                </div>
                {renderStatusBadge()}
              </div>
              
              <div className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Applied: <span className="text-white">{formatDate(careerForm.createdAt)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  ID: <span className="text-white">{careerForm.id}</span>
                </span>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-foreground ">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">{careerForm.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">{careerForm.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg md:col-span-2">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">LinkedIn</p>
                    <a
                      href={careerForm.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {careerForm.linkedin}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Section */}
            <div className="bg-background border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3 text-foreground">
                <MessageSquare className="h-5 w-5 text-primary" />
                Application Message
              </h3>
              
              <div className="bg-secondary/30 rounded-lg p-4">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {careerForm.message}
                </p>
              </div>
            </div>

            {/* CV Download Section */}
            {careerForm.cv && (
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
                  <FileText className="h-5 w-5 text-purple-500" />
                  CV Document
                </h3>
                
                <div className="bg-muted border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">CV Document</p>
                        <p className="text-xs text-muted-foreground">Click to download the candidate's CV</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadCV(careerForm.cv!, `CV_${careerForm.fullName.replace(/\s+/g, '_')}.pdf`)}
                      disabled={downloadingCV}
                      className="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700"
                    >
                      {downloadingCV ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download CV
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Note Section */}
            {careerForm.note && (
              <div className="bg-background border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-foreground">
                  <MessageSquare className="h-5 w-5 text-orange-500" />
                  Internal Note
                </h3>
                
                <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                    {careerForm.note}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No career application details found</p>
            <p className="text-sm">The requested application could not be loaded.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 