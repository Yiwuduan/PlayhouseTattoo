import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { AboutContent } from "@shared/schema";
import MapSection from "@/components/map-section";
import { Loader2 } from "lucide-react";

export default function About() {
  const { data: aboutContent, isLoading } = useQuery<AboutContent>({
    queryKey: ['/api/about']
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!aboutContent) {
    return null;
  }

  // Parse the values from JSON string if it's a string
  const values = typeof aboutContent.values === 'string' 
    ? JSON.parse(aboutContent.values) 
    : aboutContent.values;

  return (
    <div className="pt-24 pb-16">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
          {aboutContent.storyTitle}
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          {aboutContent.storyContent}
        </p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-16 items-center mb-24"
      >
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556195332-95503f664ced"
            alt="Tattoo shop interior"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tighter mb-6">
            {aboutContent.spaceTitle}
          </h2>
          <p className="text-muted-foreground">
            {aboutContent.spaceContent}
          </p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto mb-24"
      >
        <h2 className="text-3xl font-bold tracking-tighter mb-6">
          {aboutContent.philosophyTitle}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {aboutContent.philosophyContent}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item: { title: string; description: string }) => (
            <div key={item.title} className="p-6">
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">
          VISIT US
        </h2>
        <MapSection />
      </motion.section>
    </div>
  );
}