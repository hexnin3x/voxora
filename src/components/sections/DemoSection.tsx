"use client";

import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ConversationPlayer } from "@/components/ui/conversation-player";
import { Phone, Scale, Home, Sparkles } from "lucide-react";

interface DemoItem {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  audioSrc: string;
  transcript: {
    start: number;
    end: number;
    speaker: "AI" | "Caller";
    speakerName?: string;
    text: string;
  }[];
}

const DEMO_ITEMS: DemoItem[] = [
  {
    id: "dental",
    category: "Healthcare",
    title: "Dental Clinic AI Assistant",
    description: "Listen to Sarah, our AI receptionist at Smile Dental Studio, booking a general checkup and cleaning for Alex Mercer.",
    icon: <Phone className="h-4 w-4" />,
    audioSrc: "/videos/dental-receptionist.mp3",
    transcript: [
      {
        start: 0,
        end: 4.5,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Thanks for calling Smile Dental Studio, this is Sarah. How can I help you today?",
      },
      {
        start: 4.5,
        end: 11.5,
        speaker: "Caller",
        speakerName: "Alex",
        text: "Hi, yeah... I was looking to book a general checkup and hygiene cleaning for next Tuesday afternoon if you guys have anything open?",
      },
      {
        start: 11.5,
        end: 19.0,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Perfect, I can absolutely help you with that. Before I check our available time slots for Tuesday, may I get your first and last name, please?",
      },
      {
        start: 19.0,
        end: 21.5,
        speaker: "Caller",
        speakerName: "Alex",
        text: "Sure, it's Alex Mercer.",
      },
      {
        start: 21.5,
        end: 27.5,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Got it, thanks Alex. And just in case we get disconnected, what’s the best cell phone number to reach you at?",
      },
      {
        start: 27.5,
        end: 30.5,
        speaker: "Caller",
        speakerName: "Alex",
        text: "It's 555-019-2834.",
      },
      {
        start: 30.5,
        end: 40.5,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Perfect, let me pull up the active registry for Tuesday... Okay, it looks like we have an opening at 2:30 PM, or I can do 4:00 PM. Do either of those work for you?",
      },
      {
        start: 40.5,
        end: 44.5,
        speaker: "Caller",
        speakerName: "Alex",
        text: "Uh, 2:30 PM works great. Let's lock that in.",
      },
      {
        start: 44.5,
        end: 54.5,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Awesome. I've got you down for Tuesday at 2:30 PM. I'm sending a secure confirmation code to your mobile number right now. Is there anything else I can optimize for your visit?",
      },
      {
        start: 54.5,
        end: 57.5,
        speaker: "Caller",
        speakerName: "Alex",
        text: "No, that's all. Thank you so much!",
      },
      {
        start: 57.5,
        end: 62.0,
        speaker: "AI",
        speakerName: "Sarah",
        text: "You're welcome, Alex! Have a fantastic day, and we'll see you on Tuesday.",
      },
    ],
  },
  {
    id: "cosmetic",
    category: "Aesthetics",
    title: "Cosmetic Clinic AI Assistant",
    description: "Listen to Sarah, our AI receptionist at Aura Aesthetics, answering pricing questions and booking a laser treatment for Lara Croft.",
    icon: <Sparkles className="h-4 w-4" />,
    audioSrc: "/videos/cosmetic-clinic.mp3",
    transcript: [
      {
        start: 0,
        end: 4.5,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Thanks for calling Aura Aesthetics, this is Sarah. How can I help you today?",
      },
      {
        start: 4.5,
        end: 10.0,
        speaker: "Caller",
        speakerName: "Lara",
        text: "Hi, how much do you charge for laser skin resurfacing next week?",
      },
      {
        start: 10.0,
        end: 15.0,
        speaker: "AI",
        speakerName: "Sarah",
        text: "I can grab that pricing for you. First, may I get your name and phone number please?",
      },
      {
        start: 15.0,
        end: 20.0,
        speaker: "Caller",
        speakerName: "Lara",
        text: "Sure, Lara Croft, and my number is 555-010-4498.",
      },
      {
        start: 20.0,
        end: 32.5,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Thanks, Lara. It's normally four hundred and fifty dollars, but if we book you for this Thursday at 3:00 PM, I can apply a flash discount and drop it to three hundred and ninety. Want me to hold that slot?",
      },
      {
        start: 32.5,
        end: 37.0,
        speaker: "Caller",
        speakerName: "Lara",
        text: "Oh, wow, yeah! Let's do Thursday at 3:00 PM.",
      },
      {
        start: 37.0,
        end: 44.0,
        speaker: "AI",
        speakerName: "Sarah",
        text: "Perfect! I've locked it in and just texted the confirmation to your number. See you Thursday, Lara!",
      },
      {
        start: 44.0,
        end: 47.0,
        speaker: "Caller",
        speakerName: "Lara",
        text: "Awesome, thank you!",
      },
    ],
  },
  {
    id: "legal",
    category: "Legal Services",
    title: "Law Firm Intake Assistant",
    description: "Listen to Ava, our AI legal assistant at Sterling & Associates, qualifying Michael Carter's employment inquiry and booking a consultation.",
    icon: <Scale className="h-4 w-4" />,
    audioSrc: "/videos/legal-intake.mp3",
    transcript: [
      {
        start: 0,
        end: 5.0,
        speaker: "AI",
        speakerName: "Ava",
        text: "Thank you for calling Sterling & Associates. I'm Ava, your virtual legal assistant. How can I help you today?",
      },
      {
        start: 5.0,
        end: 9.0,
        speaker: "Caller",
        speakerName: "Michael",
        text: "I'd like to speak with a lawyer about a workplace issue.",
      },
      {
        start: 9.0,
        end: 13.0,
        speaker: "AI",
        speakerName: "Ava",
        text: "I'm sorry to hear that. Could I have your name, please?",
      },
      {
        start: 13.0,
        end: 15.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Michael Carter.",
      },
      {
        start: 15.5,
        end: 20.0,
        speaker: "AI",
        speakerName: "Ava",
        text: "Thank you, Mr. Carter. When did the termination occur?",
      },
      {
        start: 20.0,
        end: 22.0,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Last week.",
      },
      {
        start: 22.0,
        end: 29.5,
        speaker: "AI",
        speakerName: "Ava",
        text: "Understood. An employment attorney can review your situation. Could I get your phone number and email address?",
      },
      {
        start: 29.5,
        end: 35.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Sure. It's 555-123-4567 and michael.carter@email.com.",
      },
      {
        start: 35.5,
        end: 44.0,
        speaker: "AI",
        speakerName: "Ava",
        text: "Thank you. We have consultation slots available tomorrow at 2:00 PM and 4:30 PM. Which would you prefer?",
      },
      {
        start: 44.0,
        end: 46.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "2:00 PM.",
      },
      {
        start: 46.5,
        end: 54.0,
        speaker: "AI",
        speakerName: "Ava",
        text: "Perfect. I've scheduled your consultation for tomorrow at 2:00 PM. You'll receive a confirmation email shortly with next steps.",
      },
      {
        start: 54.0,
        end: 56.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Great, thank you.",
      },
      {
        start: 56.5,
        end: 62.0,
        speaker: "AI",
        speakerName: "Ava",
        text: "You're welcome, Mr. Carter. Thank you for calling Sterling & Associates. Have a wonderful day.",
      },
    ],
  },
  {
    id: "realestate",
    category: "Real Estate",
    title: "Property Viewing Scheduler",
    description: "Listen to Sophia, our AI virtual real estate assistant at Horizon Realty, qualifying Michael Carter's rental search and booking a consultation.",
    icon: <Home className="h-4 w-4" />,
    audioSrc: "/videos/real-estate.mp3",
    transcript: [
      {
        start: 0,
        end: 5.0,
        speaker: "AI",
        speakerName: "Sophia",
        text: "Thank you for calling Horizon Realty. I'm Sophia, your virtual real estate assistant. How can I help you today?",
      },
      {
        start: 5.0,
        end: 9.0,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Hi, I'm looking for a 2-bedroom apartment in the downtown area.",
      },
      {
        start: 9.0,
        end: 12.0,
        speaker: "AI",
        speakerName: "Sophia",
        text: "I'd be happy to help. May I have your name, please?",
      },
      {
        start: 12.0,
        end: 14.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Michael Carter.",
      },
      {
        start: 14.5,
        end: 18.0,
        speaker: "AI",
        speakerName: "Sophia",
        text: "Thank you, Michael. Do you have a preferred budget range?",
      },
      {
        start: 18.0,
        end: 20.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Around $2,000 per month.",
      },
      {
        start: 20.5,
        end: 29.5,
        speaker: "AI",
        speakerName: "Sophia",
        text: "Great. We currently have several properties that match your criteria. Could I have your phone number and email address so an active agent can send you the listings?",
      },
      {
        start: 29.5,
        end: 35.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Sure. It's 555-123-4567 and michael.carter@email.com.",
      },
      {
        start: 35.5,
        end: 44.0,
        speaker: "AI",
        speakerName: "Sophia",
        text: "Thank you. One of our agents is available for a property consultation tomorrow at 11:00 AM. Would that work for you?",
      },
      {
        start: 44.0,
        end: 46.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Yes, that sounds good.",
      },
      {
        start: 46.5,
        end: 54.0,
        speaker: "AI",
        speakerName: "Sophia",
        text: "Perfect. I've scheduled your consultation for tomorrow at 11:00 AM. You'll receive a confirmation email shortly with additional property details.",
      },
      {
        start: 54.0,
        end: 56.5,
        speaker: "Caller",
        speakerName: "Michael",
        text: "Thank you.",
      },
      {
        start: 56.5,
        end: 62.0,
        speaker: "AI",
        speakerName: "Sophia",
        text: "You're welcome, Michael. Thank you for calling Horizon Realty. Have a wonderful day.",
      },
    ],
  },
];

export function DemoSection() {
  const [activeId, setActiveId] = useState(DEMO_ITEMS[0].id);
  const activeDemo = DEMO_ITEMS.find((d) => d.id === activeId) ?? DEMO_ITEMS[0];

  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeIn>
          <SectionHeader
            badge="Interactive Call Demos"
            title="Listen to Our AI Agents"
            highlight="In Action"
            description="Click the orbiting icons below to select different clinic assistants and toggle their calls."
          />
        </FadeIn>

        {/* Dynamic Conversation Player Card (Minimalist Centered) */}
        <FadeIn delay={0.2} className="mt-16 flex justify-center w-full">
          <ConversationPlayer
            key={activeDemo.id}
            audioSrc={activeDemo.audioSrc}
            transcript={activeDemo.transcript}
            activeDemoId={activeId}
            onSelectDemoId={setActiveId}
          />
        </FadeIn>
      </div>
    </section>
  );
}
