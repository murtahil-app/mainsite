import type { Locale } from "./i18n";
import type { TimeKind } from "./cities";

// Every visible string on the site, in English, Arabic and Turkish. The voice follows the identity and the
// campaign brief: short, present tense, plain, no exclamation marks, no claims the app can’t back,
// and never a word against other apps, operators or the transport itself.

const en = {
  meta: {
    title: "Murtahil: public transport in nine cities",
    description:
      "Routes, departures and step-by-step guidance for metro, bus, rail and ferry in Riyadh, Jeddah, Makkah, Medina, the Eastern Province, Bahrain, Istanbul, Ankara, Cairo, Damascus and Hama.",
  },
  skip: "Skip to content",
  brand: { latin: "Murtahil", arabic: "مرتحل", home: "Murtahil home" },
  nav: {
    cities: "Cities",
    features: "Features",
    apps: "Apps",
    about: "About",
    faq: "FAQ",
    openApp: "Open the web app",
    soon: "Coming soon on {date}",
    menu: "Open menu",
    close: "Close menu",
    theme: "Switch between light and dark",
  },
  hero: {
    title: "Making transportation easier wherever you go.",
    sub: "Plan routes, see departures and follow each step on metro, bus, rail and ferry, across nine cities in five countries.",
    secondary: "See the cities",
    webAlt:
      "The Murtahil web app planning a trip in Riyadh: the Blue Line from KAFD to Qasr Al Hokm, 32 minutes with no changes.",
    phoneAlt: "The Murtahil iPhone app planning a Blue Line trip from KAFD to Al Owd: 42 minutes with no changes.",
  },
  cities: {
    title: "Nine cities in five countries",
    body: "The same app and the same screens in every one of them. Pick a city to see what Murtahil covers there.",
    modes: "Ways to travel",
    times: "Times you’ll see",
    plan: "Plan a trip in {city}",
    liveInApps: "Live in the apps",
    choose: "Choose a city",
  },
  times: {
    live: { name: "Live", body: "From the operator’s real-time feed, updated as vehicles move." },
    predicted: { name: "Predicted", body: "Worked out from where vehicles are and how traffic usually moves at that hour." },
    scheduled: { name: "Scheduled", body: "From the official timetable, trip by trip." },
    estimated: { name: "Estimated", body: "From how often a line runs, where no timetable exists." },
  } satisfies Record<TimeKind, { name: string; body: string }>,
  problems: {
    eyebrow: "Why we built it",
    title: "Getting around shouldn’t take research.",
    rows: [
      {
        problem: "Every city keeps its transport information somewhere different.",
        answer: "Murtahil covers nine cities in five countries with the same screens. Switch city and everything you’ve learned still works.",
      },
      {
        problem: "One trip can mean three different operators.",
        answer: "Murtahil plans across them in one go: a metro, Marmaray and a ferry in Istanbul, or a bus and the Haramain train from Makkah to Medina.",
      },
      {
        problem: "A timetable isn’t the same as the time.",
        answer: "Every time is labelled live, predicted, scheduled or estimated, so you know how much to lean on it.",
      },
      {
        problem: "Some networks have no official map at all.",
        answer: "In Damascus and Hama, servees lines come from community mapping, down to the spots where you can wave one down.",
      },
      {
        problem: "“How much is it?” is often the hardest question.",
        answer: "Where fares are published, Murtahil shows them with the route, in riyals, dinars and pounds, including Bahrain’s GO Card daily cap.",
      },
    ],
  },
  features: {
    title: "Built for the whole trip",
    body: "The phone apps don’t stop at a route. They stay with you until you arrive.",
    nav: {
      title: "Step by step until you get off",
      body: "Walk, wait, board and ride, with the stops counted down. Spoken steps in Arabic, English or Turkish, and a floating window when you switch apps.",
      alt: "Live navigation on the Riyadh Metro Yellow Line: get off after 2 stops, 6.8 km to go.",
    },
    track: {
      title: "Your bus, on the lock screen",
      body: "Follow a bus to your stop with chimes at two minutes, one minute and arrival. If it leaves its route or skips your stop, you’ll know.",
      badge: "Premium",
      alt: "Tracking cards from the Android app: a bus 4 minutes away, a bus that has left its route, and a trip marked as boarded.",
    },
    assistant: {
      title: "Ask in your own words",
      body: "Tell the assistant where you’re going. It plans the route, checks arrivals and saves places for you.",
      alt: "The assistant planning a trip to Al Faisaliah Tower in Riyadh: 29 minutes on the Purple and Blue lines.",
    },
    arrivals: {
      title: "Departures, counting down",
      body: "Station pages list the next departures on every line, live where the city shares it.",
      alt: "Live arrivals at Aksaray in Istanbul: M1A and M1B trains in 1, 4, 6 and 9 minutes.",
    },
    share: {
      title: "A location pin is a destination",
      body: "Share a pin from WhatsApp, Messages or a maps app straight into Murtahil.",
    },
    shareRoute: {
      title: "A route is a shareable plan",
      body: "Send any route as clear, step-by-step text, with its lines, stops and times, to WhatsApp or Messages.",
    },
  },
  timesSection: {
    title: "Every time tells you where it came from",
    body: "Some cities share live data. Others publish timetables, or only how often a line runs. Murtahil labels each time so you can tell them apart.",
    caption: "An example board. Lines and times are for illustration.",
    board: [
      { badge: "231", color: "#750025", dest: "Al Miqat", place: "Medina, Al Faisaliyah", time: "4 min", kind: "live" },
      { badge: "M5", color: "#6d3d8c", dest: "Üsküdar", place: "Istanbul, platform 1", time: "3 min", kind: "predicted" },
      { badge: "A1", color: "#B3462E", dest: "Bahrain International Airport", place: "Bahrain, Isa Town", time: "15:44", kind: "scheduled" },
      { badge: "D01", color: "#1A7F8E", dest: "Abbasiyyin", place: "Damascus, Baramkeh", time: "about 6 min", kind: "estimated" },
    ] satisfies { badge: string; color: string; dest: string; place: string; time: string; kind: TimeKind }[],
  },
  languages: {
    title: "Three languages, one voice",
    body: "Every screen works in Arabic, English and Turkish. Arabic isn’t just translated: layouts mirror right to left, and numbers stay easy to read.",
    samples: [
      { lang: "en", name: "English", text: "The next ferry to Kadıköy leaves in 4 minutes." },
      { lang: "ar", name: "العربية", text: "العبّارة التالية إلى كاديكوي تنطلق بعد 4 دقائق." },
      { lang: "tr", name: "Türkçe", text: "Kadıköy’e bir sonraki vapur 4 dakika sonra kalkıyor." },
    ],
  },
  apps: {
    title: "On the web today. On\u00a0your phone soon.",
    body: "The web app covers every city now, on any screen. The iPhone and Android apps are in beta, with a store release coming soon.",
    available: "Available now",
    titleSoon: "On the web first. On\u00a0your phone soon.",
    bodySoon:
      "The web app opens on 30 November 2026 with all nine cities, on any screen. The iPhone and Android apps are in beta, with a store release coming soon.",
    comingSoon: "Coming soon",
    beta: "Coming soon",
    items: [
      { key: "web", name: "Web app", body: "Plan trips, see departures and browse lines in any modern browser, on a computer or a phone." },
      { key: "ios", name: "iPhone and watchOS", body: "Live Activities and the Dynamic Island keep your trip and your bus on the lock screen." },
      { key: "android", name: "Android and Wear OS", body: "A tracking card on the lock screen, and a watch app with your saved places and nearby stations." },
    ],
    alt: "The web app in Istanbul: Kadıköy to Taksim by ferry across the Bosphorus to Kabataş, then a short walk.",
  },
  about: {
    eyebrow: "About",
    title: "A murtahil is a traveller",
    body: [
      "Someone at ease on the move. Our mark is Riyadh’s Kingdom Centre with the metro passing through its opening: a landmark you travel by, and the journey through it.",
      "Murtahil began in Riyadh and grew one city at a time. Each one gets the same care: gather what’s published, fill the gaps, check it against the street, and say plainly what’s an estimate.",
    ],
    markAlt: "The Murtahil mark: the Kingdom Centre with the metro passing through its opening.",
    dataTitle: "Where the data comes from",
    data: [
      "Timetables and real-time feeds published by transport operators",
      "Map data from Open Source projects",
      "Community-mapped lines",
      "Our own checks, such as matching the order of stops to live bus positions",
    ],
  },
  faq: {
    title: "Questions",
    items: <{ q: string; a: string; aSoon?: string }[]>[
      {
        q: "Is Murtahil free?",
        a: "Yes. The web app is free, and the phone apps have a free plan with ads. A Premium plan will add lock-screen tracking and voice conversations with the assistant; upgrades aren’t open yet.",
      },
      {
        q: "When can I download the phone apps?",
        a: "The iPhone and Android apps are in closed beta now, and the store release is coming soon. Until then, the web app covers the same nine cities.",
        aSoon:
          "The iPhone and Android apps are in beta now, and the store release is coming soon. The web app, with the same nine cities, opens on 30 November 2026.",
      },
      {
        q: "Are the times live?",
        a: "In seven of the nine, yes. The phone apps show live times in Riyadh; Jeddah, Makkah and Medina; the Eastern Province; Bahrain; Istanbul; Ankara; and Cairo. In Damascus and Hama, times are estimated from how often a line runs. Every time is labelled, so you can tell.",
      },
      {
        q: "Which languages does it speak?",
        a: "Arabic, English and Turkish, on the web and in both phone apps. Spoken directions in the phone apps work in all three.",
      },
      {
        q: "Which cities does it cover?",
        a: "Riyadh; Jeddah, Makkah and Medina; the Eastern Province; Bahrain; Istanbul; Ankara; Cairo; Damascus; and Hama. Cities are added one at a time.",
      },
    ],
  },
  cta: {
    title: "Where to?",
    body: "Pick a city and plan your next trip.",
  },
  footer: {
    tagline: "Making transportation easier wherever you go.",
    product: "Product",
    citiesTitle: "Cities",
    org: "Murtahil",
    beta: "beta",
    rights: "© 2026 Murtahil",
    mapCredit: "Screenshots show maps by MapTiler and Apple Maps, with data from OpenStreetMap contributors.",
  },
};

export type Dictionary = typeof en;

const ar: Dictionary = {
  meta: {
    title: "مرتحل: النقل العام في تسع مدن",
    description:
      "مسارات ومواعيد مغادرة وإرشاد خطوة بخطوة للمترو والحافلات والقطارات والعبّارات في الرياض وجدة ومكة والمدينة والمنطقة الشرقية والبحرين وإسطنبول وأنقرة والقاهرة ودمشق وحماة.",
  },
  skip: "انتقل إلى المحتوى",
  brand: { latin: "Murtahil", arabic: "مرتحل", home: "الصفحة الرئيسية لمرتحل" },
  nav: {
    cities: "المدن",
    features: "المزايا",
    apps: "التطبيقات",
    about: "عن مرتحل",
    faq: "الأسئلة",
    openApp: "افتح تطبيق الويب",
    soon: "قريبًا في {date}",
    menu: "افتح القائمة",
    close: "أغلق القائمة",
    theme: "بدّل بين الوضع الفاتح والداكن",
  },
  hero: {
    title: "نُسهّل التنقّل أينما ذهبت.",
    sub: "خطّط مسارك، واطّلع على مواعيد المغادرة، واتبع كل خطوة في المترو والحافلات والقطارات والعبّارات، في تسع مدن بخمس دول.",
    secondary: "تصفّح المدن",
    webAlt: "تطبيق مرتحل على الويب يخطط رحلة في الرياض: المسار الأزرق من المركز المالي إلى قصر الحكم في 32 دقيقة دون تبديل.",
    phoneAlt: "تطبيق مرتحل على آيفون يخطط رحلة على المسار الأزرق من المركز المالي إلى العود: 42 دقيقة دون تبديل.",
  },
  cities: {
    title: "تسع مدن في خمس دول",
    body: "التطبيق نفسه والشاشات نفسها في كل مدينة. اختر مدينة لترى ما يغطيه مرتحل فيها.",
    modes: "وسائل التنقّل",
    times: "الأوقات التي ستراها",
    plan: "خطّط لرحلة في {city}",
    liveInApps: "مباشر في التطبيقات",
    choose: "اختر مدينة",
  },
  times: {
    live: { name: "مباشر", body: "من البيانات اللحظية للمشغّل، ويتحدّث مع حركة المركبات." },
    predicted: { name: "متوقّع", body: "محسوب من مواقع المركبات ومن حركة السير المعتادة في تلك الساعة." },
    scheduled: { name: "مجدول", body: "من الجدول الرسمي، رحلةً رحلة." },
    estimated: { name: "تقديري", body: "من تواتر الخط، حيث لا يوجد جدول." },
  },
  problems: {
    eyebrow: "لماذا مرتحل",
    title: "التنقّل لا ينبغي أن يحتاج إلى بحث.",
    rows: [
      {
        problem: "لكل مدينة مكانها الخاص لمعلومات النقل.",
        answer: "يغطي مرتحل تسع مدن في خمس دول بالشاشات نفسها. بدّل المدينة، وكل ما اعتدت عليه يبقى كما هو.",
      },
      {
        problem: "رحلة واحدة قد تمرّ بثلاث جهات تشغيل.",
        answer: "يخطط مرتحل عبرها دفعة واحدة: مترو ثم مرمراي ثم عبّارة في إسطنبول، أو حافلة ثم قطار الحرمين من مكة إلى المدينة.",
      },
      {
        problem: "الجدول الزمني ليس هو الوقت الفعلي.",
        answer: "كل وقت موسوم بأنه مباشر أو متوقّع أو مجدول أو تقديري، فتعرف إلى أي حدّ تعتمد عليه.",
      },
      {
        problem: "بعض الشبكات لا خريطة رسمية لها أصلًا.",
        answer: "في دمشق وحماة تأتي خطوط السرافيس من خرائط رسمها المساهمون، حتى الأماكن التي يمكنك أن تلوّح فيها للسرفيس.",
      },
      {
        problem: "«كم الأجرة؟» كثيرًا ما يكون أصعب سؤال.",
        answer: "حيثما تُنشر الأجرة يعرضها مرتحل مع المسار، بالريال والدينار والجنيه والليرة، ومعها سقف بطاقة GO اليومي في البحرين.",
      },
    ],
  },
  features: {
    title: "مصمَّم للرحلة كلّها",
    body: "تطبيقا الهاتف لا يتوقفان عند رسم المسار، بل يرافقانك حتى تصل.",
    nav: {
      title: "خطوة بخطوة حتى تنزل",
      body: "امشِ، وانتظر، واركب، والمحطات تُعدّ تنازليًا. إرشاد صوتي بالعربية أو الإنجليزية أو التركية، ونافذة عائمة حين تنتقل إلى تطبيق آخر.",
      alt: "الملاحة المباشرة على المسار الأصفر لمترو الرياض: انزل بعد محطتين، والمتبقي 6.8 كم.",
    },
    track: {
      title: "حافلتك على شاشة القفل",
      body: "تابع الحافلة حتى موقفك، مع تنبيه قبل دقيقتين وقبل دقيقة وعند الوصول. وإن خرجت عن مسارها أو تجاوزت موقفك، ستعرف.",
      badge: "بريميوم",
      alt: "بطاقة تتبع من تطبيق أندرويد: الحافلة A1 إلى مطار البحرين الدولي تصل بعد 4 دقائق.",
    },
    assistant: {
      title: "اسأل بكلماتك",
      body: "أخبر المساعد إلى أين تتجه، فيخطط المسار، ويتحقق من مواعيد الوصول، ويحفظ الأماكن لك.",
      alt: "المساعد يخطط رحلة إلى برج الفيصلية في الرياض: 29 دقيقة على المسارين البنفسجي والأزرق.",
    },
    arrivals: {
      title: "مواعيد المغادرة بالعدّ التنازلي",
      body: "صفحة كل محطة تعرض المغادرات القادمة لكل خط، مباشرةً حيث تتيح المدينة ذلك.",
      alt: "مواعيد الوصول المباشرة في محطة أكسراي بإسطنبول: قطارات M1A وM1B بعد 1 و4 و6 و9 دقائق.",
    },
    share: {
      title: "دبوس الموقع وجهة جاهزة",
      body: "شارك الدبوس من واتساب أو الرسائل أو تطبيق خرائط إلى مرتحل مباشرة.",
    },
    shareRoute: {
      title: "المسار خطة جاهزة للمشاركة",
      body: "أرسل أي مسار نصًّا واضحًا خطوة بخطوة، بخطوطه ومحطاته وأوقاته، إلى واتساب أو الرسائل.",
    },
  },
  timesSection: {
    title: "كل وقت يخبرك من أين جاء",
    body: "بعض المدن تتيح بيانات مباشرة، وبعضها ينشر جداول، وبعضها لا يذكر إلا تواتر الخط. يَسِم مرتحل كل وقت لتفرّق بينها.",
    caption: "لوحة توضيحية، والخطوط والأوقات للتمثيل فقط.",
    board: [
      { badge: "231", color: "#750025", dest: "الميقات", place: "المدينة، الفيصلية", time: "4 د", kind: "live" },
      { badge: "M5", color: "#6d3d8c", dest: "أوسكودار", place: "إسطنبول، الرصيف 1", time: "3 د", kind: "predicted" },
      { badge: "A1", color: "#B3462E", dest: "مطار البحرين الدولي", place: "البحرين، مدينة عيسى", time: "15:44", kind: "scheduled" },
      { badge: "D01", color: "#1A7F8E", dest: "العباسيين", place: "دمشق، البرامكة", time: "نحو 6 د", kind: "estimated" },
    ],
  },
  languages: {
    title: "ثلاث لغات، بصوت واحد",
    body: "كل شاشة تعمل بالعربية والإنجليزية والتركية. والعربية ليست ترجمة فحسب: الواجهة تنعكس من اليمين إلى اليسار، والأرقام تبقى سهلة القراءة.",
    samples: [
      { lang: "ar", name: "العربية", text: "العبّارة التالية إلى كاديكوي تنطلق بعد 4 دقائق." },
      { lang: "en", name: "English", text: "The next ferry to Kadıköy leaves in 4 minutes." },
      { lang: "tr", name: "Türkçe", text: "Kadıköy’e bir sonraki vapur 4 dakika sonra kalkıyor." },
    ],
  },
  apps: {
    title: "على الويب اليوم، وعلى هاتفك قريبًا.",
    body: "تطبيق الويب يغطي كل المدن الآن، وعلى أي شاشة. وتطبيقا آيفون وأندرويد في المرحلة التجريبية، والإطلاق في المتاجر قريبًا.",
    available: "متاح الآن",
    titleSoon: "على الويب أولًا، وعلى هاتفك قريبًا.",
    bodySoon:
      "يُفتح تطبيق الويب في 30 نوفمبر 2026 بالمدن التسع، وعلى أي شاشة. وتطبيقا آيفون وأندرويد في المرحلة التجريبية، والإطلاق في المتاجر قريبًا.",
    comingSoon: "قريبًا",
    beta: "تجريبي",
    items: [
      { key: "web", name: "تطبيق الويب", body: "خطّط رحلاتك، واطّلع على المغادرات، وتصفّح الخطوط في أي متصفح حديث، على الحاسوب أو الهاتف." },
      { key: "ios", name: "آيفون وآيباد", body: "الأنشطة المباشرة والجزيرة الديناميكية تُبقيان رحلتك وحافلتك على شاشة القفل." },
      { key: "android", name: "أندرويد وWear OS", body: "بطاقة تتبع على شاشة القفل، وتطبيق للساعة فيه أماكنك المحفوظة والمحطات القريبة." },
    ],
    alt: "تطبيق الويب في إسطنبول: من كاديكوي إلى تقسيم بالعبّارة عبر البوسفور إلى كاباتاش، ثم مشيًا لمسافة قصيرة.",
  },
  about: {
    eyebrow: "عن مرتحل",
    title: "المرتحل هو من ألِف الترحال",
    body: [
      "يتنقّل بارتياح أينما ذهب. وشعارنا برج المملكة في الرياض والمترو يعبر فتحته: معلم تهتدي به، ورحلة تمرّ من خلاله.",
      "بدأ مرتحل في الرياض، ثم كبر مدينةً بعد مدينة. وتنال كل مدينة العناية نفسها: نجمع ما هو منشور، ونسدّ الثغرات، ونطابقه مع الواقع، ونقول بوضوح ما هو تقديري.",
    ],
    markAlt: "شعار مرتحل: برج المملكة والمترو يعبر فتحته.",
    dataTitle: "من أين تأتي البيانات",
    data: [
      "الجداول والبيانات اللحظية التي ينشرها مشغّلو النقل",
      "بيانات الخرائط المستمدة من مشاريع مفتوحة المصدر",
      "الخطوط التي رسمها أفراد مساهمين محليين",
      "تحقّقنا الخاص، مثل مطابقة ترتيب المواقف مع مواقع الحافلات المباشرة",
    ],
  },
  faq: {
    title: "أسئلة شائعة",
    items: [
      {
        q: "هل مرتحل مجاني؟",
        a: "نعم. تطبيق الويب مجاني، ولتطبيقي الهاتف خطة مجانية مع إعلانات. وستضيف خطة بريميوم التتبع على شاشة القفل والتحدّث صوتيًا مع المساعد، والترقية إليها غير متاحة بعد.",
      },
      {
        q: "متى أستطيع تنزيل تطبيقي الهاتف؟",
        a: "تطبيقا آيفون وأندرويد حاليا في المرحلة التجريبية المغلقة، والإطلاق في المتاجر قريبًا..",
        aSoon:
          "تطبيقا يفون وأندرويد حاليا في المرحلة التجريبية المغلقة. ويُفتح تطبيق في المتاجر بالمدن التسع نفسها، في 30 نوفمبر 2026.",
      },
      {
        q: "هل الأوقات مباشرة؟",
        a: "نعم في سبع من المدن التسع. تعرض تطبيقات الهاتف أوقاتًا مباشرة في الرياض، وجدة ومكة والمدينة، والمنطقة الشرقية، والبحرين، وإسطنبول، وأنقرة، والقاهرة. أما في دمشق وحماة فالأوقات تقديرية من تواتر الخط. وكل وقت موسوم بمصدره لتعرف الفرق.",
      },
      {
        q: "ما اللغات المتاحة؟",
        a: "العربية والإنجليزية والتركية، على الويب وفي تطبيقي الهاتف. والإرشاد الصوتي في تطبيقي الهاتف متاح باللغات الثلاث.",
      },
      {
        q: "ما المدن التي يغطيها؟",
        a: "الرياض، وجدة ومكة والمدينة، والمنطقة الشرقية، والبحرين، وإسطنبول، وأنقرة، والقاهرة، ودمشق، وحماة. ونضيف المدن واحدة تلو الأخرى.",
      },
    ],
  },
  cta: {
    title: "إلى أين؟",
    body: "اختر مدينتك وخطّط لرحلتك القادمة.",
  },
  footer: {
    tagline: "نُسهّل التنقّل أينما ذهبت.",
    product: "المنتج",
    citiesTitle: "المدن",
    org: "مرتحل",
    beta: "تجريبي",
    rights: "© 2026 مرتحل",
    mapCredit: "تتضمن لقطات الشاشة خرائط من MapTiler وخرائط Apple، ببيانات من مساهمي OpenStreetMap.",
  },
};

// Turkish follows the apps’ own Turkish: the web app’s labels for the four kinds of time (canlı,
// tahmini, tarifeli, yaklaşık) and its names for modes and cities, and the apps’ tagline.
const tr: Dictionary = {
  meta: {
    title: "Murtahil: dokuz şehirde toplu taşıma",
    description:
      "Riyad, Cidde, Mekke, Medine, Doğu Bölgesi, Bahreyn, İstanbul, Ankara, Kahire, Şam ve Hama’da metro, otobüs, tren ve vapur için rotalar, kalkış saatleri ve adım adım yol tarifi.",
  },
  skip: "İçeriğe geç",
  brand: { latin: "Murtahil", arabic: "مرتحل", home: "Murtahil ana sayfası" },
  nav: {
    cities: "Şehirler",
    features: "Özellikler",
    apps: "Uygulamalar",
    about: "Hakkında",
    faq: "SSS",
    openApp: "Web uygulamasını aç",
    soon: "Açılış {date}",
    menu: "Menüyü aç",
    close: "Menüyü kapat",
    theme: "Açık ve koyu tema arasında geçiş yap",
  },
  hero: {
    title: "Nereye giderseniz gidin, ulaşımı kolaylaştırıyoruz.",
    sub: "Metro, otobüs, tren ve vapurda rotanızı planlayın, kalkış saatlerini görün ve her adımı takip edin. Beş ülkede, dokuz şehirde.",
    secondary: "Şehirlere göz at",
    webAlt:
      "Murtahil web uygulaması Riyad’da bir yolculuk planlıyor: KAFD’den Qasr Al Hokm’a Mavi Hat, aktarmasız 32 dakika.",
    phoneAlt: "Murtahil iPhone uygulaması KAFD’den Al Owd’a Mavi Hat ile bir yolculuk planlıyor: aktarmasız 42 dakika.",
  },
  cities: {
    title: "Beş ülkede dokuz şehir",
    body: "Hepsinde aynı uygulama, aynı ekranlar. Murtahil’in bir şehirde neleri kapsadığını görmek için o şehri seçin.",
    modes: "Ulaşım türleri",
    times: "Göreceğiniz saatler",
    plan: "{city} için yolculuk planla",
    liveInApps: "Uygulamalarda canlı",
    choose: "Bir şehir seçin",
  },
  times: {
    live: { name: "Canlı", body: "İşletmecinin anlık verisinden gelir ve araçlar ilerledikçe güncellenir." },
    predicted: { name: "Tahmini", body: "Araçların konumundan ve o saatte trafiğin genellikle nasıl aktığından hesaplanır." },
    scheduled: { name: "Tarifeli", body: "Resmî tarifeden, sefer sefer." },
    estimated: { name: "Yaklaşık", body: "Tarifenin olmadığı yerlerde, hattın ne sıklıkla çalıştığından." },
  },
  problems: {
    eyebrow: "Neden yaptık",
    title: "Bir yere gitmek araştırma gerektirmemeli.",
    rows: [
      {
        problem: "Her şehir ulaşım bilgisini başka bir yerde tutuyor.",
        answer: "Murtahil beş ülkede dokuz şehri aynı ekranlarla kapsar. Şehir değiştirin, öğrendiğiniz her şey yine işe yarar.",
      },
      {
        problem: "Tek bir yolculuk üç farklı işletmeci demek olabilir.",
        answer: "Murtahil hepsini tek seferde planlar: İstanbul’da metro, Marmaray ve vapur ya da Mekke’den Medine’ye otobüs ve Haremeyn treni.",
      },
      {
        problem: "Tarifedeki saat, gerçek saat demek değil.",
        answer: "Her saat canlı, tahmini, tarifeli ya da yaklaşık olarak etiketlenir; ona ne kadar güvenebileceğinizi bilirsiniz.",
      },
      {
        problem: "Bazı ağların hiç resmî haritası yok.",
        answer: "Şam ve Hama’da dolmuş hatları topluluğun haritalamasından gelir, el kaldırıp binebileceğiniz noktalar dahil.",
      },
      {
        problem: "“Ne kadar?” çoğu zaman en zor soru.",
        answer: "Ücretlerin yayımlandığı yerlerde Murtahil onları rotayla birlikte riyal, dinar ve Mısır lirası cinsinden gösterir; Bahreyn’deki GO Card günlük tavanı dahil.",
      },
    ],
  },
  features: {
    title: "Yolculuğun tamamı için",
    body: "Telefon uygulamaları rotayı gösterip bırakmaz. Varana kadar yanınızdadır.",
    nav: {
      title: "İnene kadar adım adım",
      body: "Yürüyün, bekleyin, binin ve yolculuk edin; duraklar geri sayılır. Arapça, İngilizce ya da Türkçe sesli yönlendirme ve başka bir uygulamaya geçtiğinizde yüzen bir pencere.",
      alt: "Riyad Metrosu Sarı Hat’ta canlı navigasyon: 2 durak sonra inin, 6,8 km kaldı.",
    },
    track: {
      title: "Otobüsünüz kilit ekranında",
      body: "Durağınıza gelen otobüsü takip edin; iki dakika kala, bir dakika kala ve varışta bir zil çalar. Güzergâhından çıkarsa ya da durağınızı atlarsa haberiniz olur.",
      badge: "Premium",
      alt: "Android uygulamasından takip kartları: 4 dakika uzaktaki bir otobüs, güzergâhından çıkmış bir otobüs ve binildi olarak işaretlenmiş bir yolculuk.",
    },
    assistant: {
      title: "Kendi kelimelerinizle sorun",
      body: "Asistana nereye gittiğinizi söyleyin. Rotayı planlar, varışları kontrol eder ve yerleri sizin için kaydeder.",
      alt: "Asistan Riyad’da Al Faisaliah Kulesi’ne bir yolculuk planlıyor: Mor ve Mavi hatlarla 29 dakika.",
    },
    arrivals: {
      title: "Geri sayan kalkışlar",
      body: "İstasyon sayfaları her hattın sonraki kalkışlarını listeler; şehir paylaşıyorsa canlı.",
      alt: "İstanbul Aksaray’da canlı varışlar: M1A ve M1B trenleri 1, 4, 6 ve 9 dakika sonra.",
    },
    share: {
      title: "Bir konum, hazır bir varış noktası",
      body: "WhatsApp’tan, Mesajlar’dan ya da bir harita uygulamasından bir konumu doğrudan Murtahil’e paylaşın.",
    },
    shareRoute: {
      title: "Rotanız, paylaşılabilir bir plan",
      body: "Herhangi bir rotayı hatları, durakları ve saatleriyle adım adım, açık bir metin olarak WhatsApp’a ya da Mesajlar’a gönderin.",
    },
  },
  timesSection: {
    title: "Her saat nereden geldiğini söyler",
    body: "Bazı şehirler canlı veri paylaşır. Bazıları tarife yayımlar ya da yalnızca bir hattın ne sıklıkla çalıştığını. Murtahil her saati etiketler, böylece aralarındaki farkı görürsünüz.",
    caption: "Örnek bir pano. Hatlar ve saatler temsilîdir.",
    board: [
      { badge: "231", color: "#750025", dest: "Al Miqat", place: "Medine, Al Faisaliyah", time: "4 dk", kind: "live" },
      { badge: "M5", color: "#6d3d8c", dest: "Üsküdar", place: "İstanbul, 1. peron", time: "3 dk", kind: "predicted" },
      { badge: "A1", color: "#B3462E", dest: "Bahreyn Uluslararası Havalimanı", place: "Bahreyn, Isa Town", time: "15:44", kind: "scheduled" },
      { badge: "D01", color: "#1A7F8E", dest: "Abbasiyyin", place: "Şam, Baramkeh", time: "yaklaşık 6 dk", kind: "estimated" },
    ],
  },
  languages: {
    title: "Üç dil, tek ses",
    body: "Her ekran Arapça, İngilizce ve Türkçe çalışır. Arapça yalnızca çevrilmekle kalmaz: düzen sağdan sola döner ve rakamlar kolay okunur.",
    samples: [
      { lang: "tr", name: "Türkçe", text: "Kadıköy’e bir sonraki vapur 4 dakika sonra kalkıyor." },
      { lang: "en", name: "English", text: "The next ferry to Kadıköy leaves in 4 minutes." },
      { lang: "ar", name: "العربية", text: "العبّارة التالية إلى كاديكوي تنطلق بعد 4 دقائق." },
    ],
  },
  apps: {
    title: "Bugün web’de. Yakında telefonunuzda.",
    body: "Web uygulaması şimdiden her şehri, her ekranda kapsıyor. iPhone ve Android uygulamaları beta aşamasında; mağaza sürümü yakında.",
    available: "Kullanıma açık",
    titleSoon: "Önce web’de. Yakında telefonunuzda.",
    bodySoon:
      "Web uygulaması 30 Kasım 2026’da dokuz şehrin tamamıyla, her ekranda açılıyor. iPhone ve Android uygulamaları beta aşamasında; mağaza sürümü yakında.",
    comingSoon: "Yakında",
    beta: "Yakında",
    items: [
      { key: "web", name: "Web uygulaması", body: "Herhangi bir modern tarayıcıda, bilgisayarda ya da telefonda yolculuk planlayın, kalkışları görün ve hatlara göz atın." },
      { key: "ios", name: "iPhone ve watchOS", body: "Canlı Etkinlikler ve Dynamic Island, yolculuğunuzu ve otobüsünüzü kilit ekranında tutar." },
      { key: "android", name: "Android ve Wear OS", body: "Kilit ekranında bir takip kartı ve kayıtlı yerlerinizle yakındaki istasyonları gösteren bir saat uygulaması." },
    ],
    alt: "İstanbul’da web uygulaması: Kadıköy’den Taksim’e, Boğaz’ı vapurla geçip Kabataş’a, ardından kısa bir yürüyüş.",
  },
  about: {
    eyebrow: "Hakkında",
    title: "Murtahil, yolcu demektir",
    body: [
      "Yolda olmaktan keyif alan biri. Logomuz, Riyad’daki Kingdom Centre ve açıklığından geçen metro: yönünüzü bulduğunuz bir simge ve içinden geçen yolculuk.",
      "Murtahil Riyad’da başladı ve şehir şehir büyüdü. Her şehir aynı özeni görür: yayımlananı topluyoruz, boşlukları dolduruyoruz, sahada kontrol ediyoruz ve neyin tahmin olduğunu açıkça söylüyoruz.",
    ],
    markAlt: "Murtahil logosu: açıklığından metro geçen Kingdom Centre.",
    dataTitle: "Veriler nereden geliyor",
    data: [
      "Ulaşım işletmecilerinin yayımladığı tarifeler ve anlık veriler",
      "Açık kaynak projelerden harita verileri",
      "Topluluğun haritaladığı hatlar",
      "Durak sırasını canlı otobüs konumlarıyla karşılaştırmak gibi kendi kontrollerimiz",
    ],
  },
  faq: {
    title: "Sorular",
    items: [
      {
        q: "Murtahil ücretsiz mi?",
        a: "Evet. Web uygulaması ücretsiz; telefon uygulamalarının da reklamlı, ücretsiz bir planı var. Premium plan kilit ekranında takip ve asistanla sesli sohbet ekleyecek; yükseltmeler henüz açık değil.",
      },
      {
        q: "Telefon uygulamalarını ne zaman indirebilirim?",
        a: "iPhone ve Android uygulamaları şu anda kapalı beta aşamasında ve mağaza sürümü yakında. O zamana kadar web uygulaması aynı dokuz şehri kapsıyor.",
        aSoon:
          "iPhone ve Android uygulamaları şu anda beta aşamasında ve mağaza sürümü yakında. Aynı dokuz şehri kapsayan web uygulaması 30 Kasım 2026’da açılıyor.",
      },
      {
        q: "Saatler canlı mı?",
        a: "Dokuz şehrin yedisinde evet. Telefon uygulamaları Riyad’da; Cidde, Mekke ve Medine’de; Doğu Bölgesi’nde; Bahreyn’de; İstanbul’da; Ankara’da ve Kahire’de canlı saat gösterir. Şam ve Hama’da saatler, hattın ne sıklıkla çalıştığından tahmin edilir. Her saat etiketlidir, farkı görürsünüz.",
      },
      {
        q: "Hangi dilleri konuşuyor?",
        a: "Arapça, İngilizce ve Türkçe; hem web’de hem iki telefon uygulamasında. Telefon uygulamalarındaki sesli yol tarifi üç dilde de çalışır.",
      },
      {
        q: "Hangi şehirleri kapsıyor?",
        a: "Riyad; Cidde, Mekke ve Medine; Doğu Bölgesi; Bahreyn; İstanbul; Ankara; Kahire; Şam ve Hama. Şehirler birer birer eklenir.",
      },
    ],
  },
  cta: {
    title: "Nereye?",
    body: "Bir şehir seçin ve sonraki yolculuğunuzu planlayın.",
  },
  footer: {
    tagline: "Nereye giderseniz gidin, ulaşımı kolaylaştırıyoruz.",
    product: "Ürün",
    citiesTitle: "Şehirler",
    org: "Murtahil",
    beta: "beta",
    rights: "© 2026 Murtahil",
    mapCredit: "Ekran görüntülerinde MapTiler ve Apple Haritalar’ın haritaları ile OpenStreetMap katkıcılarının verileri yer alır.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ar, tr };
