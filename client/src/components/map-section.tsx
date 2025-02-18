import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

export default function MapSection() {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="aspect-video bg-muted rounded-lg overflow-hidden"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2889.533754770676!2d-79.65291542347066!3d43.60211905555107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b40c44ce40de1%3A0x487c8165f7ca797a!2s900%20Rathburn%20Rd%20W%2C%20Mississauga%2C%20ON%20L5C%204L3!5e0!3m2!1sen!2sca!4v1708308679044!5m2!1sen!2sca"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5" />
            <h3 className="text-xl font-bold">Visit Us</h3>
          </div>
          <p className="text-muted-foreground">
            900 Rathburn Rd. W<br />
            Mississauga, ON<br />
            Canada
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5" />
            <h3 className="text-xl font-bold">Hours</h3>
          </div>
          <div className="space-y-2 text-muted-foreground">
            <p>Monday - Sunday</p>
            <p className="font-medium">12:00 PM - 8:00 PM</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
