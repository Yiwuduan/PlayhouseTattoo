import { motion } from "framer-motion";
import MapSection from "@/components/map-section";

export default function About() {
  return (
    <div className="pt-24 pb-16">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
          OUR STORY
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Playhouse is more than just a tattoo shop – it's a creative sanctuary where art
          meets skin, and stories come to life through ink.
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
            THE SPACE
          </h2>
          <p className="text-muted-foreground mb-6">
            Located in the heart of the city, our studio is designed to inspire creativity
            and provide a comfortable, luxurious environment for our clients and artists alike.
          </p>
          <p className="text-muted-foreground">
            Every detail has been carefully considered to create an atmosphere that's both
            welcoming and professionally focused.
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
          OUR PHILOSOPHY
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          At Playhouse, we believe that every tattoo tells a story. Our artists work
          closely with clients to bring their visions to life, creating unique pieces
          that stand the test of time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "QUALITY",
              description: "Uncompromising attention to detail in every piece"
            },
            {
              title: "SAFETY",
              description: "Strict sterilization and safety protocols"
            },
            {
              title: "ARTISTRY",
              description: "Continuous evolution of craft and style"
            }
          ].map((item) => (
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