import { GradeProfile, StagePrompt } from "@/store/dashTypes";

export const STAGE_PROMPTS: Record<GradeProfile, StagePrompt[]> = {
  "primary-1-3": [
    {
      id: "p1",
      category: "Wild Animals",
      prompt: "If you could adopt ANY wild animal as a pet, which would it be and why?",
      hints: ["What does it eat?", "Where does it sleep?", "What trick can it do?"],
      starters: ["I would adopt a...", "Because it has...", "Every day we would...", "My parents might say..."],
    },
    {
      id: "p2",
      category: "Superpowers",
      prompt: "Invent a brand new superpower that no superhero has ever had before!",
      hints: ["How do you turn it on?", "What is its secret weakness?", "Does it make a sound?"],
      starters: ["My superpower is...", "It lets me...", "Whenever I use it...", "Villains run away because..."],
    },
    {
      id: "p3",
      category: "Ice Cream Lab",
      prompt: "You are the head chef at a crazy ice cream shop. Create the weirdest flavor!",
      hints: ["What colors are in it?", "Does it pop or glow?", "Who would love to eat it?"],
      starters: ["My ice cream is called...", "The secret ingredient is...", "It tastes like...", "You should top it with..."],
    },
  ],
  "upper-elem-4-6": [
    {
      id: "u1",
      category: "Time Machine",
      prompt: "You discovered a time machine in your school locker. Where are you going first?",
      hints: ["Past or future?", "What historical figure will you meet?", "What souvenir will you bring back?"],
      starters: ["I would dial the clock to...", "First, I want to see...", "I would warn people about...", "Before coming back, I'd grab..."],
    },
    {
      id: "u2",
      category: "School Rules",
      prompt: "You are Principal for one week. What is the very first rule you change?",
      hints: ["Recess length?", "Classroom pets?", "Lunch menu makeover?"],
      starters: ["As the new Principal...", "My rule is that all students...", "Teachers will be required to...", "This will make school better because..."],
    },
    {
      id: "u3",
      category: "Desert Island Gizmo",
      prompt: "You are stranded on a mysterious tropical island with only one electronic gadget. Which one?",
      hints: ["How will you recharge it?", "Does it call for help?", "Can it make music?"],
      starters: ["The gadget I brought is...", "It's essential because...", "To survive each day...", "Rescue teams will find me by..."],
    },
  ],
  "high-a1": [
    {
      id: "h1",
      category: "Future Cities",
      prompt: "Describe what your city will look like in the year 2060.",
      hints: ["Flying vehicles?", "Underwater houses?", "Robots doing chores?"],
      starters: ["In the year 2060, people...", "Transportation will rely on...", "The biggest difference is...", "I believe technology will..."],
    },
    {
      id: "h2",
      category: "Dream Trip",
      prompt: "You have a free ticket to travel anywhere in the universe right now. Where to?",
      hints: ["Who is your travel partner?", "What luggage do you pack?", "What is the view like?"],
      starters: ["I would immediately fly to...", "The main reason I picked this is...", "While there, I will definitely...", "Looking outside the window, I see..."],
    },
  ],
  "high-adv": [
    {
      id: "a1",
      category: "Ethics & AI",
      prompt: "Should artificial intelligence be allowed to grade student essays and speeches?",
      hints: ["Bias vs objective grading", "Teacher empathy", "Instant feedback benefits"],
      starters: ["From an educational standpoint...", "While AI provides rapid feedback...", "The fundamental flaw lies in...", "Therefore, human educators must..."],
    },
    {
      id: "a2",
      category: "Space Exploration",
      prompt: "Is deep space exploration worth the billions of dollars spent each year?",
      hints: ["Earth climate priorities", "Technological spinoffs", "The survival of humanity"],
      starters: ["Proponents argue that space investment...", "However, critics rightly point out that...", "When weighing the scientific discoveries...", "Ultimately, the balance requires..."],
    },
  ],
};

export function getPromptForGrade(grade: GradeProfile, index: number): StagePrompt {
  const list = STAGE_PROMPTS[grade] || STAGE_PROMPTS["upper-elem-4-6"];
  return list[Math.abs(index) % list.length];
}
