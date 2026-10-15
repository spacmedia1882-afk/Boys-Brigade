// The Boys' Brigade Nigeria - data.js
//
// ALL the teaching facts live in this one file.
// To fix a fact, edit it here and save. The whole site updates.
//
// Anything marked CHECK comes from the general Boys' Brigade pattern
// (UK origin) and has not been confirmed for Nigeria. Correct it first.

// Helper for quiz questions (used at the bottom of this file).
// Q(topic, question, CORRECT answer, [wrong answers], explanation)
// Write the correct answer first. The options are shuffled for you,
// and "answer" (the number of the correct option) is worked out for you.
function Q(topic, q, correct, wrong, explain) {
  var options = [correct].concat(wrong);
  for (var i = options.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = options[i];
    options[i] = options[j];
    options[j] = t;
  }
  return { topic: topic, q: q, options: options, answer: options.indexOf(correct), explain: explain };
}

window.BB_DATA = {

  // ---------------------------------------------------------------
  // TEST SETTINGS
  // minutes = time allowed for each test (timer starts when the test starts)
  // sections = one test per section; id must match the quiz topic below
  // ---------------------------------------------------------------
  test: {
    minutes: 5,
    sections: [
      { id: "ranks", name: "Ranks" },
      { id: "uniform", name: "Uniform" },
      { id: "history", name: "History" }
    ]
  },

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
  // FLIP CARDS (key notes)
  // topic = ranks, uniform or history
  // front = the question or term, back = the answer to learn
  // ---------------------------------------------------------------
  flashcards: [
    // Ranks
    { topic: "ranks", front: "Lance Corporal", back: "The first rank a boy can earn. One chevron." },
    { topic: "ranks", front: "Corporal", back: "Two chevrons. Can lead a squad or a team." },
    { topic: "ranks", front: "Sergeant", back: "Three chevrons. Helps the officers and mentors younger boys." },
    { topic: "ranks", front: "Colour Sergeant", back: "Senior boy rank worn with a red sash. Sits above Sergeant. (CHECK for Nigeria)" },
    { topic: "ranks", front: "Staff Sergeant", back: "The top boy rank. Acts as an officer in the company and does not stand in the ranks." },
    { topic: "ranks", front: "Which way do chevrons point?", back: "Downwards." },
    { topic: "ranks", front: "Where is the rank armband worn?", back: "Upper right arm. A Staff Sergeant traditionally wears it on the right cuff." },
    { topic: "ranks", front: "Captain", back: "The adult officer in charge of the company." },
    { topic: "ranks", front: "Lieutenant", back: "An adult officer who helps the Captain run parades and training." },
    { topic: "ranks", front: "Rank order, lowest to highest", back: "Lance Corporal, Corporal, Sergeant, Colour Sergeant, Staff Sergeant." },
    { topic: "ranks", front: "What do chevrons show?", back: "A boy's rank." },
    { topic: "ranks", front: "Who has more responsibility, a Corporal or a Lance Corporal?", back: "A Corporal." },

    // Uniform
    { topic: "uniform", front: "Cap", back: "Worn on the head, carries the Brigade badge. Wear it straight and clean." },
    { topic: "uniform", front: "Shirt", back: "Traditionally blue. Kept clean and pressed." },
    { topic: "uniform", front: "Lanyard", back: "White. Worn under the left shoulder, attached to the left breast pocket." },
    { topic: "uniform", front: "Haversack", back: "White. Worn over the right shoulder. Use the proper cleaner only." },
    { topic: "uniform", front: "Staff Sergeant's haversack", back: "Traditionally brown leather." },
    { topic: "uniform", front: "Belt and buckle", back: "Brown leather belt with a brass buckle. Polish the buckle until it gleams." },
    { topic: "uniform", front: "Boots", back: "Polished before every parade." },
    { topic: "uniform", front: "Rank armband", back: "Upper right arm." },
    { topic: "uniform", front: "Achievement badges", back: "Worn on the left arm." },
    { topic: "uniform", front: "What loses points at inspection?", back: "Using polish meant for other items on the haversack." },
    { topic: "uniform", front: "Where does the cap come from?", back: "It began as a small pillbox hat, later replaced in many places by a forage or field cap." },
    { topic: "uniform", front: "What is worn with the boots?", back: "Brigade socks." },

    // History
    { topic: "history", front: "Who founded the Boys' Brigade?", back: "William Alexander Smith." },
    { topic: "history", front: "When and where did it start?", back: "4 October 1883 in Glasgow, Scotland." },
    { topic: "history", front: "What was special about it?", back: "It was the world's first uniformed youth organisation." },
    { topic: "history", front: "What happened on 1 October 1926?", back: "The Brigade merged with the Boys' Life Brigade." },
    { topic: "history", front: "What is the badge?", back: "An anchor placed over a cross." },
    { topic: "history", front: "Where do the anchor and the cross come from?", back: "The anchor from the Brigade, the Geneva cross from the Boys' Life Brigade." },
    { topic: "history", front: "What is the motto?", back: "Sure and Steadfast." },
    { topic: "history", front: "What does the motto mean?", back: "We can be trusted and we do not give up." },
    { topic: "history", front: "Where does the motto come from?", back: "It echoes Hebrews 6:19 in the Bible." },
    { topic: "history", front: "How many years from the first company to the merger?", back: "43 years (1883 to 1926)." }
  ],

  // ---------------------------------------------------------------
  // QUIZ
  // Q(topic, question, CORRECT answer, [wrong answers], explanation)
  // 30 questions for each section
  // ---------------------------------------------------------------
  quiz: [

    // ---------------- RANKS (30) ----------------
    Q("ranks", "How many chevrons does a Corporal wear?", "Two", ["One", "Three", "Four"], "A Lance Corporal wears one, a Corporal two and a Sergeant three."),
    Q("ranks", "Which is the first rank a boy can earn?", "Lance Corporal", ["Sergeant", "Corporal", "Staff Sergeant"], "Lance Corporal comes first, with one chevron."),
    Q("ranks", "Which rank is the highest a boy can reach?", "Staff Sergeant", ["Captain", "Colour Sergeant", "Lieutenant"], "Staff Sergeant is the top boy rank. Captain and Lieutenant are adult officers."),
    Q("ranks", "What is a Colour Sergeant traditionally worn with?", "A red sash", ["A blue tie", "A green belt", "Gold boots"], "A red sash marks the Colour Sergeant."),
    Q("ranks", "How many chevrons does a Lance Corporal wear?", "One", ["Two", "Three", "Four"], "A Lance Corporal wears one chevron."),
    Q("ranks", "How many chevrons does a Sergeant wear?", "Three", ["One", "Two", "Five"], "A Sergeant wears three chevrons."),
    Q("ranks", "Which rank comes directly above Corporal?", "Sergeant", ["Lance Corporal", "Colour Sergeant", "Staff Sergeant"], "The order starts Lance Corporal, Corporal, Sergeant."),
    Q("ranks", "Which rank comes directly above Lance Corporal?", "Corporal", ["Sergeant", "Captain", "Colour Sergeant"], "Corporal is the second rank, with two chevrons."),
    Q("ranks", "Which rank sits between Sergeant and Staff Sergeant?", "Colour Sergeant", ["Corporal", "Lance Corporal", "Lieutenant"], "In the traditional Brigade, Colour Sergeant is above Sergeant and below Staff Sergeant."),
    Q("ranks", "Who is the leader of a company?", "The Captain", ["The Sergeant", "The Corporal", "The youngest boy"], "The Captain is the officer in charge of the company."),
    Q("ranks", "Which of these is an adult officer?", "Lieutenant", ["Corporal", "Sergeant", "Lance Corporal"], "Lieutenant is an adult officer. The others are boy ranks."),
    Q("ranks", "Which of these is NOT a boy rank?", "Captain", ["Sergeant", "Corporal", "Staff Sergeant"], "Captain is an adult officer."),
    Q("ranks", "Which officer helps the Captain run parades and training?", "The Lieutenant", ["The Lance Corporal", "The Corporal", "The Sergeant"], "The Lieutenant assists the Captain."),
    Q("ranks", "Which way do the chevrons on a rank armband point?", "Downwards", ["Upwards", "Sideways", "They are round"], "Chevrons are downward-pointing stripes."),
    Q("ranks", "What do the chevrons on the arm show?", "A boy's rank", ["A boy's age", "A boy's height", "The company name"], "Chevrons show a boy's rank."),
    Q("ranks", "Who may lead a squad or team during activities?", "A Corporal", ["A visitor", "A new recruit", "Nobody"], "Corporals carry more responsibility, such as leading a squad."),
    Q("ranks", "What do Sergeants do?", "Help the officers run the company and mentor younger boys", ["Only polish boots", "Stay at home", "Choose the Captain"], "Sergeants set the example and help the officers."),
    Q("ranks", "Where does a Staff Sergeant NOT stand?", "In the ranks", ["In the office", "On parade", "In the hall"], "Staff Sergeants act as officers within the company and do not stand in the ranks."),
    Q("ranks", "What is a Staff Sergeant traditionally worn with?", "A brown leather haversack and a stick", ["A red sash", "A white lanyard", "Gold boots"], "Staff Sergeants traditionally wear a brown leather haversack and carry a stick."),
    Q("ranks", "Traditionally, where does a Staff Sergeant wear the armband?", "On the right cuff", ["On the left shoulder", "On the cap", "On the belt"], "The Staff Sergeant armband is traditionally on the right cuff."),
    Q("ranks", "Lance Corporal is the first of which group of ranks?", "Non-commissioned ranks", ["Officer ranks", "Honorary ranks", "Cadet ranks"], "Lance Corporal is the first non-commissioned rank."),
    Q("ranks", "The rank chevrons follow the style of which army?", "The British Army", ["The Royal Navy", "The Fire Service", "The Police"], "The chevrons are in the style of the British Army."),
    Q("ranks", "How many boy ranks are taught on this site?", "Five", ["Three", "Four", "Six"], "Lance Corporal, Corporal, Sergeant, Colour Sergeant and Staff Sergeant."),
    Q("ranks", "Which rank has the most chevrons?", "Sergeant", ["Lance Corporal", "Corporal", "They are all the same"], "A Sergeant wears three chevrons."),
    Q("ranks", "Which rank has one stripe on the arm?", "Lance Corporal", ["Sergeant", "Corporal", "Colour Sergeant"], "One chevron means Lance Corporal."),
    Q("ranks", "A Staff Sergeant is...", "Still a boy of the Brigade who acts as an officer within the company", ["An adult officer of the Captain's rank", "A visitor", "A parent"], "Staff Sergeants are boys, but they help the officers lead."),
    Q("ranks", "A Lance Corporal is typically given to a boy who has shown...", "Reliability and a good example", ["Only a loud voice", "Nothing special", "A new uniform"], "The rank is given for reliability and a good example."),
    Q("ranks", "Which list is in order from lowest to highest rank?", "Lance Corporal, Corporal, Sergeant", ["Corporal, Lance Corporal, Sergeant", "Sergeant, Corporal, Lance Corporal", "Lance Corporal, Sergeant, Corporal"], "One chevron, then two, then three."),
    Q("ranks", "In the traditional Brigade, a Warrant Officer is...", "An adult helper who supports the company", ["A boy rank above Sergeant", "A kind of badge", "The company mascot"], "Warrant Officer is an officer-level helper."),
    Q("ranks", "Who carries more responsibility?", "A Corporal", ["A Lance Corporal", "They are equal", "Neither"], "Corporals carry more responsibility than Lance Corporals."),

    // ---------------- UNIFORM (30) ----------------
    Q("uniform", "Which shoulder is the haversack worn over?", "The right", ["The left", "Either", "Neither"], "The haversack goes over the right shoulder."),
    Q("uniform", "Where does the rank armband go?", "Upper right arm", ["On the cap", "Around the waist", "On the boot"], "Rank chevrons are worn on the upper right arm."),
    Q("uniform", "What should you never put on a white haversack?", "Boot polish or metal polish", ["Water", "A badge", "Nothing at all"], "Polish meant for belts and buckles will mark the haversack and lose points at inspection."),
    Q("uniform", "What does the cap carry?", "The Brigade badge", ["A rank chevron", "A lanyard", "Nothing"], "The cap carries the Brigade badge."),
    Q("uniform", "The traditional Brigade cap began as which kind of hat?", "A pillbox hat", ["A top hat", "A bowler hat", "A straw hat"], "It began as a small pillbox hat."),
    Q("uniform", "What colour is the traditional section shirt?", "Blue", ["Red", "Green", "Yellow"], "The traditional shirt is blue. (CHECK for Nigeria)"),
    Q("uniform", "How should the shirt be kept?", "Clean and pressed", ["Crumpled", "Dirty", "Inside out"], "A clean, pressed shirt is the base of the uniform."),
    Q("uniform", "What colour is the lanyard?", "White", ["Red", "Black", "Brown"], "The lanyard is a white cord."),
    Q("uniform", "Under which shoulder is the lanyard worn?", "The left", ["The right", "Both", "Neither"], "The lanyard is worn under the left shoulder."),
    Q("uniform", "Where does the lanyard attach?", "The left breast pocket", ["The belt buckle", "The cap", "The right boot"], "It runs from the left shoulder to the left breast pocket."),
    Q("uniform", "What colour is the standard haversack?", "White", ["Brown", "Black", "Blue"], "The standard haversack is white."),
    Q("uniform", "What are Staff Sergeants' haversacks traditionally made of?", "Brown leather", ["White cloth", "Plastic", "Rope"], "Staff Sergeants traditionally wear a brown leather haversack."),
    Q("uniform", "What colour is the belt?", "Brown leather", ["White rope", "Red cloth", "Blue plastic"], "The belt is brown leather. (CHECK for Nigeria)"),
    Q("uniform", "What is the belt buckle traditionally made of?", "Brass", ["Plastic", "Wood", "Rubber"], "A brass buckle, kept polished."),
    Q("uniform", "What should you do to the buckle?", "Polish it until it gleams", ["Paint it", "Hide it", "Remove it"], "Polish the buckle until it gleams."),
    Q("uniform", "Which of these loses points at inspection?", "Polish meant for other items used on the haversack", ["A polished buckle", "An ironed shirt", "Polished boots"], "Only the proper cleaner should be used on the haversack."),
    Q("uniform", "When are boots polished?", "Before every parade", ["Once a year", "Never", "Only on Sundays"], "Boots are polished before every parade."),
    Q("uniform", "Where are achievement badges worn?", "On the left arm", ["On the right arm", "On the belt", "On the boots"], "Achievement badges go on the left arm."),
    Q("uniform", "Which item is worn around the waist?", "The belt", ["The cap", "The lanyard", "The haversack"], "The belt is worn around the waist."),
    Q("uniform", "Which item is worn on the head?", "The cap", ["The boots", "The belt", "The shirt"], "The cap is worn on the head."),
    Q("uniform", "Which item is worn on the feet?", "Boots", ["The cap", "The haversack", "The lanyard"], "Boots are worn on the feet."),
    Q("uniform", "Which item goes across the body from the right shoulder?", "The haversack", ["The lanyard", "The belt", "The armband"], "The haversack is the long strap across the body."),
    Q("uniform", "How should the cap be worn?", "Straight and clean", ["Backwards", "Tilted far over one eye", "In the pocket"], "Wear the cap straight and keep it clean."),
    Q("uniform", "Which of these is worn with the uniform?", "Brigade socks", ["Swimming goggles", "Any hat", "Sandals"], "Brigade socks are worn with the uniform."),
    Q("uniform", "Which two items need polishing?", "The belt buckle and the boots", ["The cap and the shirt", "The lanyard and the armband", "The haversack and the shirt"], "The buckle and the boots are polished."),
    Q("uniform", "In many places the pillbox cap was later replaced by...", "A forage or field cap", ["A helmet", "A top hat", "Nothing"], "A forage or field cap replaced it in many places."),
    Q("uniform", "Why does a neat uniform matter?", "It is checked at every inspection", ["Nobody notices", "It is only for photos", "It is not important"], "Neat dress is part of every inspection."),
    Q("uniform", "What does your cap show?", "That you belong to the Brigade", ["Your age", "Your height", "Your school"], "The cap shows you belong to the Brigade."),
    Q("uniform", "What is the base of the whole uniform?", "A clean, ironed shirt", ["The boots", "The lanyard", "The belt buckle"], "Everything else is fitted to a clean, pressed shirt."),
    Q("uniform", "Where do the rank stripes go?", "On the rank armband", ["On the boots", "On the belt", "On the lanyard"], "Rank chevrons are carried on the rank armband."),

    // ---------------- HISTORY (30) ----------------
    Q("history", "In which city was the first Boys' Brigade company started?", "Glasgow", ["London", "Lagos", "Dublin"], "William Smith started it in Glasgow in 1883."),
    Q("history", "What does the Boys' Brigade badge show?", "An anchor over a cross", ["A lion and a star", "A drum", "A flag and a sword"], "The anchor was joined with the cross in 1926."),
    Q("history", "What is the Brigade motto?", "Sure and Steadfast", ["Ready and Willing", "Strong Together", "Onward Always"], "Sure and Steadfast. It means trustworthy and never giving up."),
    Q("history", "Who started the Boys' Brigade?", "William Alexander Smith", ["Robert Baden-Powell", "John Brown", "David Livingstone"], "William Alexander Smith founded the first company."),
    Q("history", "In which year did the first company start?", "1883", ["1783", "1926", "1999"], "The first company began in 1883."),
    Q("history", "On what date did the first company start?", "4 October 1883", ["1 October 1926", "25 December 1883", "1 January 1900"], "The first company began on 4 October 1883."),
    Q("history", "In which country was the Brigade founded?", "Scotland", ["Nigeria", "Australia", "Canada"], "It began in Glasgow, Scotland."),
    Q("history", "The Boys' Brigade was the world's first...", "Uniformed youth organisation", ["Football club", "School", "Bank"], "It was the world's first uniformed youth organisation."),
    Q("history", "In which year did the Brigade merge with the Boys' Life Brigade?", "1926", ["1883", "1950", "1899"], "The merger took place in 1926."),
    Q("history", "Which group did the Boys' Brigade join in 1926?", "The Boys' Life Brigade", ["The Scouts", "The Girls' Brigade", "The Church Lads' Brigade"], "The Boys' Life Brigade merged with the Boys' Brigade."),
    Q("history", "On what date did the merger happen?", "1 October 1926", ["4 October 1883", "1 January 1926", "25 December 1926"], "The merger took place on 1 October 1926."),
    Q("history", "What was joined with the anchor to make the badge?", "The Geneva cross", ["A crown", "A star", "A sword"], "The anchor was joined with the Geneva cross."),
    Q("history", "Which part of the badge came from the Boys' Life Brigade?", "The cross", ["The anchor", "The motto", "The drum"], "The Geneva cross came from the Life Brigade."),
    Q("history", "Which part of the badge came from the original Boys' Brigade?", "The anchor", ["The cross", "The crown", "The star"], "The anchor was the Brigade's own emblem."),
    Q("history", "What does Sure and Steadfast mean for us?", "We can be trusted and we do not give up", ["We are the fastest", "We always win", "We never rest"], "It means trustworthy and never giving up."),
    Q("history", "Complete the motto: Sure and ...", "Steadfast", ["Strong", "Swift", "Silent"], "Sure and Steadfast."),
    Q("history", "How many years passed between the first company (1883) and the merger (1926)?", "43 years", ["33 years", "53 years", "100 years"], "1926 minus 1883 is 43."),
    Q("history", "Which happened first?", "The first company in 1883", ["The merger in 1926", "Both on the same day", "Neither happened"], "The Brigade began in 1883 and merged in 1926."),
    Q("history", "Why does our badge show an anchor with a cross behind it?", "Two groups joined together in 1926", ["It is a ship's badge", "A boy drew it", "It shows a fishing club"], "The anchor and the cross came from the two groups that joined."),
    Q("history", "The emblem shows an anchor placed over what?", "A cross", ["A drum", "A crown", "A star"], "An anchor placed over a cross."),
    Q("history", "On which continent did the Brigade begin?", "Europe", ["Africa", "Asia", "South America"], "It began in Scotland, which is in Europe."),
    Q("history", "In which century was the Brigade founded?", "The 19th century", ["The 17th century", "The 20th century", "The 21st century"], "1883 is in the nineteenth century."),
    Q("history", "What was the symbol of the Boys' Life Brigade?", "The Geneva cross", ["The anchor", "The drum", "The shield"], "The Life Brigade used the Geneva cross."),
    Q("history", "The motto echoes a Bible verse in which book?", "Hebrews", ["Genesis", "Revelation", "Psalms"], "It echoes Hebrews 6:19, which speaks of hope as an anchor of the soul, sure and steadfast."),
    Q("history", "Who was William Alexander Smith?", "The founder of the Boys' Brigade", ["A Captain in Nigeria", "A Staff Sergeant", "A football coach"], "He founded the first company in Glasgow."),
    Q("history", "Which statement is true?", "The Brigade began in Glasgow in 1883", ["The Brigade began in Lagos in 1883", "The Brigade began in Glasgow in 1926", "The Brigade began in London in 1999"], "Glasgow, 1883."),
    Q("history", "In which year did the anchor and cross become one badge?", "1926", ["1883", "1900", "2000"], "The two emblems were joined in 1926."),
    Q("history", "What type of organisation is the Boys' Brigade?", "A uniformed youth organisation", ["A bank", "A shop", "A football league"], "It is a uniformed youth organisation."),
    Q("history", "Glasgow, where the Brigade began, is in which country?", "Scotland", ["Nigeria", "Wales", "Ireland"], "Glasgow is in Scotland."),
    Q("history", "In which month did the first company start in 1883?", "October", ["January", "June", "December"], "It began on 4 October 1883.")
  ]
};