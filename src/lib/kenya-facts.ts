export const kenyanFacts = [
  "Did you know? Kenya was the first country in Africa to gain independence in the 1960s wave of decolonization!",
  "Fun fact: Wangari Maathai was the first African woman to win the Nobel Peace Prize in 2004!",
  "Interesting: Kenya's name comes from Mount Kenya, the second highest peak in Africa!",
  "Cool fact: The Kenyan flag colors represent the people (black), peace (white), blood shed (red), and land (green)!",
  "Did you know? Tom Mboya was instrumental in bringing Barack Obama Sr. to America!",
  "Amazing: Eliud Kipchoge ran a marathon in under 2 hours - a feat once thought impossible!",
  "Fun fact: Kenya has more than 40 ethnic groups, each with unique traditions!",
  "Interesting: The word 'Harambee' means 'pull together' and is Kenya's national motto!",
  "Did you know? Kenya was a British colony for 68 years before independence in 1963!",
  "Cool fact: Ngugi wa Thiong'o writes in Gikuyu to preserve African languages!",
];

export function getRandomFact(): string {
  return kenyanFacts[Math.floor(Math.random() * kenyanFacts.length)];
}

