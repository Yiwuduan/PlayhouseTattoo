import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Artist, PortfolioItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [uploadingProfile, setUploadingProfile] = useState<number | null>(null);
  const [uploadingPortfolio, setUploadingPortfolio] = useState<number | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.isAdmin !== "true") {
      setLocation("/");
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    }
  }, [user, setLocation, toast]);

  const { data: artists, isLoading } = useQuery<(Artist & { portfolioItems: PortfolioItem[] })[]>({
    queryKey: ['/api/artists']
  });

  const updateProfileImageMutation = useMutation({
    mutationFn: async ({ artistId, file }: { artistId: number; file: File }) => {
      setUploadingProfile(artistId);
      const formData = new FormData();
      formData.append("image", file);
      await apiRequest("POST", `/api/artists/${artistId}/profile-image`, formData);
    },
    onSuccess: () => {
      // Invalidate all artist-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0].toString().startsWith('/api/artists/') 
      });
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
      setUploadingProfile(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive",
      });
      setUploadingProfile(null);
    },
  });

  const addPortfolioItemMutation = useMutation({
    mutationFn: async ({ artistId, file, title }: { artistId: number; file: File; title: string }) => {
      setUploadingPortfolio(artistId);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      await apiRequest("POST", `/api/artists/${artistId}/portfolio`, formData);
    },
    onSuccess: () => {
      // Invalidate all artist-related queries
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0].toString().startsWith('/api/artists/') 
      });
      toast({
        title: "Success",
        description: "Portfolio item added successfully",
      });
      setUploadingPortfolio(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add portfolio item",
        variant: "destructive",
      });
      setUploadingPortfolio(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-4xl font-bold">Artist Management</h1>

        {artists?.map((artist) => (
          <Card key={artist.id}>
            <CardHeader>
              <CardTitle>{artist.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile">Profile Image</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`profile-${artist.id}`}>Profile Image</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id={`profile-${artist.id}`}
                        type="file"
                        accept="image/*"
                        disabled={uploadingProfile === artist.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            updateProfileImageMutation.mutate({ artistId: artist.id, file });
                          }
                        }}
                      />
                      {uploadingProfile === artist.id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                  {artist.profileImage && (
                    <img
                      src={`${artist.profileImage}?${Date.now()}`}
                      alt={`${artist.name}'s profile`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`portfolio-${artist.id}`}>Add Portfolio Item</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id={`portfolio-${artist.id}`}
                        type="file"
                        accept="image/*"
                        disabled={uploadingPortfolio === artist.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const title = file.name.split('.')[0];
                            addPortfolioItemMutation.mutate({ 
                              artistId: artist.id, 
                              file,
                              title 
                            });
                          }
                        }}
                      />
                      {uploadingPortfolio === artist.id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {artist.portfolioItems.map((item) => (
                      <div key={item.id} className="relative">
                        <img
                          src={`${item.imageUrl}?${Date.now()}`}
                          alt={item.title || "Portfolio item"}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}