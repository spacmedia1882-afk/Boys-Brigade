// The Boys' Brigade Nigeria - data.js
//
// ALL the teaching facts live in this one file.
// To fix a fact, edit it here and save. The whole site updates.
//
// Anything marked CHECK comes from the general Boys' Brigade pattern
// (UK origin) and has not been confirmed for Nigeria. Correct it first.

window.BB_DATA = {

  // ---------------------------------------------------------------
  // RANKS
  // chevrons = number of downward-pointing stripes on the armband
  // age      = usual minimum age (CHECK: sources differ by country)
  // ---------------------------------------------------------------
  ranks: [
    {
      id: "lance-corporal",
      name: "Lance Corporal",
      chevrons: 1,
      mark: "One chevron",
      age: "14+",
      kids: "The first rank a boy can earn. One stripe on the arm shows you are trusted to help lead.",
      leaders: "The first non-commissioned rank. Worn as one downward-pointing chevron on the rank armband, in the style of the British Army. Typically given to a boy who has shown reliability and a good example in the company."
    },
    {
      id: "corporal",
      name: "Corporal",
      chevrons: 2,
      mark: "Two chevrons",
      age: "15+",
      kids: "Two stripes. A Corporal helps look after a small group of boys on parade.",
      leaders: "The second NCO rank, shown by two chevrons. Corporals carry more responsibility than Lance Corporals, such as leading a squad or a team during activities."
    },
    {
      id: "sergeant",
      name: "Sergeant",
      chevrons: 3,
      mark: "Three chevrons",
      age: "16+",
      kids: "Three stripes. Sergeants are senior boys who set the example for everyone else.",
      leaders: "The third NCO rank, shown by three chevrons. Sergeants help the officers run the company and mentor younger boys."
    },
    {
      id: "colour-sergeant",
      name: "Colour Sergeant",
      chevrons: null,
      mark: "Red sash",
      age: "17+",
      kids: "A senior boy who wears a red sash. Colour Sergeants are trusted with important jobs.",
      leaders: "A senior boy rank worn with a red sash. In the traditional Brigade this rank sits above Sergeant and below Staff Sergeant. CHECK: confirm whether Nigeria uses this rank and what it is worn with."
    },
    {
      id: "staff-sergeant",
      name: "Staff Sergeant",
      chevrons: null,
      mark: "Brown leather haversack and a stick",
      age: "18+",
      kids: "The highest rank a boy can reach. A Staff Sergeant helps the officers lead the whole company.",
      leaders: "The top boy rank. Staff Sergeants are still boys of the Brigade but act as officers within the company and do not stand in the ranks. Traditionally worn with a brown leather haversack, a stick, and the armband on the right cuff. CHECK: age and details for Nigeria."
    }
  ],

  // Officers (adult leaders). CHECK every line for Nigeria.
  officers: [
    {
      id: "captain",
      name: "Captain",
      kids: "The leader of the company. The Captain is a grown-up who looks after everything.",
      leaders: "The officer in charge of a company, responsible for its leadership, programme and the welfare of its boys. CHECK: Nigerian title and structure."
    },
    {
      id: "lieutenant",
      name: "Lieutenant",
      kids: "A grown-up leader who helps the Captain and teaches the boys.",
      leaders: "A commissioned officer who assists the Captain in running parades, training and activities. CHECK: Nigerian title and structure."
    },
    {
      id: "warrant-officer",
      name: "Warrant Officer",
      kids: "A grown-up helper with a special job in the company.",
      leaders: "An officer-level helper in the traditional Brigade structure, appointed to support the company. CHECK: whether Nigeria uses this title."
    }
  ],

  // ---------------------------------------------------------------
  // UNIFORM
  // id must match a part in the SVG figure in index.html
  // ---------------------------------------------------------------
  uniform: [
    {
      id: "cap",
      name: "Cap",
      where: "On the head",
      kids: "Your cap shows you belong to the Brigade. Wear it straight and keep it clean.",
      leaders: "The traditional cap began as a small pillbox hat, a common military cap of the nineteenth century, and was later replaced in many places by a forage or field cap. It carries the Brigade badge. CHECK: the cap your Nigerian companies wear."
    },
    {
      id: "shirt",
      name: "Shirt",
      where: "On the body",
      kids: "A clean, ironed shirt is the base of the whole uniform.",
      leaders: "The traditional section uniform uses a blue shirt, kept clean and pressed, with the rank armband and badges fitted to it. CHECK: colour and style for Nigeria."
    },
    {
      id: "lanyard",
      name: "Lanyard",
      where: "Under the left shoulder, to the left breast pocket",
      kids: "A white cord that loops from your shoulder to your pocket.",
      leaders: "A white lanyard worn under the left shoulder and attached to the left breast pocket. CHECK: whether your company uses it."
    },
    {
      id: "haversack",
      name: "Haversack",
      where: "Over the right shoulder",
      kids: "The long white strap worn across your body from your right shoulder. Keep it spotless.",
      leaders: "The white haversack is worn over the right shoulder. It is kept clean with the proper cleaner only, since polish meant for other items will mark it and lose points at inspection. Staff Sergeants traditionally wear a brown leather one."
    },
    {
      id: "armband",
      name: "Rank armband",
      where: "Upper right arm",
      kids: "This is where your rank stripes go. Lance Corporal has one, Corporal two, Sergeant three.",
      leaders: "The rank armband sits on the upper right arm and carries the chevrons that show a boy's rank. For a Staff Sergeant it is traditionally worn on the right cuff. Achievement badges are worn on the left arm. CHECK: placement in Nigeria."
    },
    {
      id: "belt",
      name: "Belt",
      where: "Around the waist",
      kids: "A leather belt with a shiny buckle. Polish the buckle until it gleams.",
      leaders: "A brown leather belt with a brass buckle, kept polished. Boot polish on the buckle or cleaner on the haversack are classic inspection faults. CHECK: colour and buckle for Nigeria."
    },
    {
      id: "boots",
      name: "Boots",
      where: "On the feet",
      kids: "Shiny boots show you take care of your uniform.",
      leaders: "Boots are polished before every parade. Brigade socks are worn with uniform. Neat footwear is part of every inspection."
    }
  ],

  // ---------------------------------------------------------------
  // HISTORY
  // ---------------------------------------------------------------
  history: [
    {
      year: "1883",
      title: "The first company",
      kids: "On 4 October 1883, a man called William Smith started the very first Boys' Brigade in Glasgow, Scotland.",
      leaders: "William Alexander Smith founded the first company of the Boys' Brigade on 4 October 1883 in Glasgow, Scotland, making it the world's first uniformed youth organisation."
    },
    {
      year: "1926",
      title: "The anchor and the cross",
      kids: "The Brigade joined with another group called the Boys' Life Brigade. That is why our badge has an anchor with a cross behind it.",
      leaders: "On 1 October 1926 the Boys' Brigade merged with the Boys' Life Brigade. The Brigade anchor was joined with the Geneva cross of the Life Brigade to form the emblem used today."
    },
    {
      year: "Today",
      title: "Sure and Steadfast",
      kids: "Our motto is Sure and Steadfast. It means we can be trusted and we do not give up.",
      leaders: "The motto is Sure and Steadfast, and the emblem shows an anchor placed over a cross. CHECK: add the date the Brigade began in Nigeria and the story of your own company here."
    }
  ],

  // ---------------------------------------------------------------
  // QUIZ
  // answer = number of the correct option, counting from 0
  // ---------------------------------------------------------------
  quiz: [
    {
      topic: "ranks",
      q: "How many chevrons does a Corporal wear?",
      options: ["One", "Two", "Three", "Four"],
      answer: 1,
      explain: "A Lance Corporal wears one, a Corporal two and a Sergeant three."
    },
    {
      topic: "ranks",
      q: "Which is the first rank a boy can earn?",
      options: ["Sergeant", "Corporal", "Lance Corporal", "Staff Sergeant"],
      answer: 2,
      explain: "Lance Corporal comes first, with one chevron."
    },
    {
      topic: "ranks",
      q: "Which rank is the highest a boy can reach?",
      options: ["Staff Sergeant", "Captain", "Colour Sergeant", "Lieutenant"],
      answer: 0,
      explain: "Staff Sergeant is the top boy rank. Captain and Lieutenant are adult officers."
    },
    {
      topic: "ranks",
      q: "What is a Colour Sergeant traditionally worn with?",
      options: ["A blue tie", "A red sash", "A green belt", "Gold boots"],
      answer: 1,
      explain: "A red sash marks the Colour Sergeant."
    },
    {
      topic: "uniform",
      q: "Which shoulder is the haversack worn over?",
      options: ["The left", "The right", "Either", "Neither"],
      answer: 1,
      explain: "The haversack goes over the right shoulder."
    },
    {
      topic: "uniform",
      q: "Where does the rank armband go?",
      options: ["Upper right arm", "On the cap", "Around the waist", "On the boot"],
      answer: 0,
      explain: "Rank chevrons are worn on the upper right arm."
    },
    {
      topic: "uniform",
      q: "What should you never put on a white haversack?",
      options: ["Water", "Boot polish or metal polish", "A badge", "Nothing at all"],
      answer: 1,
      explain: "Polish meant for belts and buckles will mark the haversack and lose points at inspection."
    },
    {
      topic: "history",
      q: "In which city was the first Boys' Brigade company started?",
      options: ["London", "Lagos", "Glasgow", "Dublin"],
      answer: 2,
      explain: "William Smith started it in Glasgow in 1883."
    },
    {
      topic: "history",
      q: "What does the Boys' Brigade badge show?",
      options: ["A lion and a star", "An anchor over a cross", "A drum", "A flag and a sword"],
      answer: 1,
      explain: "The anchor was joined with the cross in 1926."
    },
    {
      topic: "history",
      q: "What is the Brigade motto?",
      options: ["Ready and Willing", "Sure and Steadfast", "Strong Together", "Onward Always"],
      answer: 1,
      explain: "Sure and Steadfast. It means trustworthy and never giving up."
    }
  ]
};