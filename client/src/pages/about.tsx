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

  const values = aboutContent.values as Array<{ title: string; description: string }>;

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[60vh] mb-16 overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=2574&auto=format&fit=crop"
            alt="Tattoo studio hero"
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative h-full flex items-center justify-center text-white text-center px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              {aboutContent.storyTitle || "Our Story"}
            </h1>
            <p className="text-lg max-w-2xl mx-auto">
              {aboutContent.storyContent || "Welcome to our studio, where art meets skin in perfect harmony."}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Studio Space Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-16 items-center mb-24 px-4 max-w-7xl mx-auto"
      >
        <div className="aspect-square bg-muted overflow-hidden rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1621800043295-a73fe2f76e2c?q=80&w=2574&auto=format&fit=crop"
            alt="Tattoo shop interior"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tighter mb-6">
            {aboutContent.spaceTitle || "Our Space"}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {aboutContent.spaceContent || "Step into our carefully crafted environment, designed to inspire creativity and ensure your comfort throughout your tattoo journey."}
          </p>
        </div>
      </motion.div>

      {/* Philosophy Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto mb-24 px-4"
      >
        <h2 className="text-3xl font-bold tracking-tighter mb-6">
          {aboutContent.philosophyTitle || "Our Philosophy"}
        </h2>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          {aboutContent.philosophyContent || "We believe in creating meaningful art that tells your story, combining traditional craftsmanship with contemporary design."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 bg-muted rounded-lg"
            >
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Studio Images Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto mb-24 px-4"
      >
        <img
          src="https://images.unsplash.com/photo-1598371839873-7f009da0c37c?q=80&w=2574&auto=format&fit=crop"
          alt="Studio atmosphere 1"
          className="w-full aspect-square object-cover rounded-lg"
        />
        <img
          src="https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?q=80&w=2574&auto=format&fit=crop"
          alt="Studio atmosphere 2"
          className="w-full aspect-square object-cover rounded-lg"
        />
        <img
          src="https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?q=80&w=2576&auto=format&fit=crop"
          alt="Studio atmosphere 3"
          className="w-full aspect-square object-cover rounded-lg"
        />
      </motion.section>

      {/* Map Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-4"
      >
        <h2 className="text-3xl font-bold tracking-tighter mb-8 text-center">
          VISIT US
        </h2>
        <MapSection />
      </motion.section>
    </div>
  );
}