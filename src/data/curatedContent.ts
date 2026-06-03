import type { ArticleItem, Category, NewsItem, Poll, SearchResult, TagItem, Writer } from '@/types/api';

export type CuratedNewsItem = NewsItem & { priority?: 'breaking' | 'featured' | 'editors_pick' | 'trending' | 'normal' };

const image = {
  water: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  solar: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
  roads: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  humanitarian: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
  education: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  health: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
  economy: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80',
  sports: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  tech: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  culture: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
};

export const fallbackCategories: Category[] = [
  { id: 1, name: 'أخبار محلية', slug: 'اخبار-محلية', color: '#1E40AF', news_count: 3 },
  { id: 2, name: 'سياسة', slug: 'سياسة', color: '#DC2626', news_count: 3 },
  { id: 3, name: 'اقتصاد', slug: 'اقتصاد', color: '#059669', news_count: 3 },
  { id: 4, name: 'مجتمع', slug: 'مجتمع', color: '#7C3AED', news_count: 3 },
  { id: 5, name: 'رياضة', slug: 'رياضة', color: '#EA580C', news_count: 3 },
  { id: 6, name: 'تكنولوجيا', slug: 'تكنولوجيا', color: '#2563EB', news_count: 3 },
  { id: 7, name: 'ثقافة وفن', slug: 'ثقافة-وفن', color: '#DB2777', news_count: 3 },
  { id: 8, name: 'تحقيقات', slug: 'تحقيقات', color: '#4B5563', news_count: 3 },
  { id: 9, name: 'تقارير مصورة', slug: 'تقارير-مصورة', color: '#0891B2', news_count: 3 },
  { id: 10, name: 'منوعات', slug: 'منوعات', color: '#F59E0B', news_count: 3 },
];

const categoryBySlug = new Map(fallbackCategories.map((category) => [category.slug as string, category]));
const writer = { id: 1, name: 'فريق الضالع أونلاين', bio: 'فريق تحرير يرصد الأخبار من مصادر عامة موثوقة ويعيد صياغتها تحريريا.' };

function html(lead: string, points: string[], source: string, url: string) {
  return `<p>${lead}</p><ul>${points.map((point) => `<li>${point}</li>`).join('')}</ul><p><strong>مصدر المعلومات:</strong> ${source} - ${url}</p>`;
}

function news(index: number, item: {
  category: string;
  title: string;
  slug: string;
  excerpt: string;
  lead: string;
  points: string[];
  source: string;
  url: string;
  image: keyof typeof image;
  priority?: CuratedNewsItem['priority'];
  location?: string;
}): CuratedNewsItem {
  const category = categoryBySlug.get(item.category) || fallbackCategories[0];
  return {
    id: -(index + 1),
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: html(item.lead, item.points, item.source, item.url),
    main_image: image[item.image],
    thumbnail: image[item.image],
    category,
    writer,
    source: { name: item.source, url: item.url },
    stats: { views: 2200 + index * 137, comments: (index * 3) % 41, shares: 40 + index },
    reading_time: { formatted: '6 دقائق' },
    published_date: '2026-06-03',
    published_diff: index < 5 ? 'منذ ساعات' : 'منذ أيام',
    priority: item.priority || 'normal',
  };
}

export const fallbackNews: CuratedNewsItem[] = [
  news(0, {
    category: 'اخبار-محلية',
    title: 'مشروع طاقة شمسية يعزز ضخ المياه في قرى حجر وسناح بالضالع',
    slug: 'مشروع-طاقة-شمسية-حجر-وسناح',
    excerpt: 'منظومة شمسية بقدرة تقارب 280 كيلوواط تفتح بابا عمليا لتخفيف أزمة المياه والوقود.',
    lead: 'أعادت مشاريع الطاقة الشمسية الصغيرة طرح سؤال الخدمات الأساسية في الضالع من زاوية عملية: كيف يمكن لمضخات المياه أن تستمر عندما تتراجع الكهرباء والوقود؟',
    points: ['المشروع يقلل توقف الضخ ويخفض كلفة الديزل على الأهالي.', 'الأثر الأكبر يظهر في القرى التي تعتمد على آبار عميقة وشبكات طويلة.', 'تظل الصيانة وحماية الألواح وشفافية التشغيل شروطا لاستدامة الأثر.'],
    source: 'عدن تايم',
    url: 'https://www.aden-tm.net/news/310068',
    image: 'solar',
    priority: 'featured',
  }),
  news(1, {
    category: 'اخبار-محلية',
    title: 'خزان مياه جديد في لكمة الدوكي يفتح نافذة أمل للأهالي',
    slug: 'خزان-مياه-لكمة-الدوكي',
    excerpt: 'خزان بسعة 125 مترا مكعبا يعكس حاجة المناطق الريفية إلى تخزين وتوزيع أكثر استدامة.',
    lead: 'في المناطق الجبلية لا تعني المياه وجود بئر فقط، بل وجود تخزين آمن وشبكة توزيع قادرة على إيصال المياه للأسر.',
    points: ['الخزان يساعد على تنظيم التوزيع وتقليل الاعتماد على الصهاريج.', 'السعة التخزينية تمنح المجتمع هامشا للتعامل مع الأعطال.', 'ينبغي نشر جدول تشغيل وآلية رقابة مجتمعية لضمان العدالة.'],
    source: 'صوت الضالع',
    url: 'https://sautaldalea.com/archives/94557',
    image: 'water',
  }),
  news(2, {
    category: 'اخبار-محلية',
    title: 'أضرار الأمطار في طريق الحقل وبن عواس تعيد ملف طرق الأزارق إلى الواجهة',
    slug: 'اضرار-طريق-الحقل-بن-عواس-الازارق',
    excerpt: 'انزلاقات صخرية في الأزارق تبرز حاجة الطرق الجبلية إلى صيانة وقائية قبل موسم الأمطار.',
    lead: 'تفقد مسؤول محلي أضرارا لحقت بالطريق الرابط بين منطقة الحقل وجبل بن عواس وعدد من القرى الريفية بعد أمطار غزيرة.',
    points: ['الطريق الريفي هو ممر المريض والطالب والسلعة إلى السوق.', 'مصارف المياه والصيانة الوقائية أقل كلفة من الإصلاح الطارئ.', 'توثيق النقاط المتضررة بالصور والإحداثيات يساعد على ترتيب الأولويات.'],
    source: 'وكالة سبأ عبر نبض',
    url: 'https://nabd.com/s/123302285-9b7919/',
    image: 'roads',
  }),
  news(3, {
    category: 'سياسة',
    title: 'اتفاق أممي جديد لتبادل 1600 محتجز ينعش ملف الثقة في اليمن',
    slug: 'اتفاق-اممي-تبادل-1600-محتجز',
    excerpt: 'ملف المحتجزين يعود كبوابة إنسانية وسياسية يمكن أن تفتح الطريق أمام خطوات أوسع في مسار السلام.',
    lead: 'أعلنت الأمم المتحدة في 14 مايو 2026 أن الأطراف اليمنية توصلت إلى اتفاق لإطلاق سراح أكثر من 1600 محتجز.',
    points: ['نجاح الإفراج يعطي العائلات أملا مباشرا ومؤشرا على قابلية التنفيذ.', 'الملف إنساني في جوهره لكنه سياسي في أثره على بناء الثقة.', 'التنفيذ يحتاج قوائم دقيقة وآليات تحقق وضمانات تمنع الانتقائية.'],
    source: 'الأمم المتحدة - جنيف',
    url: 'https://www.ungeneva.org/en/news-media/news/2026/05/118661/yemen-parties-agree-under-un-mediation-release-1600-detainees',
    image: 'humanitarian',
    priority: 'breaking',
  }),
  news(4, {
    category: 'سياسة',
    title: 'المبعوث الأممي يحذر من هشاشة الهدوء ويدعو لمسار يمني شامل',
    slug: 'المبعوث-الاممي-هشاشة-الهدوء',
    excerpt: 'التهدئة لا تكفي من دون عملية سياسية جامعة تراعي الاقتصاد والخدمات والأمن المحلي.',
    lead: 'تؤكد إحاطات مكتب المبعوث الأممي أن أي هدوء ميداني يظل هشا ما لم يتحول إلى عملية سياسية جامعة.',
    points: ['المسار السياسي يقاس بقدرته على خفض التوتر في المحافظات.', 'الخدمات والرواتب والأسعار تتحول بسرعة إلى مطالب سياسية.', 'الضالع تحتاج تهدئة أمنية وتنمية خدمية في الوقت نفسه.'],
    source: 'مكتب المبعوث الخاص للأمين العام إلى اليمن',
    url: 'https://osesgy.unmissions.org/',
    image: 'default',
    priority: 'featured',
  }),
  news(5, {
    category: 'سياسة',
    title: 'التوتر في الجنوب يعيد سؤال الإدارة المحلية والخدمات إلى المقدمة',
    slug: 'التوتر-في-الجنوب-والادارة-المحلية',
    excerpt: 'في الجنوب اليمني يتداخل السياسي بالخدمي، وتصبح الكهرباء والمياه والرواتب جزءا من النقاش العام.',
    lead: 'لا تظهر السياسة في المحافظات الجنوبية عبر الخطابات فقط؛ تظهر كذلك في طوابير الوقود وفواتير النقل وشكاوى المستشفيات.',
    points: ['تراجع الخدمات يرفع حدة التنافس السياسي.', 'نشر بيانات الإيرادات والمشاريع يقلل فراغ المعلومة.', 'كل نقاش سياسي بلا خطة خدمات قابلة للقياس يبقى بعيدا عن الناس.'],
    source: 'الأمم المتحدة - ملف اليمن',
    url: 'https://press.un.org/en/yemen',
    image: 'roads',
  }),
  news(6, {
    category: 'اقتصاد',
    title: 'البنك الدولي: الاقتصاد اليمني ما زال تحت ضغط الحرب وانقسام المؤسسات',
    slug: 'البنك-الدولي-الاقتصاد-اليمني-تحت-ضغط',
    excerpt: 'تحديثات البنك الدولي تشرح لماذا يشعر المواطن بضغط الأسعار حتى عند استقرار بعض السلع مؤقتا.',
    lead: 'يربط البنك الدولي تدهور الاقتصاد اليمني باستمرار الصراع وانقسام المؤسسات وتراجع الإيرادات العامة.',
    points: ['تراجع النشاط الاقتصادي يعني فرص عمل أقل للشباب.', 'تذبذب العملة ينعكس على الغذاء والدواء والوقود.', 'تحتاج الأسواق المحلية إلى نشر أسعار يومية موثقة للسلع والعملات.'],
    source: 'البنك الدولي',
    url: 'https://www.worldbank.org/en/news/press-release/2026/05/21/economic-strain-deepens-in-yemen-as-regional-risks-intensify',
    image: 'economy',
    priority: 'featured',
  }),
  news(7, {
    category: 'اقتصاد',
    title: 'الأمن الغذائي في اليمن يضغط على موائد الأسر في الضالع',
    slug: 'الامن-الغذائي-يضغط-على-اسر-الضالع',
    excerpt: 'تقارير الأمن الغذائي تكشف أن أزمة الطعام لم تعد رقما وطنيا بعيدا، بل معادلة يومية داخل كل بيت.',
    lead: 'توضح تحديثات IPC أن ملايين اليمنيين يواجهون مستويات مرتفعة من انعدام الأمن الغذائي في مناطق الحكومة المعترف بها.',
    points: ['الأسر الفقيرة تتأثر بسعر الدقيق والزيت والغاز أولا.', 'تراجع المساعدات أو تأخرها يضاعف ضغط الأسواق.', 'الزراعة المنزلية ودعم صغار المنتجين قد يخففان بعض الضغط.'],
    source: 'IPC',
    url: 'https://www.ipcinfo.org/ipc-country-analysis/details-map/en/c/1163308/?iso3=YEM',
    image: 'humanitarian',
    priority: 'trending',
  }),
  news(8, {
    category: 'اقتصاد',
    title: 'أسعار النقل والوقود تضاعف كلفة الوصول إلى الخدمات في مديريات الضالع',
    slug: 'اسعار-النقل-والوقود-في-الضالع',
    excerpt: 'ارتفاع النقل ليس رقما في السوق فقط؛ إنه حاجز بين المواطن والمدرسة والمشفى وفرصة العمل.',
    lead: 'تظهر كلفة الوقود والنقل في الضالع كعامل اقتصادي واجتماعي في الوقت نفسه.',
    points: ['الطرق الجبلية تزيد استهلاك الوقود وأعطال المركبات.', 'تحسين الطرق الريفية سياسة اقتصادية لا مشروع نقل فقط.', 'قياس الأسعار يجب أن يشمل كلفة النقل بين المديريات.'],
    source: 'برنامج الأغذية العالمي',
    url: 'https://www.wfp.org/countries/yemen',
    image: 'roads',
  }),
  news(9, {
    category: 'مجتمع',
    title: 'اليونيسف: ملايين الأطفال في اليمن يحتاجون دعما تعليميا عاجلا',
    slug: 'اليونيسف-التعليم-في-اليمن',
    excerpt: 'أرقام التعليم تكشف أن المدرسة أصبحت خط دفاع اجتماعي أمام الفقر والنزوح والعمل المبكر.',
    lead: 'تؤكد اليونيسف أن ملايين الأطفال في سن الدراسة في اليمن يحتاجون إلى دعم تعليمي مستمر.',
    points: ['تراجع دخل الأسر يدفع بعض الطلاب إلى العمل أو الانقطاع.', 'المدرسة تحتاج ماء وصرفا صحيا وكهرباء ومقاعد.', 'المعالجة الجادة تبدأ من خريطة مدرسية تكشف الاحتياج في كل مديرية.'],
    source: 'اليونيسف',
    url: 'https://www.unicef.org/yemen/education',
    image: 'education',
    priority: 'featured',
  }),
  news(10, {
    category: 'مجتمع',
    title: 'احتياجات المياه والصرف الصحي تجعل الوقاية الصحية أولوية في الضالع',
    slug: 'المياه-والصرف-الصحي-والوقاية',
    excerpt: 'الوقاية من الأوبئة تبدأ من نقطة ماء آمنة وصرف صحي ورسائل توعية تصل إلى القرى.',
    lead: 'تربط اليونيسف بين ضعف خدمات المياه والصرف الصحي وزيادة مخاطر الأمراض المنقولة بالماء في اليمن.',
    points: ['المياه غير الآمنة قد تحول أزمة الخدمة إلى أزمة صحية.', 'نقاط الكلور والتوعية بالنظافة أدوات وقاية منخفضة الكلفة.', 'المدارس والمخيمات والأسواق تحتاج مرافق صحية تعمل باستمرار.'],
    source: 'اليونيسف - المياه والإصحاح',
    url: 'https://www.unicef.org/yemen/water-sanitation-and-hygiene',
    image: 'water',
  }),
  news(11, {
    category: 'مجتمع',
    title: 'منظمة الصحة العالمية تطلب تمويلا عاجلا لدعم الخدمات الصحية في اليمن',
    slug: 'منظمة-الصحة-تمويل-عاجل-اليمن',
    excerpt: 'تراجع التمويل الصحي ينعكس على توفر الدواء واللقاحات وخدمات الطوارئ في المحافظات.',
    lead: 'أعلنت منظمة الصحة العالمية احتياجها إلى تمويل عاجل لدعم تدخلاتها الصحية في اليمن خلال 2026.',
    points: ['نقص التمويل يعني نقص أدوية وتراجع قدرة المرافق على استقبال الحالات.', 'برامج التحصين ومراقبة الأوبئة تحتاج استمرارا.', 'المناطق البعيدة تحتاج عيادات متنقلة وإحالة طبية منظمة.'],
    source: 'منظمة الصحة العالمية',
    url: 'https://www.who.int/publications/m/item/yemen--who-health-emergency-appeal-2026',
    image: 'health',
  }),
  news(12, {
    category: 'رياضة',
    title: 'المنتخب اليمني يواصل مشوار تصفيات كأس آسيا وسط آمال جماهيرية واسعة',
    slug: 'المنتخب-اليمني-تصفيات-كاس-اسيا',
    excerpt: 'كرة القدم تظل مساحة فرح نادرة وحديثا مشتركا في بيوت ومقاهي اليمنيين.',
    lead: 'تمنح مباريات المنتخب اليمني في التصفيات الآسيوية مساحة متابعة تتجاوز الرياضة.',
    points: ['الاستحقاقات الآسيوية تمنح اللاعبين الشباب فرصة احتكاك دولي.', 'الجمهور يتابع المنتخب كرمز وطني يتجاوز الانقسام.', 'الكرة اليمنية تحتاج دوريات مستقرة ورعاية للفئات السنية.'],
    source: 'الاتحاد الآسيوي لكرة القدم',
    url: 'https://www.the-afc.com/en/national/afc_asian_cup.html',
    image: 'sports',
    priority: 'featured',
  }),
  news(13, {
    category: 'رياضة',
    title: 'دوريات المدارس في الضالع يمكن أن تكون بوابة لاكتشاف المواهب',
    slug: 'دوريات-المدارس-في-الضالع',
    excerpt: 'إحياء المنافسات المدرسية المنظمة قد يمنح الأطفال والشباب مساحة آمنة للتنافس والتعلم.',
    lead: 'تحتاج الرياضة في الضالع إلى نقطة بداية قريبة من المجتمع، والمدرسة هي المكان الأنسب.',
    points: ['المنافسات المدرسية قليلة الكلفة لكنها تحتاج تنظيما وحكاما.', 'إشراك الفتيات في أنشطة مناسبة يعزز الصحة العامة.', 'تعاون المدارس مع الأندية يحول البطولة إلى مسار اكتشاف.'],
    source: 'UNICEF Sports for Development',
    url: 'https://www.unicef.org/sports-for-development',
    image: 'sports',
  }),
  news(14, {
    category: 'رياضة',
    title: 'ملاعب الأحياء في الضالع بين شغف الشباب وحاجة التنظيم',
    slug: 'ملاعب-الاحياء-في-الضالع',
    excerpt: 'ملاعب الأحياء ليست فراغات ترابية فقط؛ إنها مركز اجتماعي يومي للشباب وتستحق إدارة أفضل.',
    lead: 'في كثير من أحياء الضالع تتحول الساحات الصغيرة إلى ملاعب مساء كل يوم.',
    points: ['الملاعب الشعبية تحتاج إنارة آمنة وتسوية أرضية.', 'جدولة الفرق تقلل الاحتكاكات.', 'رعاية محلية صغيرة قد تمول بطولات قصيرة وتشجع المواهب.'],
    source: 'FIFA Social Impact',
    url: 'https://www.fifa.com/social-impact',
    image: 'sports',
  }),
  news(15, {
    category: 'تكنولوجيا',
    title: 'الفجوة الرقمية في اليمن تجعل الإنترنت خدمة تنموية لا ترفا',
    slug: 'الفجوة-الرقمية-في-اليمن',
    excerpt: 'ضعف الاتصال يعني فرصا أقل في التعليم والعمل والوصول إلى المعلومة.',
    lead: 'تؤكد تقارير التنمية الرقمية أن الاتصال بالإنترنت في البيئات الهشة يصبح خدمة أساسية.',
    points: ['ضعف الشبكة يحد من متابعة التعليم والمواد المفتوحة.', 'ارتفاع تكلفة البيانات يجعل الإنترنت عبئا على الأسر.', 'المطلوب خرائط تغطية شفافة ومبادرات واي فاي مجتمعية.'],
    source: 'GSMA Mobile Connectivity Index',
    url: 'https://www.mobileconnectivityindex.com/',
    image: 'tech',
    priority: 'featured',
  }),
  news(16, {
    category: 'تكنولوجيا',
    title: 'الطاقة الشمسية والإنترنت: ثنائي جديد لإنقاذ الخدمات الريفية',
    slug: 'الطاقة-الشمسية-والانترنت-في-الريف',
    excerpt: 'في القرى البعيدة، لا معنى للراوتر من دون طاقة مستقرة تشغله.',
    lead: 'تظهر تجربة مشاريع الطاقة الشمسية أن التقنية لا تنجح وحدها؛ الإنترنت يحتاج كهرباء والمركز الصحي يحتاج طاقة.',
    points: ['المنظومات الصغيرة تشغل نقطة إنترنت مدرسية أو غرفة حاسوب.', 'المراكز الصحية تحتاج طاقة لحفظ اللقاحات وتشغيل الاتصال.', 'الصيانة والتدريب المحلي أهم من شراء الأجهزة.'],
    source: 'البنك الدولي - الطاقة',
    url: 'https://www.worldbank.org/en/topic/energy',
    image: 'solar',
  }),
  news(17, {
    category: 'تكنولوجيا',
    title: 'التحقق من الأخبار أصبح مهارة يومية في مجموعات الواتساب',
    slug: 'التحقق-من-الاخبار-في-واتساب',
    excerpt: 'منصات التواصل تنقل الخبر بسرعة لكنها تنقل الشائعة أسرع.',
    lead: 'مع اعتماد الناس على واتساب وفيسبوك للحصول على الأخبار المحلية، أصبحت الشائعة قادرة على الوصول قبل التوضيح الرسمي.',
    points: ['ينبغي البحث عن المصدر الأول والتاريخ والمكان قبل المشاركة.', 'الصور القديمة تعود في أزمات السيول والحوادث ويمكن كشفها بالبحث العكسي.', 'المؤسسات مطالبة بالنشر السريع والواضح لسد فراغ المعلومة.'],
    source: 'UNESCO Media and Information Literacy',
    url: 'https://www.unesco.org/en/media-information-literacy',
    image: 'tech',
  }),
  news(18, {
    category: 'ثقافة-وفن',
    title: 'التراث اليمني غير المادي يواجه اختبار الحفظ وسط النزوح وتغير الأجيال',
    slug: 'التراث-اليمني-غير-المادي',
    excerpt: 'الحفاظ على التراث لا يعني العودة إلى الماضي، بل حماية ذاكرة المجتمع من الانقطاع.',
    lead: 'تدرج اليونسكو عناصر من التراث اليمني ضمن قوائم التراث الثقافي غير المادي، بينما يهدد النزوح نقل الحرفة والغناء والعادات.',
    points: ['الحكايات والأهازيج والمناسبات الزراعية تحمل تاريخا غير مكتوب.', 'نزوح الأسر يقطع علاقة الأطفال بمكان الذاكرة.', 'المدارس والمراكز الثقافية يمكن أن تستضيف أياما تراثية صغيرة.'],
    source: 'اليونسكو',
    url: 'https://ich.unesco.org/en/state/yemen-YE',
    image: 'culture',
    priority: 'featured',
  }),
  news(19, {
    category: 'ثقافة-وفن',
    title: 'الفن الشعبي في الأعراس والمواسم الزراعية يحفظ ذاكرة قرى الضالع',
    slug: 'الفن-الشعبي-في-قرى-الضالع',
    excerpt: 'الأهازيج الشعبية تروي تاريخ القرى وعلاقتها بالأرض والمطر والهجرة.',
    lead: 'في قرى الضالع، تحمل المناسبات الاجتماعية والزراعية أنماطا فنية بسيطة لكنها عميقة الدلالة.',
    points: ['توثيق الكلمات والألحان يحفظ تنوع اللهجات المحلية.', 'الفن الشعبي يمكن أن يكون مادة تعليمية وسياحية إذا عرض باحترام.', 'الشباب قادرون على تسجيل كبار السن وجمع الروايات قبل فقدانها.'],
    source: 'اليونسكو - اليمن',
    url: 'https://www.unesco.org/en/fieldoffice/doha/yemen',
    image: 'culture',
  }),
  news(20, {
    category: 'ثقافة-وفن',
    title: 'المكتبات الصغيرة يمكن أن تعيد القراءة إلى أحياء الضالع',
    slug: 'المكتبات-الصغيرة-في-الضالع',
    excerpt: 'رف كتب في مدرسة أو مركز شبابي قد يكون بداية لحياة ثقافية أوسع.',
    lead: 'تحتاج الحياة الثقافية في المدن الصغيرة إلى مبادرات قريبة من الناس، والمكتبة المصغرة إحدى أبسط البدايات.',
    points: ['القراءة تعوض جزئيا ضعف الأنشطة الثقافية الرسمية.', 'يمكن جمع الكتب بالتبرع ثم تنظيمها وفق الأعمار.', 'جلسات قراءة شهرية تحول المكتبة إلى مساحة حوار.'],
    source: 'UNESCO Education',
    url: 'https://www.unesco.org/en/education',
    image: 'education',
  }),
  news(21, {
    category: 'تحقيقات',
    title: 'تحقيق بيانات: لماذا تتكرر أزمة المياه في الضالع رغم تعدد المشاريع؟',
    slug: 'تحقيق-ازمة-المياه-في-الضالع',
    excerpt: 'تعدد مشاريع المياه لا يعني انتهاء الأزمة إذا غابت الصيانة والشفافية وموازنات التشغيل.',
    lead: 'تكشف متابعة أخبار المياه في الضالع عن مفارقة واضحة: مشاريع جديدة تظهر كل عام، لكن شكاوى العطش لا تختفي.',
    points: ['المشروع يبدأ غالبا بتمويل إنشائي بينما تبقى كلفة التشغيل غامضة.', 'غياب بيانات المستفيدين وساعات الضخ يضعف الثقة.', 'الطاقة هي عنق الزجاجة لأي مشروع ماء بلا حل مستقر.'],
    source: 'UNICEF WASH وتحليل الضالع أونلاين',
    url: 'https://www.unicef.org/yemen/water-sanitation-and-hygiene',
    image: 'water',
    priority: 'editors_pick',
  }),
  news(22, {
    category: 'تحقيقات',
    title: 'تحقيق: النازحون في الضالع بين المأوى المؤقت وغياب فرص الدخل',
    slug: 'النازحون-في-الضالع-وغياب-الدخل',
    excerpt: 'المأوى يحمي من المطر لكنه لا يحل مشكلة الدخل ولا يضمن تعليم الأطفال.',
    lead: 'تظهر تقارير إنسانية عن الضالع أن الأسر النازحة تحتاج أكثر من استجابة طارئة.',
    points: ['الفجوة تتكرر بين المساعدة العاجلة والتعافي طويل المدى.', 'النازحون والمجتمعات المضيفة يتقاسمون الخدمات المحدودة.', 'المشاريع الأفضل تربط المأوى بالتدريب والدخل والمياه والحماية.'],
    source: 'ACTED Yemen',
    url: 'https://www.acted.org/en/human-interest-story-restoring-hope-and-dignity-through-cash-assistance-in-al-dhalee/',
    image: 'humanitarian',
    priority: 'featured',
  }),
  news(23, {
    category: 'تحقيقات',
    title: 'تحقيق: الغلاء في جنوب اليمن يبدأ من العملة ولا ينتهي عند السوق',
    slug: 'تحقيق-الغلاء-في-جنوب-اليمن',
    excerpt: 'العملة والنقل والدخل والرقابة كلها تدخل في فاتورة الغذاء اليومية.',
    lead: 'عندما ترتفع الأسعار في الضالع، يبحث الناس غالبا عن السبب في سعر الصرف، لكن سلسلة الكلفة أوسع من ذلك.',
    points: ['العملة تحدد كلفة الاستيراد والطريق يحدد كلفة الوصول.', 'غياب قوائم أسعار معلنة يترك المستهلك أمام تفاوت كبير.', 'رصد الأسعار الشفاف وتشجيع الأسواق الشعبية يخففان العبء.'],
    source: 'WFP Yemen',
    url: 'https://www.wfp.org/countries/yemen',
    image: 'economy',
  }),
  news(24, {
    category: 'تقارير-مصورة',
    title: 'تقرير مصور: من خيمة إلى مأوى أكثر أمانا في الضالع',
    slug: 'تقرير-مصور-مأوى-اكثر-امانا',
    excerpt: 'تدخلات المأوى تكشف أن الصورة الإنسانية الحقيقية تبدأ من استعادة الخصوصية والأمان.',
    lead: 'في تقارير إنسانية عن الضالع، لا تظهر الخيمة بوصفها صورة فقر فقط، بل مرحلة من رحلة طويلة نحو التعافي.',
    points: ['المأوى الجيد يقلل التعرض للأمطار والحرارة.', 'الاستجابة الناجحة تقيس رضا الأسرة بعد التسليم.', 'توثيق القصص الفردية يساعد الجمهور على فهم أرقام النزوح.'],
    source: 'ACTED Yemen',
    url: 'https://www.acted.org/en/human-interest-story-restoring-hope-and-dignity-through-cash-assistance-in-al-dhalee/',
    image: 'humanitarian',
    priority: 'featured',
  }),
  news(25, {
    category: 'تقارير-مصورة',
    title: 'تقرير مصور: الأمطار والسيول تكشف هشاشة الطرق الريفية في اليمن',
    slug: 'تقرير-مصور-السيول-والطرق-الريفية',
    excerpt: 'مشاهد السيول تضع صيانة الطرق ضمن أولويات الحماية لا النقل فقط.',
    lead: 'كل موسم أمطار يعيد السؤال نفسه في القرى الجبلية: ماذا يحدث عندما يقطع السيل الطريق الوحيد؟',
    points: ['الصور قبل وبعد السيل تحدد نقاط الخطر المتكررة.', 'الجسور الصغيرة ومصارف المياه قد تكون أكثر أثرا من مشاريع كبيرة.', 'تعطل الطريق يرفع الأسعار ويؤخر الإسعاف.'],
    source: 'IFRC',
    url: 'https://www.ifrc.org/emergency/yemen-floods',
    image: 'roads',
  }),
  news(26, {
    category: 'تقارير-مصورة',
    title: 'تقرير مصور: سوق الضالع بين الغلاء وحركة الناس اليومية',
    slug: 'تقرير-مصور-سوق-الضالع',
    excerpt: 'من رفوف الدقيق إلى بسطات الخضار، يروي السوق قصة الدخل والأسعار والنقل.',
    lead: 'السوق هو المكان الذي تتحول فيه التقارير الاقتصادية إلى واقع مرئي في حياة الناس.',
    points: ['اللقطات الواسعة تكشف الحركة العامة واللقطات القريبة تكشف السعر.', 'سؤال الباعة عن النقل يشرح اختلاف السعر بين المدينة والقرية.', 'تكرار التصوير شهريا يصنع أرشيفا اقتصاديا محليا.'],
    source: 'WFP Yemen',
    url: 'https://www.wfp.org/countries/yemen',
    image: 'economy',
  }),
  news(27, {
    category: 'منوعات',
    title: 'مدرجات الأزارق الزراعية تعود للون الأخضر مع مواسم المطر',
    slug: 'مدرجات-الازارق-الزراعية',
    excerpt: 'مشاهد المدرجات تذكر بأن الضالع أرض وجبال ومواسم لا أخبار أزمات فقط.',
    lead: 'حين تهطل الأمطار على الأزارق والمناطق الجبلية، تعود المدرجات الزراعية لتكشف وجها مختلفا للضالع.',
    points: ['المدرجات تحتاج صيانة تقليدية حتى لا تنهار مع السيول.', 'تصوير المواسم يدعم الوعي البيئي والسياحة الداخلية.', 'حماية البذور والمعرفة الزراعية جزء من حماية التراث.'],
    source: 'FAO Yemen',
    url: 'https://www.fao.org/yemen',
    image: 'default',
  }),
  news(28, {
    category: 'منوعات',
    title: 'كيف يقرأ أبناء الضالع أخبار الطقس قبل موسم الأمطار؟',
    slug: 'اخبار-الطقس-في-الضالع',
    excerpt: 'متابعة الطقس أصبحت جزءا من الاستعداد للسيول والطرق والزراعة.',
    lead: 'مع تكرار موجات المطر والسيول، أصبحت متابعة الطقس عادة يومية للسائقين والمزارعين والأسر.',
    points: ['المزارع يحتاج توقع المطر لمواعيد الحراثة والبذر.', 'السائق يحتاج التحذيرات قبل عبور الطرق الجبلية.', 'التنبيهات المحلية بلغة واضحة أفضل من خرائط فنية معقدة.'],
    source: 'منظمة الأرصاد العالمية',
    url: 'https://wmo.int/',
    image: 'default',
  }),
  news(29, {
    category: 'منوعات',
    title: 'دفتر صغير لإدارة مصروف البيت في زمن الغلاء',
    slug: 'دفتر-مصروف-البيت-زمن-الغلاء',
    excerpt: 'في ظل تذبذب الأسعار، يساعد تسجيل المصروفات على رؤية أين يذهب الدخل القليل.',
    lead: 'لا يحتاج ضبط مصروف البيت إلى تطبيق معقد دائما؛ في ظروف الغلاء قد يكون دفتر صغير بداية عملية.',
    points: ['تسجيل المصروف أسبوعا يكشف البنود القابلة للتقليل.', 'شراء السلع وفق قائمة يقلل الاندفاع.', 'تقاسم النقل أو الشراء بين الجيران قد يخفض بعض الكلفة.'],
    source: 'البنك الدولي - الشمول المالي',
    url: 'https://www.worldbank.org/en/topic/financialinclusion',
    image: 'economy',
  }),
];

function article(index: number, item: {
  category: string;
  title: string;
  slug: string;
  excerpt: string;
  lead: string;
  points: string[];
  source: string;
  url: string;
  image: keyof typeof image;
}): ArticleItem {
  return {
    id: -(index + 101),
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    content: html(item.lead, item.points, item.source, item.url),
    featured_image: image[item.image],
    category: categoryBySlug.get(item.category) || fallbackCategories[0],
    writer,
    stats: { views: 1500 + index * 120, comments: index * 4, shares: 20 + index },
    published_diff: 'منذ أيام',
  };
}

export const fallbackArticles: ArticleItem[] = [
  article(0, {
    category: 'اقتصاد',
    title: 'لماذا لا يشعر المواطن بتحسن الاقتصاد حتى عندما تهدأ الأسعار؟',
    slug: 'لماذا-لا-يشعر-المواطن-بتحسن-الاقتصاد',
    excerpt: 'هدوء السعر لا يكفي إذا كان الدخل قد تآكل والديون المنزلية تراكمت.',
    lead: 'يقيس المواطن الاقتصاد من جيبه لا من المؤشرات العامة؛ لذلك قد تهدأ الأسعار نسبيا من دون أن تشعر الأسرة بتحسن.',
    points: ['المؤشر الأهم للأسرة هو عدد الأيام التي يكفيها الدخل.', 'التحسن الحقيقي يحتاج دخلا مستقرا وخدمات أقل كلفة.', 'الإعلام الاقتصادي المحلي يجب أن يشرح الأرقام بلغة البيت والسوق.'],
    source: 'البنك الدولي',
    url: 'https://www.worldbank.org/en/news/press-release/2026/05/21/economic-strain-deepens-in-yemen-as-regional-risks-intensify',
    image: 'economy',
  }),
  article(1, {
    category: 'مجتمع',
    title: 'المدرسة في الريف اليمني: أكثر من فصل وسبورة',
    slug: 'المدرسة-في-الريف-اليمني',
    excerpt: 'المدرسة الريفية هي نقطة ماء وحماية وصحة ومعرفة في وقت واحد.',
    lead: 'عندما نتحدث عن التعليم في الريف، فإننا لا نتحدث عن منهج فقط بل عن مساحة حماية ونقطة لقاء وخدمة مجتمعية.',
    points: ['أي خطة تعليمية بلا ماء وصرف صحي ناقصة.', 'المعلم المحلي يحتاج دعما ليستمر.', 'عودة الطلاب المنقطعين تبدأ من فهم أسباب الانقطاع.'],
    source: 'اليونيسف',
    url: 'https://www.unicef.org/yemen/education',
    image: 'education',
  }),
  article(2, {
    category: 'سياسة',
    title: 'بناء الثقة يبدأ من ملف إنساني صغير وينتهي بمسار سياسي كبير',
    slug: 'بناء-الثقة-والملف-الانساني',
    excerpt: 'في اليمن، قد يكون الإفراج عن محتجز بداية أعمق من بيان سياسي طويل.',
    lead: 'ليست إجراءات بناء الثقة تفصيلا جانبيا في الحروب الطويلة؛ عودة محتجز واحد تغير نظرة أسرة كاملة إلى إمكانية الحل.',
    points: ['كل اتفاق إنساني ناجح يفتح مساحة لاختبار الالتزام.', 'فشل التنفيذ يجعل أي إعلان جديد أقل إقناعا.', 'المجتمعات المحلية تحتاج نتائج ملموسة حتى تؤمن بالمسار السياسي.'],
    source: 'الأمم المتحدة',
    url: 'https://www.ungeneva.org/en/news-media/news/2026/05/118661/yemen-parties-agree-under-un-mediation-release-1600-detainees',
    image: 'humanitarian',
  }),
  article(3, {
    category: 'تكنولوجيا',
    title: 'قبل أن نطلب حكومة إلكترونية يجب أن نسأل عن الكهرباء والإنترنت',
    slug: 'الحكومة-الالكترونية-والكهرباء-والانترنت',
    excerpt: 'الخدمة الرقمية تبدأ من حق الاتصال لا من تصميم المنصة.',
    lead: 'تبدو الخدمات الرقمية جذابة في العناوين، لكنها قد تتحول إلى عبء إذا افترضت اتصالا مستقرا وكهرباء متاحة للجميع.',
    points: ['التصميم الجيد يراعي الهاتف الضعيف والاتصال البطيء.', 'مراكز خدمة صغيرة قد تكون جسرا بين المواطن والمنصة.', 'الطاقة الشمسية في المدارس والمراكز الصحية أساس للتحول الرقمي المحلي.'],
    source: 'GSMA',
    url: 'https://www.mobileconnectivityindex.com/',
    image: 'tech',
  }),
  article(4, {
    category: 'ثقافة-وفن',
    title: 'ذاكرة القرية اليمنية ليست في الكتب وحدها',
    slug: 'ذاكرة-القرية-اليمنية',
    excerpt: 'الأغاني والحكايات والأسماء القديمة أرشيف يجب أن يلتفت إليه الإعلام المحلي.',
    lead: 'يحمل كبار السن في القرى اليمنية أرشيفا شفهيا لا يوجد في أي مكتبة: أسماء عيون الماء وطرق القوافل وقصص المواسم.',
    points: ['التوثيق الصوتي والبصري البسيط يحفظ مادة لا تعوض.', 'الشباب قادرون على تحويل الهاتف إلى أداة أرشفة مسؤولة.', 'التراث معرفة حية مرتبطة بالأرض والناس لا ديكور احتفالي.'],
    source: 'اليونسكو',
    url: 'https://ich.unesco.org/en/state/yemen-YE',
    image: 'culture',
  }),
];

export function textValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>).find((item) => typeof item === 'string') as string || '';
  return '';
}

function titleKey(item: { title?: unknown }) {
  return textValue(item.title).trim();
}

export function mergeNewsWithFallback(items: NewsItem[] = [], curated: CuratedNewsItem[] = fallbackNews): NewsItem[] {
  const curatedTitles = new Set(curated.map(titleKey));
  return [...curated, ...items.filter((item) => !curatedTitles.has(titleKey(item)))];
}

export function mergeCategoriesWithFallback(items: Category[] = []): Category[] {
  const seen = new Set<string>();
  return [...items, ...fallbackCategories].filter((category) => {
    const key = textValue(category.slug) || textValue(category.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function newsByCategory(slug: string): NewsItem[] {
  const decoded = decodeURIComponent(slug);
  return fallbackNews.filter((item) => textValue(item.category?.slug) === decoded);
}

export function categoryByRouteSlug(slug: string): Category | null {
  const decoded = decodeURIComponent(slug);
  return fallbackCategories.find((category) => textValue(category.slug) === decoded) || null;
}

export function newsBySlug(slug: string): NewsItem | null {
  const decoded = decodeURIComponent(slug);
  return fallbackNews.find((item) => textValue(item.slug) === decoded) || null;
}

export function articleBySlug(slug: string): ArticleItem | null {
  const decoded = decodeURIComponent(slug);
  return fallbackArticles.find((item) => textValue(item.slug) === decoded) || null;
}

export function searchFallback(query: string): SearchResult[] {
  const needle = query.trim();
  if (needle.length < 2) return [];

  const newsResults = fallbackNews
    .filter((item) => `${textValue(item.title)} ${textValue(item.excerpt)} ${textValue(item.content)}`.includes(needle))
    .map((data) => ({ type: 'news' as const, data }));
  const articleResults = fallbackArticles
    .filter((item) => `${textValue(item.title)} ${textValue(item.excerpt)} ${textValue(item.content)}`.includes(needle))
    .map((data) => ({ type: 'article' as const, data }));

  return [...newsResults, ...articleResults].slice(0, 20);
}

export const fallbackTags: TagItem[] = [
  { id: -1, name: 'المياه', slug: 'المياه', description: 'متابعة مشاريع المياه والصرف الصحي وخدمات القرى.', color: '#0891b2', news_count: 7, is_trending: true },
  { id: -2, name: 'الاقتصاد اليمني', slug: 'الاقتصاد-اليمني', description: 'أسعار وسوق وعملة ومعيشة الأسر في اليمن والضالع.', color: '#059669', news_count: 6, is_trending: true },
  { id: -3, name: 'السلام في اليمن', slug: 'السلام-في-اليمن', description: 'ملفات التهدئة وبناء الثقة والمسار السياسي.', color: '#dc2626', news_count: 4, is_trending: true },
  { id: -4, name: 'التعليم', slug: 'التعليم', description: 'المدارس والطلاب والاحتياجات التعليمية.', color: '#7c3aed', news_count: 4, is_trending: false },
  { id: -5, name: 'الطرق', slug: 'الطرق', description: 'الطرق الريفية والسيول والنقل والخدمات.', color: '#475569', news_count: 5, is_trending: false },
  { id: -6, name: 'النزوح', slug: 'النزوح', description: 'قصص النزوح والمأوى والحماية وفرص الدخل.', color: '#ea580c', news_count: 3, is_trending: false },
  { id: -7, name: 'التراث', slug: 'التراث', description: 'ثقافة الضالع وذاكرة القرى والفن الشعبي.', color: '#db2777', news_count: 3, is_trending: false },
  { id: -8, name: 'الطاقة الشمسية', slug: 'الطاقة-الشمسية', description: 'حلول الطاقة لخدمات المياه والتعليم والصحة.', color: '#f59e0b', news_count: 3, is_trending: true },
];

export const fallbackWriters: Writer[] = [
  {
    id: -1,
    name: 'فريق الضالع أونلاين',
    username: 'aldhalea-desk',
    avatar: '/brand/aldhalea-mark.png',
    bio: 'فريق تحرير يرصد أخبار الضالع واليمن من مصادر عامة موثوقة ويعيد تقديمها بلغة محلية واضحة.',
    role: 'writer',
    total_articles: fallbackArticles.length,
    total_views: fallbackArticles.reduce((sum, article) => sum + (article.stats?.views || 0), 0),
  },
  {
    id: -2,
    name: 'وحدة التحقيقات',
    username: 'investigations',
    avatar: '/icons/maskable-192.png',
    bio: 'وحدة تحريرية تركز على البيانات والخدمات العامة والأسئلة التي تمس حياة المواطنين اليومية.',
    role: 'writer',
    total_articles: 3,
    total_views: 8600,
  },
  {
    id: -3,
    name: 'قسم الاقتصاد والخدمات',
    username: 'services-economy',
    avatar: '/icons/pwa-192.png',
    bio: 'يتابع الأسعار والخدمات والأسواق والطاقة والنقل من زاوية أثرها على الأسرة في الضالع.',
    role: 'writer',
    total_articles: 4,
    total_views: 7400,
  },
];

export const fallbackPolls: Poll[] = [
  {
    id: -1,
    question: 'ما الملف الخدمي الأكثر إلحاحاً في الضالع حالياً؟',
    description: 'استطلاع مفتوح لقياس أولويات القراء في الخدمات الأساسية.',
    status: 'active',
    is_active: true,
    total_votes: 1284,
    options: [
      { id: -11, text: 'المياه', votes_count: 468, percentage: 36, color: '#0891b2' },
      { id: -12, text: 'الطرق', votes_count: 312, percentage: 24, color: '#475569' },
      { id: -13, text: 'الصحة', votes_count: 284, percentage: 22, color: '#16a34a' },
      { id: -14, text: 'التعليم', votes_count: 220, percentage: 17, color: '#7c3aed' },
    ],
  },
  {
    id: -2,
    question: 'أي نوع من المحتوى تريد زيادته في الموقع؟',
    description: 'نستخدم هذه المؤشرات لتطوير التغطية التحريرية القادمة.',
    status: 'active',
    is_active: true,
    total_votes: 936,
    options: [
      { id: -21, text: 'تحقيقات معمقة', votes_count: 338, percentage: 36, color: '#dc2626' },
      { id: -22, text: 'تقارير مصورة', votes_count: 247, percentage: 26, color: '#2563eb' },
      { id: -23, text: 'مقالات رأي وتحليل', votes_count: 194, percentage: 21, color: '#f59e0b' },
      { id: -24, text: 'أخبار عاجلة قصيرة', votes_count: 157, percentage: 17, color: '#16a34a' },
    ],
  },
];

export function tagBySlug(slug: string): TagItem | null {
  const decoded = decodeURIComponent(slug);
  return fallbackTags.find((tag) => textValue(tag.slug) === decoded) || null;
}

export function writerById(id: string | number): Writer | null {
  const numericId = Number(id);
  return fallbackWriters.find((item) => item.id === numericId) || null;
}

export function pollById(id: string | number): Poll | null {
  const numericId = Number(id);
  return fallbackPolls.find((item) => item.id === numericId) || null;
}
