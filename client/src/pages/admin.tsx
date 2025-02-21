import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Artist, PortfolioItem, AboutContent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Save, Trash2 } from "lucide-react";
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
  const [editingAbout, setEditingAbout] = useState(false);
  const [artistStates, setArtistStates] = useState<Record<number, { bio: string; specialties: string }>>({});
  const [aboutState, setAboutState] = useState<Partial<AboutContent> | null>(null);

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
    mutationFn: async ({ 
      artistId, 
      formData 
    }: { 
      artistId: number; 
      formData: FormData;
    }) => {
      setUploadingPortfolio(artistId);

      const response = await fetch(`/api/artists/${artistId}/portfolio`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to upload images' }));
        throw new Error(errorData.message || 'Failed to upload images');
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
        description: "Portfolio items added successfully",
      });
      setUploadingPortfolio(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add portfolio items",
        variant: "destructive",
      });
      setUploadingPortfolio(null);
    },
  });

  const deletePortfolioItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await fetch(`/api/portfolio-items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete image' }));
        throw new Error(errorData.message || 'Failed to delete image');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artists'] });
      queryClient.invalidateQueries({ 
        predicate: (query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/api/artists/') 
      });
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete portfolio item",
        variant: "destructive",
      });
    },
  });

  // Query for about content
  const { data: aboutContent, isLoading: isAboutLoading } = useQuery<AboutContent>({
    queryKey: ['/api/about']
  });

  // Initialize about content state when data is loaded
  useEffect(() => {
    if (aboutContent) {
      setAboutState(aboutContent);
    }
  }, [aboutContent]);

  // Mutation for updating about content
  const updateAboutContentMutation = useMutation({
    mutationFn: async (data: Partial<AboutContent>) => {
      setEditingAbout(true);
      const response = await fetch('/api/about', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update about content' }));
        throw new Error(errorData.message || 'Failed to update about content');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/about'] });
      toast({
        title: "Success",
        description: "About page content updated successfully",
      });
      setEditingAbout(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update about content",
        variant: "destructive",
      });
      setEditingAbout(false);
    },
  });


  if (isLoading || isAboutLoading) {
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
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <Tabs defaultValue="artists" className="space-y-8">
          <TabsList>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
          </TabsList>

          <TabsContent value="artists">
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
                        <Label htmlFor={`portfolio-${artist.id}`}>Add Portfolio Items</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id={`portfolio-${artist.id}`}
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={uploadingPortfolio === artist.id}
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const formData = new FormData();
                                Array.from(files).forEach((file) => {
                                  formData.append('images', file);
                                });

                                addPortfolioItemMutation.mutate({ 
                                  artistId: artist.id, 
                                  formData
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
                          <div key={item.id} className="relative group">
                            <img
                              src={`${item.imageUrl}?${Date.now()}`}
                              alt={item.title || "Portfolio item"}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this portfolio item?')) {
                                  deletePortfolioItemMutation.mutate(item.id);
                                }
                              }}
                              disabled={deletePortfolioItemMutation.isPending}
                            >
                              {deletePortfolioItemMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Page Content</CardTitle>
              </CardHeader>
              <CardContent>
                {aboutState && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="story-title">Story Title</Label>
                        <Input
                          id="story-title"
                          value={aboutState.storyTitle || ''}
                          onChange={(e) => setAboutState(prev => ({
                            ...prev,
                            storyTitle: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-content">Story Content</Label>
                        <Textarea
                          id="story-content"
                          value={aboutState.storyContent || ''}
                          onChange={(e) => setAboutState(prev => ({
                            ...prev,
                            storyContent: e.target.value
                          }))}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="space-title">Space Title</Label>
                        <Input
                          id="space-title"
                          value={aboutState.spaceTitle || ''}
                          onChange={(e) => setAboutState(prev => ({
                            ...prev,
                            spaceTitle: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="space-content">Space Content</Label>
                        <Textarea
                          id="space-content"
                          value={aboutState.spaceContent || ''}
                          onChange={(e) => setAboutState(prev => ({
                            ...prev,
                            spaceContent: e.target.value
                          }))}
                          rows={4}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="philosophy-title">Philosophy Title</Label>
                        <Input
                          id="philosophy-title"
                          value={aboutState.philosophyTitle || ''}
                          onChange={(e) => setAboutState(prev => ({
                            ...prev,
                            philosophyTitle: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="philosophy-content">Philosophy Content</Label>
                        <Textarea
                          id="philosophy-content"
                          value={aboutState.philosophyContent || ''}
                          onChange={(e) => setAboutState(prev => ({
                            ...prev,
                            philosophyContent: e.target.value
                          }))}
                          rows={4}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => updateAboutContentMutation.mutate(aboutState)}
                      disabled={editingAbout}
                      className="w-full"
                    >
                      {editingAbout ? (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}