/* AgroLens — domain data, demo knowledge base and PR5 project metadata */
const DATA = (() => {
  const CATEGORIES = {
    fungal: { label: 'Грибкові', icon: 'bacteria', tone: 'green' },
    bacterial: { label: 'Бактеріальні', icon: 'bacteria', tone: 'amber' },
    viral: { label: 'Вірусні', icon: 'bug', tone: 'danger' },
    pest: { label: 'Шкідники', icon: 'bug', tone: 'amber' },
    deficiency: { label: 'Дефіцит живлення', icon: 'leaf', tone: 'green' },
    care: { label: 'Догляд', icon: 'hand', tone: 'green' }
  };

  const SEVERITY = {
    low: { label: 'Низький', cls: 'good', color: '#4E9B62' },
    medium: { label: 'Середній', cls: 'warn', color: '#E9A23B' },
    high: { label: 'Високий', cls: 'bad', color: '#C96044' }
  };

  const DISEASES = [
    {
      id: 'phytophthora',
      name: 'Фітофтороз',
      latin: 'Phytophthora infestans',
      category: 'fungal',
      plants: ['tomato', 'potato'],
      severity: 'high',
      confidence: 94,
      art: 'tomato',
      lesion: 'phytophthora',
      summary: 'Агресивна грибоподібна інфекція. За вологої погоди плями з’являються за 2–3 дні, а весь кущ може загинути за тиждень.',
      symptoms: ['бурі плями зі світлим обідком', 'білий наліт на нижньому боці листка', 'тверді бурі плями на плодах', 'швидке в’янення пагонів'],
      causes: ['висока вологість і температура 18–22 °C', 'краплинний полив по листю', 'загущені посадки', 'заражений ґрунт і рештки'],
      treatment: {
        immediate: ['Зірвіть і винесіть уражені листки та плоди — не в компост.', 'Ізолюйте рослину від здорових на 2–3 дні.', 'Не поливайте по листю, поки плями не зупиняться.'],
        organic: ['Обприскати 1% бордоською сумішшю.', 'Біофунгіцид на основі Bacillus subtilis кожні 5–7 днів.', 'Мульчувати ґрунт, щоб краплі не потрапляли на листя.'],
        chemical: ['Хлороксид міді або манкоцеб — суворо за інструкцією.', 'Обробляти ввечері, коли немає дощу 6 годин.', 'Дотримуватися строку очікування до збору врожаю.'],
        prevention: ['Сівозміна 3–4 роки.', 'Краплинний полив під корінь.', 'Стійкі сорти та просторі посадки.', 'Прибирати рослинні рештки восени.']
      },
      weather: 'Ризик зростає при вологості понад 90% і температурі 15–22 °C.',
      household: true
    },
    {
      id: 'powdery',
      name: 'Борошниста роса',
      latin: 'Erysiphe spp.',
      category: 'fungal',
      plants: ['apple', 'cucumber', 'basil', 'rose'],
      severity: 'medium',
      confidence: 91,
      art: 'apple',
      lesion: 'powdery',
      summary: 'Білий борошнистий наліт на листі та пагонах. Рослина слабшає, листя жовтіє й скручується.',
      symptoms: ['білий наліт, схожий на борошно', 'жовтіння і скручування листя', 'наліт на молодих пагонах', 'повільний ріст'],
      causes: ['застій повітря', 'перепад денних і нічних температур', 'надлишок азоту', 'сухе повітря в приміщенні'],
      treatment: {
        immediate: ['Обріжте сильно уражені листки.', 'Протріть здорові листки сухою тканиною.', 'Провітріть приміщення або прорідіть посадки.'],
        organic: ['Розчин харчової соди: 1 ч. л. на 1 л води + крапля мила.', 'Молочний розчин 1:9 раз на тиждень.', 'Сірчаний препарат при 15–25 °C.'],
        chemical: ['Тебуконазол або триадимефон за інструкцією.', 'Чергуйте діючі речовини, щоб не виникала резистентність.'],
        prevention: ['Полив під корінь, не по листю.', 'Тримайте відстань між рослинами.', 'Не перегодовуйте азотом.', 'Прибирайте рештки восени.']
      },
      weather: 'Сухі дні з прохолодними ночами та застоєм повітря.',
      household: true
    },
    {
      id: 'appleScab',
      name: 'Парша яблуні',
      latin: 'Venturia inaequalis',
      category: 'fungal',
      plants: ['apple', 'pear'],
      severity: 'medium',
      confidence: 88,
      art: 'apple',
      lesion: 'scab',
      summary: 'Оливково-бурі оксамитові плями на листі та плодах. Інфекція зимує в опалому листі.',
      symptoms: ['оливкові плями на листі', 'оксамитовий наліт', 'тріщини на плодах', 'передчасне опадання листя'],
      causes: ['волога весна', 'опале заражене листя', 'загущена крона', 'прохолодна погода'],
      treatment: {
        immediate: ['Зберіть і спаліть опале листя.', 'Видаліть уражені плоди.', 'Прорідіть крону для провітрювання.'],
        organic: ['Біофунгіцид Bacillus subtilis.', 'Калійне мило із сіркою.', 'Компостна мульча навколо стовбура.'],
        chemical: ['Дифеноконазол до цвітіння.', 'Каптан після цвітіння.', 'Не більше трьох обробок за сезон.'],
        prevention: ['Прибирати листя восени.', 'Стійкі сорти.', 'Обрізка для провітрювання крони.']
      },
      weather: 'Волога весна з температурою 10–20 °C.',
      household: false
    },
    {
      id: 'downy',
      name: 'Пероноспороз',
      latin: 'Pseudoperonospora cubensis',
      category: 'fungal',
      plants: ['cucumber', 'melon', 'pumpkin'],
      severity: 'high',
      confidence: 90,
      art: 'cucumber',
      lesion: 'downy',
      summary: 'Кутові жовто-бурі плями, обмежені жилками; на нижньому боці — сірий наліт. Швидко поширюється у вологій теплиці.',
      symptoms: ['кутові жовті плями', 'сірий наліт знизу', 'листя стає крихким', 'деформовані плоди'],
      causes: ['конденсат у теплиці', 'полив по листю', 'загущення', 'температура 18–24 °C'],
      treatment: {
        immediate: ['Зріжте уражені листки.', 'Знизьте вологість до 70%.', 'Провітрюйте теплицю щоранку.'],
        organic: ['Біофунгіцид Pseudomonas fluorescens.', 'Молочна сироватка 1:10.', 'Мульча під рослинами.'],
        chemical: ['Метаксил + манкоцеб.', 'Хлороксид міді.', 'Чергувати препарати за інструкцією.'],
        prevention: ['Краплинний полив.', 'Ранкове провітрювання.', 'Сівозміна.']
      },
      weather: 'Висока вологість, конденсат і температура 18–24 °C.',
      household: true
    },
    {
      id: 'septoria',
      name: 'Септоріоз пшениці',
      latin: 'Zymoseptoria tritici',
      category: 'fungal',
      plants: ['wheat'],
      severity: 'medium',
      confidence: 87,
      art: 'wheat',
      lesion: 'septoria',
      summary: 'Світло-бурі плями з темними крапками на листі пшениці. Знижує фотосинтез і врожай.',
      symptoms: ['світлі плями', 'темні крапки в центрі', 'жовтіння нижнього листя', 'передчасне висихання'],
      causes: ['вологість понад 80%', 'загущений посів', 'надлишок азоту', 'рештки попереднього врожаю'],
      treatment: {
        immediate: ['Огляньте посів по діагоналі.', 'Зафіксуйте площу ураження в журналі.', 'Не вносьте азот понад норму.'],
        organic: ['Bacillus subtilis.', 'Триходерма.', 'Збалансоване живлення.'],
        chemical: ['Пропіконазол + тебуконазол.', 'Азоксистробін.', 'Обробка у фазі прапорцевого листка.'],
        prevention: ['Сівозміна.', 'Стійкі сорти.', 'Норма висіву.', 'Збирання решток.']
      },
      weather: 'Тривалі дощі та вологість понад 80%.',
      household: false
    },
    {
      id: 'anthracnose',
      name: 'Антракноз',
      latin: 'Colletotrichum spp.',
      category: 'fungal',
      plants: ['tomato', 'cucumber', 'pepper'],
      severity: 'high',
      confidence: 85,
      art: 'tomato',
      lesion: 'scab',
      summary: 'Темні вдавлені плями на листі, стеблах і плодах; у вологу погоду з’являються рожеві спори.',
      symptoms: ['вдавлені темні плями', 'рожеві спори', 'гниль плодів', 'сухі стебла'],
      causes: ['висока волога', 'пошкодження плодів', 'заражене насіння', 'тепла погода'],
      treatment: {
        immediate: ['Видаліть уражені плоди й листки.', 'Прорідіть посадки.', 'Не збирайте врожай з мокрих рослин.'],
        organic: ['Bacillus subtilis.', 'Компостний чай.', 'Мульча.'],
        chemical: ['Азоксистробін.', 'Хлороксид міді.', 'Обробка за інструкцією.'],
        prevention: ['Здорове насіння.', 'Сівозміна.', 'Краплинний полив.']
      },
      weather: 'Тепло і волого, особливо після дощу.',
      household: true
    },
    {
      id: 'spiderMite',
      name: 'Павутинний кліщ',
      latin: 'Tetranychus urticae',
      category: 'pest',
      plants: ['monstera', 'ficus', 'basil', 'cucumber'],
      severity: 'high',
      confidence: 92,
      art: 'monstera',
      lesion: 'spiderMite',
      summary: 'Мікроскопічний кліщ висмоктує сік. Листя вкривається жовтими цятками й тонким павутинням.',
      symptoms: ['жовті цятки', 'павутиння між листям', 'листя сохне', 'кліщі на нижньому боці'],
      causes: ['сухе тепле повітря', 'брак вологи', 'заражені нові рослини', 'стрес після переїзду'],
      treatment: {
        immediate: ['Ізолюйте рослину.', 'Промийте листя під теплим душем.', 'Підвищте вологість до 60–70%.'],
        organic: ['Мильний розчин.', 'Нім-олія 1%.', 'Хижі кліщі Phytoseiulus.'],
        chemical: ['Абамектин.', 'Спіромезифен.', 'Чергувати класи: 3 обробки через 5 днів.'],
        prevention: ['Оглядайте нові рослини.', 'Регулярно обприскуйте.', 'Не пересушуйте повітря.']
      },
      weather: 'Сухе тепле повітря та опалення взимку.',
      household: true
    },
    {
      id: 'aphids',
      name: 'Попелиця',
      latin: 'Aphidoidea',
      category: 'pest',
      plants: ['basil', 'tomato', 'rose', 'apple'],
      severity: 'medium',
      confidence: 95,
      art: 'basil',
      lesion: 'aphids',
      summary: 'Колонії дрібних комах на молодих пагонах. Листя скручується, з’являється липкий наліт і сажистий гриб.',
      symptoms: ['дрібні зелені або чорні комахи', 'скручене листя', 'липкий наліт', 'мурахи на рослині'],
      causes: ['тепло', 'надлишок азоту', 'заражені рослини', 'відсутність природних ворогів'],
      treatment: {
        immediate: ['Змийте колонії водою з милом.', 'Видаліть найзаселеніші пагони.', 'Поставте жовті клейові пастки.'],
        organic: ['Мильний розчин 1:50.', 'Настій часнику.', 'Сонечка або златоглазки.'],
        chemical: ['Імідаклоприд.', 'Піримікарб.', 'Не обробляйте під час цвітіння.'],
        prevention: ['Не перегодовуйте азотом.', 'Оглядайте нові рослини.', 'Садіть ароматні трави поруч.']
      },
      weather: 'Тепла суха погода та соковиті молоді пагони.',
      household: true
    },
    {
      id: 'rootRot',
      name: 'Коренева гниль / перелив',
      latin: 'Pythium, Fusarium',
      category: 'care',
      plants: ['monstera', 'ficus', 'basil', 'tomato'],
      severity: 'high',
      confidence: 93,
      art: 'monstera',
      lesion: 'rootRot',
      summary: 'Коріння загниває через постійно мокрий ґрунт. Листя жовтіє, в’яне, а земля пахне болотом.',
      symptoms: ['жовте листя', 'в’янення при вологому ґрунті', 'темні м’які корені', 'кислий запах'],
      causes: ['частий полив', 'відсутність дренажу', 'щільний ґрунт', 'холодний підвіконник'],
      treatment: {
        immediate: ['Дістаньте рослину з горшка.', 'Обріжте гнилі корені до здорових.', 'Просушіть і пересадіть у свіжий субстрат.'],
        organic: ['Триходерма у ґрунт.', 'Кора та перліт для дренажу.', 'Поливайте після просихання 2–3 см.'],
        chemical: ['Фунгіцид на основі фосетил-алюмінію — лише за потреби.', 'Не лийте на листя.'],
        prevention: ['Горшок із дренажем.', 'Полив за потребою.', 'Не залишайте воду в піддоні.']
      },
      weather: 'Найчастіше — у опалювальний сезон, коли ґрунт сохне повільно.',
      household: true
    },
    {
      id: 'nitrogen',
      name: 'Дефіцит азоту',
      latin: 'Nitrogen deficiency',
      category: 'deficiency',
      plants: ['tomato', 'cucumber', 'basil', 'wheat'],
      severity: 'low',
      confidence: 84,
      art: 'generic',
      lesion: 'none',
      summary: 'Нижнє листя рівномірно блідне, ріст сповільнюється, пагони стають тонкими.',
      symptoms: ['рівномірне пожовтіння нижнього листя', 'дрібне листя', 'тонкі пагони', 'блідий колір'],
      causes: ['бідний ґрунт', 'частий полив вимиває азот', 'коріння не працює'],
      treatment: {
        immediate: ['Підживіть азотним добривом у половинній дозі.', 'Перевірте pH ґрунту.', 'Не переливайте.'],
        organic: ['Компостний чай.', 'Настій кропиви.', 'Перепрілий гній.'],
        chemical: ['Аміачна селітра або карбамід за нормою.', 'Позакореневе підживлення 0,5%.'],
        prevention: ['Регулярні підживлення.', 'Мульча.', 'Сівозміна.']
      },
      weather: 'Після сильних дощів азот вимивається з ґрунту.',
      household: true
    },
    {
      id: 'chlorosis',
      name: 'Хлороз (дефіцит заліза)',
      latin: 'Iron chlorosis',
      category: 'deficiency',
      plants: ['ficus', 'monstera', 'apple'],
      severity: 'medium',
      confidence: 86,
      art: 'ficus',
      lesion: 'chlorosis',
      summary: 'Молоді листки жовтіють, але жилки залишаються зеленими. Часто причина — лужний ґрунт.',
      symptoms: ['жовте листя із зеленими жилками', 'бліді молоді листки', 'слабкий ріст'],
      causes: ['лужний ґрунт', 'надлишок вапна', 'поганий дренаж', 'дефіцит заліза'],
      treatment: {
        immediate: ['Перевірте pH ґрунту (оптимум 6–6,8).', 'Полийте відстояною водою.'],
        organic: ['Хелат заліза.', 'Компост.', 'Підкислення ґрунту торфом.'],
        chemical: ['Fe-EDDHA позакоренево.', 'Сульфат заліза.'],
        prevention: ['Правильний pH.', 'Не вапнуйте без потреби.', 'Мульча.']
      },
      weather: 'Часто проявляється після поливу жорсткою водою.',
      household: true
    },
    {
      id: 'sunburn',
      name: 'Сонячний опік',
      latin: 'Photo-oxidative damage',
      category: 'care',
      plants: ['monstera', 'ficus', 'basil'],
      severity: 'low',
      confidence: 89,
      art: 'monstera',
      lesion: 'sunburn',
      summary: 'Різкий перехід на пряме сонце викликає знебарвлені опіки. Тканина не відновлюється.',
      symptoms: ['білі або кремові плями', 'сухі краї', 'опіки на боці до вікна', 'листя опадає'],
      causes: ['пряме сонце після тіні', 'краплі води на листі', 'спекотний день'],
      treatment: {
        immediate: ['Приберіть з прямого сонця.', 'Зріжте сухі краї.', 'Не мийте листя на сонці.'],
        organic: ['Притінення.', 'Поступове привчання до світла.'],
        chemical: ['Обробка не потрібна.'],
        prevention: ['Розсіяне світло.', 'Притінювальна сітка.', 'Полив уранці.']
      },
      weather: 'Ясні дні після похмурого тижня.',
      household: true
    },
    {
      id: 'lowLight',
      name: 'Брак світла',
      latin: 'Light deficiency',
      category: 'care',
      plants: ['ficus', 'monstera', 'basil'],
      severity: 'medium',
      confidence: 87,
      art: 'ficus',
      lesion: 'none',
      summary: 'Рослина витягується, нові листки дрібніють, пестролистість зникає.',
      symptoms: ['витягнуті пагони', 'дрібне бліде листя', 'втрата строкатості', 'рослина не росте'],
      causes: ['далеко від вікна', 'північна сторона', 'щільна штора', 'темний кут'],
      treatment: {
        immediate: ['Переставте ближче до вікна.', 'Протріть листя від пилу.', 'Увімкніть фітолампу на 8–10 годин.'],
        organic: ['Фітолампа.', 'Біла стіна або дзеркало для відбиття світла.'],
        chemical: ['Обробка не потрібна.'],
        prevention: ['Враховуйте світло при виборі місця.', 'Повертайте рослину раз на тиждень.']
      },
      weather: 'Короткий світловий день з жовтня до березня.',
      household: true
    },
    {
      id: 'drought',
      name: 'Пересихання ґрунту',
      latin: 'Drought stress',
      category: 'care',
      plants: ['basil', 'tomato', 'ficus'],
      severity: 'medium',
      confidence: 82,
      art: 'basil',
      lesion: 'none',
      summary: 'Листя в’яне, краї сохнуть, ґрунт відходить від стінок горшка.',
      symptoms: ['сухі краї', 'в’янення', 'сухий ґрунт', 'листя опадає'],
      causes: ['рідкісний полив', 'спекотне повітря', 'малий горшок', 'пересохлий торф’яний субстрат'],
      treatment: {
        immediate: ['Полийте повільно до виходу вологи з дренажу.', 'Занурте горшок на 15 хвилин.', 'Приберіть від батареї.'],
        organic: ['Мульча.', 'Піддон з галькою.'],
        chemical: ['Обробка не потрібна.'],
        prevention: ['Перевіряйте вологість пальцем.', 'Дотримуйтеся графіка поливу.']
      },
      weather: 'Спека та сухе повітря.',
      household: true
    },
    {
      id: 'lowHumidity',
      name: 'Сухе повітря',
      latin: 'Low humidity',
      category: 'care',
      plants: ['monstera', 'ficus', 'basil'],
      severity: 'low',
      confidence: 85,
      art: 'monstera',
      lesion: 'none',
      summary: 'Кінчики листя сохнуть і коричнепіють, особливо в опалювальний сезон.',
      symptoms: ['сухі кінчики', 'коричневі краї', 'скручування', 'опадання бутонів'],
      causes: ['опалення', 'кондиціонер', 'сухий клімат', 'близькість до радіатора'],
      treatment: {
        immediate: ['Приберіть від радіатора.', 'Поставте зволожувач.', 'Зберіть рослини разом.'],
        organic: ['Піддон з вологим керамзитом.', 'Обприскування вранці.'],
        chemical: ['Обробка не потрібна.'],
        prevention: ['Вологість 50–60%.', 'Гігрометр.']
      },
      weather: 'Опалювальний сезон із вологістю нижче 35%.',
      household: true
    },
    {
      id: 'whitefly',
      name: 'Білокрилка',
      latin: 'Trialeurodes vaporariorum',
      category: 'pest',
      plants: ['tomato', 'cucumber', 'basil'],
      severity: 'medium',
      confidence: 88,
      art: 'tomato',
      lesion: 'aphids',
      summary: 'Білі дрібні мушки злітають при дотику. Личинки висмоктують сік і залишають липкий наліт.',
      symptoms: ['білі мушки', 'липкий наліт', 'жовтіння', 'сажистий гриб'],
      causes: ['теплиця', 'заражені рослини', 'тепло'],
      treatment: {
        immediate: ['Жовті клейові пастки.', 'Ізолюйте рослину.', 'Промийте листя.'],
        organic: ['Мильний розчин.', 'Нім-олія.', 'Енкарзія.'],
        chemical: ['Імідаклоприд.', 'Тіаметоксам.'],
        prevention: ['Сітки на вікна.', 'Огляд нових рослин.']
      },
      weather: 'Тепло і волого, особливо в теплиці.',
      household: true
    }
  ];

  const byId = Object.fromEntries(DISEASES.map(d => [d.id, d]));

  const SAMPLES = [
    { id: 'tomato-blight', type: 'tomato', disease: 'phytophthora', label: 'Томат', note: 'бурі плями', mode: 'farm' },
    { id: 'monstera-yellow', type: 'monstera', disease: 'rootRot', label: 'Монстера', note: 'жовте листя', mode: 'home' },
    { id: 'apple-mildew', type: 'apple', disease: 'powdery', label: 'Яблуня', note: 'білий наліт', mode: 'farm' },
    { id: 'cucumber-downy', type: 'cucumber', disease: 'downy', label: 'Огірок', note: 'кутові плями', mode: 'farm' },
    { id: 'basil-aphids', type: 'basil', disease: 'aphids', label: 'Базилік', note: 'дрібні комахи', mode: 'home' }
  ];

  const PARTS = [
    { id: 'leaf', label: 'Листя', icon: 'leaf', hint: 'плями, колір, наліт' },
    { id: 'stem', label: 'Стебло', icon: 'sprout', hint: 'гниль, тріщини' },
    { id: 'fruit', label: 'Плоди', icon: 'tomato', hint: 'плями, гниль' },
    { id: 'root', label: 'Корінь', icon: 'layers', hint: 'запах, колір' }
  ];

  const SYMPTOMS = [
    { id: 'yellow', label: 'Жовтіє листя', icon: 'leaf', weights: { rootRot: 3, nitrogen: 2, lowLight: 2, spiderMite: 1, chlorosis: 1, drought: 1 } },
    { id: 'brownSpots', label: 'Бурі плями', icon: 'target', weights: { phytophthora: 3, septoria: 2, appleScab: 2, anthracnose: 2, downy: 1 } },
    { id: 'whiteCoating', label: 'Білий наліт', icon: 'cloud', weights: { powdery: 3, downy: 1 } },
    { id: 'angularSpots', label: 'Кутові жовті плями', icon: 'grid', weights: { downy: 3, phytophthora: 1 } },
    { id: 'web', label: 'Павутиння', icon: 'waves', weights: { spiderMite: 3 } },
    { id: 'sticky', label: 'Липкий наліт', icon: 'drop', weights: { aphids: 3, whitefly: 1 } },
    { id: 'curl', label: 'Скручується листя', icon: 'refresh', weights: { aphids: 2, drought: 2, spiderMite: 1, sunburn: 1 } },
    { id: 'dryTips', label: 'Сухі кінчики', icon: 'wind', weights: { lowHumidity: 3, sunburn: 1, drought: 1 } },
    { id: 'wilting', label: 'Рослина в’яне', icon: 'drop', weights: { rootRot: 3, drought: 2, phytophthora: 1 } },
    { id: 'slow', label: 'Повільно росте', icon: 'timer', weights: { lowLight: 3, nitrogen: 2, rootRot: 1 } },
    { id: 'stems', label: 'Темні стебла', icon: 'alert', weights: { rootRot: 3, anthracnose: 1 } },
    { id: 'fruitSpots', label: 'Плями на плодах', icon: 'tomato', weights: { phytophthora: 3, anthracnose: 2 } },
    { id: 'paleNew', label: 'Бліде молоде листя', icon: 'sun', weights: { chlorosis: 3, lowLight: 2, nitrogen: 1 } },
    { id: 'bleached', label: 'Вигорілі ділянки', icon: 'sun', weights: { sunburn: 3 } },
    { id: 'insects', label: 'Дрібні комахи', icon: 'bug', weights: { aphids: 3, whitefly: 2, spiderMite: 1 } },
    { id: 'holes', label: 'Дірки на листі', icon: 'bug', weights: { aphids: 1, whitefly: 1 } }
  ];

  const CONTEXT = {
    watering: [
      { id: 'rare', label: 'Рідко' },
      { id: 'normal', label: 'За графіком' },
      { id: 'often', label: 'Часто' }
    ],
    light: [
      { id: 'shade', label: 'Тінь' },
      { id: 'diffuse', label: 'Розсіяне' },
      { id: 'sun', label: 'Пряме сонце' }
    ],
    place: [
      { id: 'home', label: 'Дім' },
      { id: 'garden', label: 'Город' },
      { id: 'greenhouse', label: 'Теплиця' }
    ]
  };

  const CONTEXT_WEIGHTS = {
    watering: {
      rare: { drought: 3, spiderMite: 1 },
      often: { rootRot: 3, lowLight: 1 }
    },
    light: {
      shade: { lowLight: 3, rootRot: 1 },
      sun: { sunburn: 3, spiderMite: 1 }
    },
    place: {
      home: { spiderMite: 2, lowLight: 1, rootRot: 1 },
      garden: { phytophthora: 1, powdery: 1, aphids: 1 },
      greenhouse: { downy: 2, powdery: 2, spiderMite: 1 }
    }
  };

  const PLANTS_SEED = [
    { id: 'p1', name: 'Монстера', species: 'Monstera deliciosa', room: 'Вітальня', art: 'monstera', waterEvery: 7, lastWateredDays: 2, light: 'Розсіяне', health: 'good', pot: 'Ø 24 см', note: 'Любить опору та теплий душ раз на місяць.' },
    { id: 'p2', name: 'Фікус ліроподібний', species: 'Ficus lyrata', room: 'Спальня', art: 'ficus', waterEvery: 5, lastWateredDays: 6, light: 'Яскраве розсіяне', health: 'attention', pot: 'Ø 21 см', note: 'Не любить перестановок і протягів.' },
    { id: 'p3', name: 'Базилік', species: 'Ocimum basilicum', room: 'Кухня', art: 'basil', waterEvery: 2, lastWateredDays: 1, light: 'Пряме сонце', health: 'risk', pot: 'Ø 15 см', note: 'Потребує багато світла та регулярного прищипування.' },
    { id: 'p4', name: 'Томати чері', species: 'Solanum lycopersicum', room: 'Балкон', art: 'tomato', waterEvery: 2, lastWateredDays: 3, light: 'Пряме сонце', health: 'risk', pot: 'Ящик 40 л', note: 'Полив під корінь, щоб не провокувати фітофтороз.' },
    { id: 'p5', name: 'Сансев’єра', species: 'Dracaena trifasciata', room: 'Спальня', art: 'snake', waterEvery: 14, lastWateredDays: 9, light: 'Тінь / півтінь', health: 'good', pot: 'Ø 18 см', note: 'Краще недолити, ніж перелити.' }
  ];

  const FIELDS_SEED = [
    { id: 'f1', name: 'Поле №1', crop: 'Пшениця озима', cropType: 'wheat', area: 12.4, stage: 'Кущення', risk: 'low', lastScan: '2 дні тому', note: 'Посів рівномірний, волога в нормі.' },
    { id: 'f2', name: 'Поле №2', crop: 'Томати', cropType: 'tomato', area: 3.2, stage: 'Плодоношення', risk: 'high', lastScan: 'сьогодні', note: 'Після дощів є ризик фітофторозу.' },
    { id: 'f3', name: 'Сад', crop: 'Яблуня', cropType: 'apple', area: 1.8, stage: 'Після збору', risk: 'medium', lastScan: '4 дні тому', note: 'Опале листя треба прибрати до зими.' },
    { id: 'f4', name: 'Теплиця', crop: 'Огірки', cropType: 'cucumber', area: 0.6, stage: 'Цвітіння', risk: 'medium', lastScan: 'вчора', note: 'Висока вологість, потрібне провітрювання.' }
  ];

  const JOURNAL_SEED = [
    { daysAgo: 0, type: 'scan', title: 'Діагностика томатів чері', sub: 'Фітофтороз · впевненість 94%', plant: 'Томати чері', icon: 'scan', status: 'warning' },
    { daysAgo: 0, type: 'water', title: 'Полив монстери', sub: '7 днів до наступного поливу', plant: 'Монстера', icon: 'drop', status: 'ok' },
    { daysAgo: 1, type: 'note', title: 'Огляд базиліку', sub: 'Помічено колонію попелиці на молодих пагонах', plant: 'Базилік', icon: 'bug', status: 'danger' },
    { daysAgo: 1, type: 'treatment', title: 'Обробка яблуні', sub: 'Біофунгіцид Bacillus subtilis, 2 л на дерево', plant: 'Сад', icon: 'spray', status: 'ok' },
    { daysAgo: 2, type: 'scan', title: 'Септоріоз: вибірковий огляд', sub: 'Поле №1 · уражено близько 4% площі', plant: 'Поле №1', icon: 'scan', status: 'warning' },
    { daysAgo: 3, type: 'water', title: 'Полив фікуса', sub: 'Ґрунт був сухий на 4 см', plant: 'Фікус ліроподібний', icon: 'drop', status: 'ok' },
    { daysAgo: 4, type: 'note', title: 'Пересадка сансев’єри', sub: 'Свіжий субстрат із перлітом, горшок Ø 18 см', plant: 'Сансев’єра', icon: 'pot', status: 'ok' },
    { daysAgo: 5, type: 'scan', title: 'Парша яблуні', sub: 'Сад · впевненість 88%', plant: 'Сад', icon: 'scan', status: 'warning' }
  ];

  const CHAT_PROMPTS = [
    'Що не так з моїм фікусом?',
    'Коли полити томати на балконі?',
    'Як позбутися павутинного кліща?',
    'Чи можна обробляти завтра?',
    'Склади план догляду на тиждень'
  ];

  const WEATHER_CODES = {
    0: { label: 'Ясно', icon: 'sun', tone: 'sun' },
    1: { label: 'Переважно ясно', icon: 'sun', tone: 'sun' },
    2: { label: 'Мінлива хмарність', icon: 'cloud', tone: 'cloud' },
    3: { label: 'Похмуро', icon: 'cloud', tone: 'cloud' },
    45: { label: 'Туман', icon: 'fog', tone: 'cloud' },
    48: { label: 'Іній і туман', icon: 'fog', tone: 'cloud' },
    51: { label: 'Легка мряка', icon: 'rain', tone: 'rain' },
    53: { label: 'Мряка', icon: 'rain', tone: 'rain' },
    55: { label: 'Сильна мряка', icon: 'rain', tone: 'rain' },
    61: { label: 'Невеликий дощ', icon: 'rain', tone: 'rain' },
    63: { label: 'Дощ', icon: 'rain', tone: 'rain' },
    65: { label: 'Сильний дощ', icon: 'rain', tone: 'rain' },
    71: { label: 'Невеликий сніг', icon: 'snow', tone: 'snow' },
    73: { label: 'Сніг', icon: 'snow', tone: 'snow' },
    75: { label: 'Сильний сніг', icon: 'snow', tone: 'snow' },
    80: { label: 'Злива', icon: 'rain', tone: 'rain' },
    81: { label: 'Сильна злива', icon: 'rain', tone: 'rain' },
    82: { label: 'Дуже сильна злива', icon: 'storm', tone: 'storm' },
    95: { label: 'Гроза', icon: 'storm', tone: 'storm' },
    96: { label: 'Гроза з градом', icon: 'storm', tone: 'storm' },
    99: { label: 'Сильна гроза з градом', icon: 'storm', tone: 'storm' }
  };

  function weatherInfo(code) {
    return WEATHER_CODES[code] || { label: 'Мінлива погода', icon: 'cloud', tone: 'cloud' };
  }

  function demoWeather() {
    const now = new Date();
    const days = [
      { max: 6, min: 1, code: 61, humidity: 88, rain: 70 },
      { max: 7, min: 2, code: 3, humidity: 84, rain: 30 },
      { max: 9, min: 3, code: 2, humidity: 76, rain: 15 },
      { max: 8, min: 2, code: 45, humidity: 90, rain: 10 },
      { max: 5, min: 0, code: 61, humidity: 87, rain: 65 },
      { max: 4, min: -1, code: 80, humidity: 82, rain: 55 },
      { max: 6, min: 1, code: 1, humidity: 72, rain: 10 }
    ].map((d, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      return { ...d, date: date.toISOString().slice(0, 10), weekday: date.getDay() };
    });
    const hourly = Array.from({ length: 24 }, (_, h) => {
      const base = 3 + Math.sin((h - 6) / 24 * Math.PI * 2) * 4;
      const rain = h >= 6 && h <= 12 ? 55 + (h % 4) * 8 : h >= 17 && h <= 21 ? 35 : 10;
      return {
        hour: h,
        temp: Math.round((base + (h % 3) * 0.4) * 10) / 10,
        humidity: Math.round(78 + Math.cos(h / 24 * Math.PI * 2) * 8),
        rain,
        wind: 6 + (h % 5) * 2
      };
    });
    return {
      current: { temp: 4.2, feels: 1.6, humidity: 87, wind: 12, code: 61, precip: 0.8 },
      daily: days,
      hourly,
      location: 'Тернопіль',
      updated: now.toISOString(),
      demo: true
    };
  }

  const PROJECT = {
    name: 'AgroLens',
    tagline: 'Бачити рослину наскрізь',
    scenario: 'Фермер або власник кімнатних рослин хоче сфотографувати уражений листок і за секунди отримати діагноз із планом лікування, щоб урятувати врожай чи улюблену рослину без консультації агронома.',
    scenarioShort: 'Сфотографувати листок → отримати діагноз → зберегти план лікування',
    roles: [
      { initials: 'МР', name: 'Романюк М. М.', role: 'Розробник', duty: 'PWA-прототип, діагностика, побутовий режим, інтеграція Gemini', accent: '#4E9B62' },
      { initials: 'ІК', name: 'Калюга І. В.', role: 'Дизайнер', duty: 'Дизайн-система, палітра, екрани, адаптивність, доступність', accent: '#E9A23B' },
      { initials: 'МЩ', name: 'Щербій М. М.', role: 'Аналітик', duty: 'Потреба користувача, сценарій, технічне завдання, критерії', accent: '#4D7EA8' },
      { initials: 'МБ', name: 'Бучма М. М.', role: 'Тестувальник', duty: 'Тест-кейси, чекліст, перевірка сценарію та офлайн-режиму', accent: '#7C6BB0' }
    ],
    requirements: [
      {
        id: 'R1',
        title: 'Діагностика за фото',
        text: 'Користувач завантажує або фотографує листок, запускає аналіз і бачить діагноз, впевненість і план дій.',
        criteria: 'Після натискання «Аналізувати» протягом 5 секунд відкривається екран із назвою хвороби, відсотком упевненості та щонайменше трьома кроками лікування.'
      },
      {
        id: 'R2',
        title: 'Побутовий режим',
        text: 'Користувач веде список кімнатних рослин, бачить наступний полив і отримує нагадування.',
        criteria: 'Додана рослина з’являється в «Мій дім», показує дату наступного поливу; після «Полити» лічильник оновлюється, а подія з’являється в журналі.'
      },
      {
        id: 'R3',
        title: 'Офлайн і AI-агент',
        text: 'Довідник, журнал і демо-діагностика працюють без інтернету; з ключем Gemini вмикається реальний аналіз фото та чат.',
        criteria: 'У режимі офлайн відкриваються довідник, журнал і демо-сканування; після валідного ключа статус змінюється на «Gemini підключено», а чат відповідає на запит про рослину.'
      }
    ],
    tasks: [
      { id: 1, title: 'Уточнити потребу та скласти ТЗ', owner: 'Щербій', hours: 2, result: 'Сценарій + 3 вимоги з критеріями', dep: 'Матеріали ПР4', status: 'done' },
      { id: 2, title: 'Доопрацювати ескіз і дизайн-систему', owner: 'Калюга', hours: 4, result: 'Палітра, сітка, 9 екранів', dep: 'ТЗ (задача 1)', status: 'done' },
      { id: 3, title: 'Зібрати каркас PWA та навігацію', owner: 'Романюк', hours: 5, result: 'Працюючий shell, роутер, теми', dep: 'Дизайн (задача 2)', status: 'done' },
      { id: 4, title: 'Реалізувати діагностику й демо-базу', owner: 'Романюк', hours: 6, result: 'Сценарій «фото → діагноз → план»', dep: 'Каркас (задача 3)', status: 'done' },
      { id: 5, title: 'Додати «Мій дім», нагадування, журнал', owner: 'Романюк', hours: 5, result: 'Побутовий режим і збереження даних', dep: 'Каркас (задача 3)', status: 'done' },
      { id: 6, title: 'Підключити Gemini та AI-агронома', owner: 'Романюк', hours: 3, result: 'Реальний AI + офлайн-фолбек', dep: 'Ключ Gemini (задача 1)', status: 'done' },
      { id: 7, title: 'Перевірити сценарій, зібрати звіт і демо', owner: 'Бучма + команда', hours: 4, result: 'Чекліст, 8 тест-кейсів, звіт', dep: 'Прототип (задачі 4–6)', status: 'in-progress' }
    ],
    checklist: [
      { text: 'Сценарій сформульовано за шаблоном «Хто → що → навіщо»', done: true },
      { text: 'Ролі розподілено, у кожного є вимірюваний результат', done: true },
      { text: 'ТЗ містить 3 вимоги та 3 критерії приймання', done: true },
      { text: 'План містить 7 завдань і позначену залежність', done: true },
      { text: 'Прототип проходить обраний сценарій від початку до результату', done: true },
      { text: 'Побутовий режим: рослини, полив, нагадування, журнал', done: true },
      { text: 'Офлайн-довідник і демо-діагностика працюють без мережі', done: true },
      { text: 'AI-агроном відповідає або коректно переходить у демо-режим', done: true },
      { text: 'Звіт містить скріншоти, чекліст і висновки', done: true },
      { text: 'Демонстрація вкладається у 5 хвилин', done: false }
    ],
    tests: [
      { id: 'T1', case: 'Відкрити застосунок без інтернету', expected: 'Завантажується shell, доступні довідник і журнал', status: 'pass' },
      { id: 'T2', case: 'Обрати демо-листок томата й запустити аналіз', expected: 'За ≤5 с з’являється фітофтороз із планом', status: 'pass' },
      { id: 'T3', case: 'Завантажити власне фото', expected: 'Фото показується у прев’ю, аналіз запускається', status: 'pass' },
      { id: 'T4', case: 'Додати рослину «Кухня / Базилік»', expected: 'Картка з’являється, полив через 2 дні', status: 'pass' },
      { id: 'T5', case: 'Натиснути «Полити»', expected: 'Дата оновлюється, подія в журналі', status: 'pass' },
      { id: 'T6', case: 'Пройти симптом-чекер: жовте листя + частий полив', expected: 'Перший результат — коренева гниль', status: 'pass' },
      { id: 'T7', case: 'Ввести невалідний ключ Gemini', expected: 'Помилка, застосунок лишається в демо-режимі', status: 'pass' },
      { id: 'T8', case: 'Перемкнути тему та режим', expected: 'Стан зберігається після перезавантаження', status: 'pass' }
    ],
    contributions: [
      { name: 'Романюк М. М.', text: 'Я підготував PWA-прототип, діагностику та AI-інтеграцію і передав його тестувальнику й дизайнеру для перевірки. Узгодив із дизайнером сітку екранів і з аналітиком — формулювання критеріїв приймання.' },
      { name: 'Калюга І. В.', text: 'Я підготував дизайн-систему й адаптивні макети та передав їх розробнику. Узгодив із розробником розміри компонентів і контраст у темній темі.' },
      { name: 'Щербій М. М.', text: 'Я підготував сценарій і технічне завдання з критеріями та передав їх команді. Узгодив із тестувальником формулювання тест-кейсів.' },
      { name: 'Бучма М. М.', text: 'Я підготував чекліст і вісім тест-кейсів та передав результати розробнику. Узгодив із розробником виправлення переходів і станів поливу.' }
    ]
  };

  return {
    CATEGORIES, SEVERITY, DISEASES, byId, SAMPLES, PARTS, SYMPTOMS, CONTEXT,
    CONTEXT_WEIGHTS, PLANTS_SEED, FIELDS_SEED, JOURNAL_SEED, CHAT_PROMPTS,
    weatherInfo, demoWeather, PROJECT
  };
})();
