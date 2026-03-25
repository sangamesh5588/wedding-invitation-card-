import { Calendar, Clock, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
import { EventDetail } from '../types';

interface EventCardProps {
  event: EventDetail;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="glass-card p-8 mb-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
      
      <h3 className="text-2xl font-serif font-bold text-primary mb-6 relative z-10">
        {event.title}
      </h3>
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-4 text-text/80">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium">Date</p>
            <p className="font-bold text-text">{event.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-text/80">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium">Time</p>
            <p className="font-medium">{event.time}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-text/80">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium">Venue</p>
            <p className="font-medium">{event.venue}</p>
          </div>
        </div>
      </div>

      {event.description && (
        <p className="mt-6 text-sm text-text/60 italic font-accent leading-relaxed">
          {event.description}
        </p>
      )}
    </motion.div>
  );
};

export default EventCard;
