import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Artist, PortfolioItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Save } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [uploadingProfile, setUploadingProfile] = useState<number | null>(null);
  const [uploadingPortfolio, setUploadingPortfolio] = useState<number | null>(null);
  const [editingArtist, setEditingArtist] = useState<number | null>(null);
  const [artistStates, setArtistStates] = useState<Record<number, { bio: string; specialties: string }>>({});

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

  // Initialize artist states when data is loaded
  useEffect(() => {
    if (artists) {
      const newStates: Record<number, { bio: string; specialties: string }> = {};
      artists.forEach((artist) => {
        newStates[artist.id] = {
          bio: artist.bio,
          specialties: artist.specialties.join(", ")
        };
      });
      setArtistStates(newStates);
    }
  }, [artists]);

  const updateArtistDetailsMutation = useMutation({
    mutationFn: async ({ 
      artistId, 
      bio, 
      specialties 
    }: { 
      artistId: number; 
      bio: string; 
      specialties: string[] 
    }) => {
      const currentState = artistStates[artistId];
      if (!currentState) {
        throw new Error("Artist state not found");
      }

      const bioToSend = bio.trim();
      if (bioToSend.length === 0) {
        throw new Error("Bio is required");
      }

      if (!specialties || specialties.length === 0) {
        throw new Error("At least one specialty is required");
      }

      setEditingArtist(artistId);
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          bio: bioToSend,
          specialties: specialties.filter(s => s.trim().length > 0)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update artist details' }));
        throw new Error(errorData.message || 'Failed to update artist details');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      queryClient.invalidateQueries({ 
        predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/artists/') 
      });
      toast({
        title: "Success",
        description: "Artist details updated successfully",
      });
      setEditingArtist(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update artist details",
        variant: "destructive",
      });
      setEditingArtist(null);
    },
  });

  const updateProfileImageMutation = useMutation({
    mutationFn: async ({ artistId, file }: { artistId: number; file: File }) => {
      setUploadingProfile(artistId);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`/api/artists/${artistId}/profile-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
        throw new Error(errorData.message || 'Failed to upload image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      queryClient.invalidateQueries({ 
        predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/artists/') 
      });
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });
      setUploadingProfile(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile image",
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

      const response = await fetch(`/api/artists/${artistId}/portfolio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
        throw new Error(errorData.message || 'Failed to upload image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      queryClient.invalidateQueries({ 
        predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/artists/') 
      });
      toast({
        title: "Success",
        description: "Portfolio item added successfully",
      });
      setUploadingPortfolio(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add portfolio item",
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
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="profile">Profile Image</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid w-full max-w-xl gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`bio-${artist.id}`}>Bio</Label>
                      <Textarea
                        id={`bio-${artist.id}`}
                        value={artistStates[artist.id]?.bio ?? artist.bio}
                        onChange={(e) => setArtistStates(prev => ({
                          ...prev,
                          [artist.id]: { ...prev[artist.id], bio: e.target.value }
                        }))}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`specialties-${artist.id}`}>Specialties (comma-separated)</Label>
                      <Input
                        id={`specialties-${artist.id}`}
                        value={artistStates[artist.id]?.specialties ?? artist.specialties.join(", ")}
                        onChange={(e) => setArtistStates(prev => ({
                          ...prev,
                          [artist.id]: { ...prev[artist.id], specialties: e.target.value }
                        }))}
                        placeholder="e.g. Fine Line, Botanicals, Minimalist"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        const state = artistStates[artist.id];
                        if (!state) {
                          console.error('No state found for artist:', artist.id);
                          toast({
                            title: "Error",
                            description: "Unable to save changes. Please refresh the page and try again.",
                            variant: "destructive",
                          });
                          return;
                        }

                        const specialtiesArray = state.specialties
                          .split(",")
                          .map(s => s.trim())
                          .filter(s => s.length > 0);

                        updateArtistDetailsMutation.mutate({
                          artistId: artist.id,
                          bio: state.bio,
                          specialties: specialtiesArray
                        });
                      }}
                      disabled={editingArtist === artist.id}
                    >
                      {editingArtist === artist.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

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