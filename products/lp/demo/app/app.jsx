// mitooshi main App — state machine + screen routing
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Asset map for preset illustrations (uses copied PNGs + iconographic placeholders for missing files)
// Iconographic placeholders avoid Japanese text rendering issues in data: SVG URLs.
const iconSvg = (kind) => {
  const wrap = (inner, bg = '#eafaf4') => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='${bg}'/>${inner}</svg>`;
  const svgs = {
    hamigaki: wrap(`<rect x='60' y='110' width='14' height='60' rx='5' fill='#FFB6B6'/><rect x='52' y='95' width='30' height='22' rx='6' fill='#fff' stroke='#0073cc' stroke-width='2'/><circle cx='130' cy='90' r='35' fill='#FFE4C4'/><circle cx='120' cy='85' r='3' fill='#333'/><circle cx='140' cy='85' r='3' fill='#333'/><path d='M115 105 Q130 115 145 105' stroke='#333' stroke-width='2' fill='none'/><path d='M150 70 l5 5 M155 70 l-5 5' stroke='#0073cc' stroke-width='3' stroke-linecap='round'/>`),
    wakeup: wrap(`<circle cx='150' cy='60' r='28' fill='#FFD166'/><path d='M150 25 l0 -8 M180 35 l5 -5 M120 35 l-5 -5 M188 60 l8 0' stroke='#FFD166' stroke-width='3' stroke-linecap='round'/><circle cx='80' cy='115' r='28' fill='#FFE4C4'/><circle cx='73' cy='113' r='2.5' fill='#333'/><circle cx='87' cy='113' r='2.5' fill='#333'/><path d='M70 125 Q80 130 90 125' stroke='#333' stroke-width='2' fill='none'/><rect x='40' y='140' width='80' height='35' rx='10' fill='#00B894'/>`),
    sleep: wrap(`<rect x='30' y='100' width='140' height='65' rx='10' fill='#0073cc' opacity='0.3'/><rect x='30' y='100' width='140' height='15' rx='6' fill='#0073cc'/><circle cx='75' cy='95' r='22' fill='#FFE4C4'/><path d='M65 95 l8 0 M82 95 l8 0' stroke='#333' stroke-width='2' stroke-linecap='round'/><text x='130' y='70' font-family='sans-serif' font-size='28' font-weight='900' fill='#0073cc'>Z</text><text x='150' y='55' font-family='sans-serif' font-size='20' font-weight='900' fill='#0073cc'>z</text>`, '#e8f1fa'),
    dress: wrap(`<path d='M70 70 L100 60 L130 70 L150 90 L140 110 L130 100 L130 160 L70 160 L70 100 L60 110 L50 90 Z' fill='#00B894'/><circle cx='100' cy='45' r='22' fill='#FFE4C4'/><circle cx='95' cy='43' r='2.5' fill='#333'/><circle cx='105' cy='43' r='2.5' fill='#333'/>`),
    gochiso: wrap(`<rect x='40' y='130' width='120' height='30' rx='6' fill='#8B5A2B'/><circle cx='80' cy='110' r='22' fill='#fff' stroke='#888' stroke-width='2'/><circle cx='130' cy='110' r='18' fill='#0073cc'/><circle cx='100' cy='75' r='28' fill='#FFE4C4'/><circle cx='93' cy='75' r='2.5' fill='#333'/><circle cx='107' cy='75' r='2.5' fill='#333'/><path d='M90 88 Q100 95 110 88' stroke='#333' stroke-width='2' fill='none'/><path d='M155 50 l5 5 M158 48 l-3 8' stroke='#00B894' stroke-width='2.5' stroke-linecap='round'/>`),
    meal: wrap(`<rect x='40' y='100' width='120' height='40' rx='8' fill='#fff' stroke='#888' stroke-width='2'/><circle cx='100' cy='110' r='22' fill='#FFB6B6'/><circle cx='100' cy='110' r='10' fill='#fff'/><rect x='35' y='75' width='4' height='35' fill='#888'/><rect x='30' y='65' width='14' height='12' fill='#888'/><rect x='160' y='75' width='4' height='35' fill='#888'/><circle cx='162' cy='65' r='10' fill='#888'/>`),
    snack: wrap(`<path d='M75 65 Q100 50 125 65 Q140 90 130 110 L70 110 Q60 90 75 65 Z' fill='#FFE4C4' stroke='#FFB6B6' stroke-width='2'/><circle cx='90' cy='80' r='3' fill='#8B5A2B'/><circle cx='110' cy='85' r='3' fill='#8B5A2B'/><circle cx='100' cy='95' r='3' fill='#8B5A2B'/><polygon points='70,110 100,170 130,110' fill='#D4A574'/><line x1='80' y1='125' x2='110' y2='155' stroke='#8B5A2B' stroke-width='1.5'/><line x1='100' y1='115' x2='100' y2='160' stroke='#8B5A2B' stroke-width='1.5'/>`),
    shoes: wrap(`<path d='M40 120 L60 100 L100 100 L130 120 L160 120 L160 145 L40 145 Z' fill='#0073cc'/><path d='M60 100 L100 100 L100 120 L60 120 Z' fill='#fff' opacity='0.4'/><line x1='75' y1='105' x2='75' y2='118' stroke='#fff' stroke-width='2'/><line x1='85' y1='105' x2='85' y2='118' stroke='#fff' stroke-width='2'/>`),
    walk: wrap(`<circle cx='100' cy='50' r='18' fill='#FFE4C4'/><rect x='90' y='65' width='20' height='40' rx='6' fill='#00B894'/><line x1='90' y1='75' x2='75' y2='95' stroke='#FFE4C4' stroke-width='8' stroke-linecap='round'/><line x1='110' y1='75' x2='128' y2='90' stroke='#FFE4C4' stroke-width='8' stroke-linecap='round'/><line x1='95' y1='105' x2='80' y2='150' stroke='#0073cc' stroke-width='10' stroke-linecap='round'/><line x1='105' y1='105' x2='125' y2='150' stroke='#0073cc' stroke-width='10' stroke-linecap='round'/>`),
    park: wrap(`<circle cx='150' cy='80' r='35' fill='#00B894'/><rect x='145' y='105' width='10' height='40' fill='#8B5A2B'/><circle cx='60' cy='90' r='25' fill='#7BC97B'/><rect x='57' y='110' width='6' height='30' fill='#8B5A2B'/><rect x='30' y='150' width='140' height='15' fill='#a8d8a8'/>`, '#e8f5e9'),
    shop: wrap(`<rect x='55' y='80' width='90' height='80' rx='5' fill='#0073cc'/><path d='M55 80 L70 50 L130 50 L145 80 Z' fill='#0073cc'/><rect x='75' y='100' width='50' height='40' fill='#fff'/><rect x='95' y='100' width='10' height='40' fill='#0073cc'/>`, '#fff5f5'),
    school: wrap(`<rect x='40' y='100' width='120' height='60' fill='#FFB6B6'/><polygon points='40,100 100,55 160,100' fill='#e74c3c'/><rect x='80' y='120' width='40' height='40' fill='#8B5A2B'/><circle cx='100' cy='75' r='6' fill='#FFD166'/>`),
    study: wrap(`<rect x='30' y='120' width='140' height='40' rx='4' fill='#8B5A2B'/><rect x='50' y='80' width='100' height='40' fill='#fff' stroke='#888' stroke-width='2'/><line x1='60' y1='90' x2='140' y2='90' stroke='#888' stroke-width='1.5'/><line x1='60' y1='100' x2='140' y2='100' stroke='#888' stroke-width='1.5'/><line x1='60' y1='110' x2='110' y2='110' stroke='#888' stroke-width='1.5'/><circle cx='160' cy='75' r='8' fill='#FFD166'/>`),
  };
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(wrap ? svgs[kind] : svgs.hamigaki);
};
const placeholderSvg = (kind) => iconSvg(kind);

// Real illustration library from shared/illust/mitooshi/ (Japanese-named PNGs).
// Base path is set per-deploy via window.__ILLUST_BASE in index.html
// (dev: '../../../shared/illust/mitooshi/', LP demo: './assets/').
const REAL = (name) => (typeof window !== 'undefined' && window.__ILLUST_BASE ? window.__ILLUST_BASE : '../../../shared/illust/mitooshi/') + encodeURIComponent(name);

const ILLUST_LIB = [
  // ❶ あさ・身辺自立（10）
  { id: 'okiru',         cat: 'あさ',     label: 'おきる',         src: REAL('おきる.png') },
  { id: 'kao_arau',      cat: 'あさ',     label: 'かおをあらう',   src: REAL('かおをあらう.png') },
  { id: 'kami_tokasu',   cat: 'あさ',     label: 'かみをとかす',   src: REAL('かみをとかす.png') },
  { id: 'kigae',         cat: 'あさ',     label: 'きがえ',         src: REAL('きがえ.png') },
  { id: 'pants',         cat: 'あさ',     label: 'パンツをはく',   src: REAL('パンツをはく.png') },
  { id: 'seifuku',       cat: 'あさ',     label: 'せいふくをきる', src: REAL('せいふくをきる.png') },
  { id: 'kutsu',         cat: 'あさ',     label: 'くつをはく',     src: REAL('くつをはく.png') },
  { id: 'te_arau',       cat: 'あさ',     label: 'てをあらう',     src: REAL('てをあらう.png') },
  { id: 'mochimono',     cat: 'あさ',     label: 'もちもの',       src: REAL('もちもの.png') },
  { id: 'itte_kimasu',   cat: 'あさ',     label: 'いってきます',   src: REAL('いってきます.png') },

  // ❷ よる・お風呂・睡眠（7）
  { id: 'ofuro',         cat: 'よる',     label: 'おふろ',         src: REAL('おふろ.png') },
  { id: 'karada_arau',   cat: 'よる',     label: 'からだをあらう', src: REAL('からだをあらう.png') },
  { id: 'atama_arau',    cat: 'よる',     label: 'あたまをあらう', src: REAL('あたまをあらう.png') },
  { id: 'karada_fuku',   cat: 'よる',     label: 'からだをふく',   src: REAL('からだをふく.png') },
  { id: 'mizu_nomu',     cat: 'よる',     label: 'みずをのむ',     src: REAL('みずをのむ.png') },
  { id: 'pajama',        cat: 'よる',     label: 'パジャマ',       src: REAL('パジャマ.png') },
  { id: 'oyasumi',       cat: 'よる',     label: 'おやすみ',       src: REAL('おやすみ.png') },

  // ❸ 食事（10）
  { id: 'itadakimasu',   cat: 'たべる',   label: 'いただきます',   src: REAL('いただきます.png') },
  { id: 'gohan',         cat: 'たべる',   label: 'ごはん',         src: REAL('ごはん.png') },
  { id: 'ohiru',         cat: 'たべる',   label: 'おひるごはん',   src: REAL('おひるごはん.png') },
  { id: 'ban_gohan',     cat: 'たべる',   label: 'ばんごはん',     src: REAL('ばんごはん.png') },
  { id: 'taberu',        cat: 'たべる',   label: 'たべる',         src: REAL('たべる.png') },
  { id: 'gochisosama',   cat: 'たべる',   label: 'ごちそうさま',   src: REAL('ごちそうさま.png') },
  { id: 'gyunyu',        cat: 'たべる',   label: 'ぎゅうにゅう',   src: REAL('ぎゅうにゅう.png') },
  { id: 'okawari',       cat: 'たべる',   label: 'おかわり',       src: REAL('おかわり.png') },
  { id: 'gohan_hoshii',  cat: 'たべる',   label: 'ごはんがほしい', src: REAL('ごはんがほしい.png') },
  { id: 'oyatsu',        cat: 'たべる',   label: 'おやつをたべる', src: REAL('おやつをたべる.png') },

  // ❹ おでかけ・移動（14）
  { id: 'eki',           cat: 'おでかけ', label: 'えきにいく',     src: REAL('えきにいく.png') },
  { id: 'densha',        cat: 'おでかけ', label: 'でんしゃにのる', src: REAL('でんしゃにのる.png') },
  { id: 'kuruma',        cat: 'おでかけ', label: 'くるまにのる',   src: REAL('くるまにのる.png') },
  { id: 'bus',           cat: 'おでかけ', label: 'バスにのる',     src: REAL('バスにのる.png') },
  { id: 'tsuita',        cat: 'おでかけ', label: 'ついた！',       src: REAL('ついた！.png') },
  { id: 'ie_kaeru',      cat: 'おでかけ', label: 'いえにかえる',   src: REAL('いえにかえる.png') },
  { id: 'kaimono',       cat: 'おでかけ', label: 'かいもの',       src: REAL('かいもの.png') },
  { id: 'super',         cat: 'おでかけ', label: 'スーパー',       src: REAL('スーパーにいく.png') },
  { id: 'cart',          cat: 'おでかけ', label: 'カート',         src: REAL('カートをおす.png') },
  { id: 'reji',          cat: 'おでかけ', label: 'レジにならぶ',   src: REAL('レジにならぶ.png') },
  { id: 'okashi_erabu',  cat: 'おでかけ', label: 'おかしえらぶ',   src: REAL('おかしえらぶ.png') },
  { id: 'koen',          cat: 'おでかけ', label: 'こうえん',       src: REAL('こうえんにいく.png') },
  { id: 'buranko',       cat: 'おでかけ', label: 'ブランコ',       src: REAL('ブランコにのる.png') },
  { id: 'suberidai',     cat: 'おでかけ', label: 'すべりだい',     src: REAL('すべりだいすべる.png') },

  // ❺ びょういん・歯医者・美容室（11）
  { id: 'byouin',        cat: 'びょういん', label: 'びょういん',   src: REAL('びょういん.png') },
  { id: 'uketsuke',      cat: 'びょういん', label: 'うけつけ',     src: REAL('うけつけ.png') },
  { id: 'shinsatsu',     cat: 'びょういん', label: 'しんさつ',     src: REAL('しんさつ.png') },
  { id: 'taijuu',        cat: 'びょういん', label: 'たいじゅう',   src: REAL('たいじゅうはかる.png') },
  { id: 'chuusha',       cat: 'びょういん', label: 'ちゅうしゃ',   src: REAL('ちゅうしゃする.png') },
  { id: 'kusuri_morau',  cat: 'びょういん', label: 'くすりをもらう', src: REAL('くすりをもらう.png') },
  { id: 'shika',         cat: 'びょういん', label: 'しかにいく',   src: REAL('しかにいく.png') },
  { id: 'kuchi_akeru',   cat: 'びょういん', label: 'くちをあける', src: REAL('くちをあける.png') },
  { id: 'rentgen',       cat: 'びょういん', label: 'レントゲン',   src: REAL('レントゲンとる.png') },
  { id: 'choushinki',    cat: 'びょういん', label: 'ちょうしんき', src: REAL('ちょうしんき.png') },
  { id: 'biyou',         cat: 'びょういん', label: 'びようしつ',   src: REAL('びようしついく.png') },

  // ❻ がっこう・園（18）
  { id: 'gakkou',        cat: 'がっこう', label: 'がっこう',       src: REAL('がっこうにいく.png') },
  { id: 'youchien',      cat: 'がっこう', label: 'ようちえん',     src: REAL('ようちえんいく.png') },
  { id: 'hoikuen',       cat: 'がっこう', label: 'ほいくえん',     src: REAL('ほいくえんいく.png') },
  { id: 'omukae',        cat: 'がっこう', label: 'おむかえ',       src: REAL('おむかえ.png') },
  { id: 'asa_kai',       cat: 'がっこう', label: 'あさのかい',     src: REAL('あさのかい.png') },
  { id: 'kaeri_kai',     cat: 'がっこう', label: 'かえりのかい',   src: REAL('かえりのかい.png') },
  { id: 'jugyou',        cat: 'がっこう', label: 'じゅぎょう',     src: REAL('じゅぎょう.png') },
  { id: 'taiiku',        cat: 'がっこう', label: 'たいいく',       src: REAL('たいいくじかん.png') },
  { id: 'ongaku',        cat: 'がっこう', label: 'おんがく',       src: REAL('おんがくじかん.png') },
  { id: 'kyuushoku',     cat: 'がっこう', label: 'きゅうしょく',   src: REAL('きゅうしょく.png') },
  { id: 'yasumi_jikan',  cat: 'がっこう', label: 'やすみじかん',   src: REAL('やすみじかん.png') },
  { id: 'soto_asobu',    cat: 'がっこう', label: 'そとであそぶ',   src: REAL('そとであそぶ.png') },
  { id: 'osouji',        cat: 'がっこう', label: 'おそうじ',       src: REAL('おそうじする.png') },
  { id: 'shukudai',      cat: 'がっこう', label: 'しゅくだい',     src: REAL('しゅくだい.png') },
  { id: 'ehon',          cat: 'がっこう', label: 'えほん',         src: REAL('えほん.png') },
  { id: 'sensei_talk',   cat: 'がっこう', label: 'せんせいとはなす', src: REAL('せんせいとおはなし.png') },
  { id: 'narabu',        cat: 'がっこう', label: 'ならぶ',         src: REAL('ならぶ.png') },
  { id: 'okatazuke',     cat: 'がっこう', label: 'おかたづけ',     src: REAL('おかたづけ.png') },

  // ❼ からだのケア・身辺自立・PECS（14）
  { id: 'hamigaki',      cat: 'からだ',   label: 'はみがき',       src: REAL('はみがき.png') },
  { id: 'hamigakiko',    cat: 'からだ',   label: 'はみがきこ',     src: REAL('はみがきこ.png') },
  { id: 'haburashi',     cat: 'からだ',   label: 'はぶらしをもつ', src: REAL('はぶらしをもつ.png') },
  { id: 'kuchi_susugu',  cat: 'からだ',   label: 'くちをすすぐ',   src: REAL('くちをすすぐ.png') },
  { id: 'toilet',        cat: 'からだ',   label: 'トイレ',         src: REAL('トイレ.png') },
  { id: 'kusuri_nomu',   cat: 'からだ',   label: 'くすりをのむ',   src: REAL('くすりをのむ.png') },
  { id: 'give_me',       cat: 'からだ',   label: 'ください',       src: REAL('ください.png') },
  { id: 'okashi_hoshii', cat: 'からだ',   label: 'おかしがほしい', src: REAL('おかしがほしい.png') },
  { id: 'omocha_hoshii', cat: 'からだ',   label: 'おもちゃがほしい', src: REAL('おもちゃがほしい.png') },
  { id: 'erabu',         cat: 'からだ',   label: 'えらぶ',         src: REAL('えらぶ.png') },
  { id: 'suwaru',        cat: 'からだ',   label: 'すわる',         src: REAL('すわる.png') },
  { id: 'matsu',         cat: 'からだ',   label: 'まつ',           src: REAL('まつ.png') },
  { id: 'shizukani',     cat: 'からだ',   label: 'しずかに',       src: REAL('しずかに.png') },
  { id: 'goaisatsu',     cat: 'からだ',   label: 'ごあいさつ',     src: REAL('ごあいさつ.png') },

  // ❽ ごほうび・楽しみ・達成（10）
  { id: 'gohoubi',       cat: 'ごほうび', label: 'ごほうび',       src: REAL('ごほうび.png') },
  { id: 'sticker',       cat: 'ごほうび', label: 'シール',         src: REAL('シールをはる.png') },
  { id: 'tv',            cat: 'ごほうび', label: 'テレビ',         src: REAL('テレビをみる.png') },
  { id: 'douga',         cat: 'ごほうび', label: 'どうが',         src: REAL('どうがをみる.png') },
  { id: 'game',          cat: 'ごほうび', label: 'ゲーム',         src: REAL('ゲームをする.png') },
  { id: 'omocha_asobi',  cat: 'ごほうび', label: 'おもちゃ',       src: REAL('おもちゃあそび.png') },
  { id: 'ehon_miru',     cat: 'ごほうび', label: 'えほんをみる',   src: REAL('えほんをみる.png') },
  { id: 'dakko',         cat: 'ごほうび', label: 'だっこ',         src: REAL('だっこする.png') },
  { id: 'homete',        cat: 'ごほうび', label: 'ほめてもらう',   src: REAL('ほめてもらう.png') },
  { id: 'owari',         cat: 'ごほうび', label: 'おわり',         src: REAL('おわり.png') },

  // ❾ 行事・お祝い（6）
  { id: 'tanjoubi',      cat: 'ぎょうじ', label: 'たんじょうび',   src: REAL('たんじょうび.png') },
  { id: 'christmas',     cat: 'ぎょうじ', label: 'クリスマス',     src: REAL('クリスマス.png') },
  { id: 'oshougatsu',    cat: 'ぎょうじ', label: 'おしょうがつ',   src: REAL('おしょうがつ.png') },
  { id: 'hinamatsuri',   cat: 'ぎょうじ', label: 'ひなまつり',     src: REAL('ひなまつり.png') },
  { id: 'kodomonohi',    cat: 'ぎょうじ', label: 'こどものひ',     src: REAL('こどものひ.png') },
  { id: 'natsumatsuri',  cat: 'ぎょうじ', label: 'なつまつり',     src: REAL('なつまつり.png') },
];

// Default tweak values
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#00B894",
  "density": "regular",
  "dark": false,
  "fabPosition": "center",
  "completeStyle": "confetti",
  "view": "prototype"
}/*EDITMODE-END*/;

let cardIdSeq = 0;
const newCardId = () => `c_${Date.now()}_${++cardIdSeq}`;
const newSceneId = () => `s_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

// Build presets using illust lib
const buildPresets = () => {
  const now = Date.now();
  const findIllust = (id) => ILLUST_LIB.find(i => i.id === id);
  const card = (illId, label) => {
    const il = findIllust(illId);
    return { id: newCardId(), type: 'illust', label, illustId: illId, illustSrc: il?.src };
  };
  const cardClock = (h, m, label) => ({ id: newCardId(), type: 'clock', label, clockTime: {h, m} });
  const cardText = (label) => ({ id: newCardId(), type: 'text', label });
  return [
    // 基本プリセット
    {
      id: newSceneId(), name: 'あさのしたく', isFavorite: true, favoriteSetAt: now - 1000,
      createdAt: now - 100000, updatedAt: now, lastUsedAt: now - 5000,
      cards: [
        card('okiru', 'おきる'),
        card('kao_arau', 'かおをあらう'),
        card('kigae', 'きがえる'),
        card('gohan', 'ごはん'),
        card('hamigaki', 'はみがき'),
        card('mochimono', 'もちもの'),
        card('kutsu', 'くつをはく'),
        card('itte_kimasu', 'いってきます'),
      ],
    },
    {
      id: newSceneId(), name: 'おやすみ', isFavorite: true, favoriteSetAt: now - 2000,
      createdAt: now - 200000, updatedAt: now, lastUsedAt: now - 50000,
      cards: [
        card('ofuro', 'おふろ'),
        card('karada_arau', 'からだをあらう'),
        card('hamigaki', 'はみがき'),
        card('pajama', 'パジャマ'),
        card('ehon', 'えほん'),
        card('oyasumi', 'おやすみ'),
      ],
    },
    {
      id: newSceneId(), name: 'おでかけ', isFavorite: false,
      createdAt: now - 300000, updatedAt: now, lastUsedAt: now - 100000,
      cards: [
        card('kutsu', 'くつをはく'),
        card('kuruma', 'くるまにのる'),
        card('tsuita', 'ついた！'),
        card('ie_kaeru', 'いえにかえる'),
        card('gohoubi', 'ごほうび'),
      ],
    },
    // インタビュー検証用デモシーン
    {
      id: newSceneId(), name: 'ばぁばの家までのルート', isFavorite: true, favoriteSetAt: now - 500,
      createdAt: now - 400000, updatedAt: now, lastUsedAt: now - 80000,
      cards: [
        card('kutsu', 'くつをはく'),
        card('densha', 'でんしゃにのる'),
        card('tsuita', 'ついた！'),
        card('dakko', 'だっこ'),
        card('gohoubi', 'ごほうび'),
      ],
    },
    {
      id: newSceneId(), name: 'はじめての歯医者さん', isFavorite: false,
      createdAt: now - 500000, updatedAt: now, lastUsedAt: null,
      cards: [
        card('shika', 'しかにいく'),
        card('uketsuke', 'うけつけ'),
        card('matsu', 'まつ'),
        card('kuchi_akeru', 'くちをあける'),
        card('choushinki', 'ちょうしんき'),
        card('kusuri_morau', 'くすりをもらう'),
        card('gohoubi', 'ごほうび'),
      ],
    },
    {
      id: newSceneId(), name: 'スーパーでお買い物', isFavorite: false,
      createdAt: now - 600000, updatedAt: now, lastUsedAt: null,
      cards: [
        card('kutsu', 'くつをはく'),
        card('super', 'スーパーにいく'),
        card('cart', 'カートをおす'),
        card('okashi_erabu', 'おかしえらぶ'),
        card('reji', 'レジにならぶ'),
        card('ie_kaeru', 'いえにかえる'),
      ],
    },
    {
      id: newSceneId(), name: 'こうえんであそぶ', isFavorite: false,
      createdAt: now - 700000, updatedAt: now, lastUsedAt: null,
      cards: [
        card('kutsu', 'くつをはく'),
        card('koen', 'こうえん'),
        card('buranko', 'ブランコ'),
        card('suberidai', 'すべりだい'),
        card('mizu_nomu', 'みずをのむ'),
        card('ie_kaeru', 'いえにかえる'),
      ],
    },
    {
      id: newSceneId(), name: '小学校1日', isFavorite: false,
      createdAt: now - 800000, updatedAt: now, lastUsedAt: null,
      cards: [
        card('gakkou', 'がっこう'),
        card('asa_kai', 'あさのかい'),
        card('jugyou', 'じゅぎょう'),
        card('kyuushoku', 'きゅうしょく'),
        card('yasumi_jikan', 'やすみじかん'),
        card('kaeri_kai', 'かえりのかい'),
        card('ie_kaeru', 'いえにかえる'),
        card('shukudai', 'しゅくだい'),
      ],
    },
    {
      id: newSceneId(), name: 'たんじょうびパーティー', isFavorite: false,
      createdAt: now - 900000, updatedAt: now, lastUsedAt: null,
      cards: [
        card('tanjoubi', 'たんじょうび'),
        card('itadakimasu', 'いただきます'),
        card('taberu', 'たべる'),
        card('gochisosama', 'ごちそうさま'),
        card('gohoubi', 'ごほうび'),
        card('dakko', 'だっこ'),
      ],
    },
  ];
};

// ═══════════════════════════════════════════════
// Main App
// ═══════════════════════════════════════════════
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scenes, setScenes] = useState(buildPresets);
  const [profile, setProfile] = useState({ childName: 'みとおし', soundEnabled: true, plan: 'free' });

  // Navigation stack
  const [route, setRoute] = useState({ name: 'top' });
  const [draft, setDraft] = useState(null); // current new-list-in-progress
  const [editingScene, setEditingScene] = useState(null); // scene being edited
  const [cardDraft, setCardDraft] = useState(null); // current card being created

  // Exec runtime
  const [runDoneIds, setRunDoneIds] = useState(new Set());
  // Modal state
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [showOnb, setShowOnb] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(()=>setToast(null), 1800);
  };

  // Apply theme classes to body
  useEffect(() => {
    document.body.classList.toggle('dark', !!t.dark);
    document.body.dataset.density = t.density;
  }, [t.dark, t.density]);

  // ── handlers ──
  const onTabSwitch = (tab) => {
    if (tab === 'top') setRoute({ name: 'top' });
    else if (tab === 'create') {
      setDraft({ name: '', cards: [], isNew: true });
      setRoute({ name: 'newlist' });
    } else if (tab === 'my') setRoute({ name: 'my' });
  };

  const openScene = (scene) => {
    setRunDoneIds(new Set());
    // Update lastUsedAt
    setScenes(prev => prev.map(s => s.id === scene.id ? {...s, lastUsedAt: Date.now()} : s));
    setRoute({ name: 'exec', sceneId: scene.id });
  };

  const editScene = (scene) => {
    setEditingScene(scene);
    setDraft({ ...scene, isNew: false });
    setRoute({ name: 'edit' });
  };

  const toggleFav = (id) => {
    setScenes(prev => prev.map(s => s.id === id
      ? { ...s, isFavorite: !s.isFavorite, favoriteSetAt: !s.isFavorite ? Date.now() : s.favoriteSetAt }
      : s));
  };

  const saveDraftName = (name) => {
    setDraft(d => ({...d, name, isNew: true, cards: []}));
    setRoute({ name: 'edit' });
  };

  const startAddCard = () => setRoute({ name: 'cardtype' });
  const pickCardType = (type) => {
    if (type === 'illust') setRoute({ name: 'pickIllust' });
    else if (type === 'photo') setRoute({ name: 'photoCard' });
    else if (type === 'clock') setRoute({ name: 'clockCard' });
    else if (type === 'text')  setRoute({ name: 'textCard' });
  };

  const onIllustPicked = (it) => {
    setCardDraft({ type: 'illust', label: it.label, illustId: it.id, illustSrc: it.src });
    setRoute({ name: 'confirm' });
  };
  const onPhotoSaved = (cd) => {
    setCardDraft(cd);
    setRoute({ name: 'confirm' });
  };
  const onClockSaved = (cd) => addCardToDraft({...cd, id: newCardId()});
  const onTextSaved  = (cd) => addCardToDraft({...cd, id: newCardId()});
  const onConfirmed  = (cd) => addCardToDraft({...cd, id: newCardId()});

  const addCardToDraft = (card) => {
    setDraft(d => ({...d, cards: [...d.cards, card]}));
    setCardDraft(null);
    setRoute({ name: 'edit' });
  };

  const deleteCard = (cid) => {
    setDraft(d => ({...d, cards: d.cards.filter(c => c.id !== cid)}));
  };

  const saveScene = () => {
    if (draft.isNew) {
      const ns = {
        id: newSceneId(),
        name: draft.name,
        isFavorite: false,
        cards: draft.cards,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setScenes(prev => [ns, ...prev]);
    } else {
      setScenes(prev => prev.map(s => s.id === draft.id
        ? {...s, name: draft.name, cards: draft.cards, updatedAt: Date.now()}
        : s));
    }
    setDraft(null);
    setEditingScene(null);
    setRoute({ name: 'top' });
    showToast('リストを保存しました');
  };

  const askDelete = (onConfirm) => {
    setModal({
      title: 'カードを削除しますか？',
      body: 'この操作は取り消せません。',
      actions: [
        { label: 'キャンセル', kind: 'cancel', action: ()=>setModal(null) },
        { label: '削除する', kind: 'danger', action: ()=>{ setModal(null); onConfirm(); } },
      ],
    });
  };

  const askDiscard = (onConfirm) => {
    setModal({
      title: '編集を破棄しますか？',
      body: '保存していない変更は失われます。',
      actions: [
        { label: 'もどる', kind: 'cancel', action: ()=>setModal(null) },
        { label: '破棄する', kind: 'danger', action: ()=>{ setModal(null); onConfirm(); } },
      ],
    });
  };

  // exec
  const tapExec = (id) => setRunDoneIds(prev => new Set([...prev, id]));
  const completeExec = () => setRoute({ name: 'complete', sceneId: route.sceneId });
  const goHome = () => { setRunDoneIds(new Set()); setRoute({ name: 'top' }); };

  // --- view: design canvas ---
  if (t.view === 'canvas') return <CanvasView onBackToProto={()=>setTweak('view', 'prototype')} appProps={{ scenes, profile, onTab: onTabSwitch, onOpen: openScene, onEdit: editScene, onToggleFav: toggleFav }}/>;

  // --- view: app icon ---
  if (t.view === 'icon') return <IconShowcase onBack={()=>setTweak('view', 'prototype')}/>;

  // ── render screens ──
  let screen;
  const sceneInRoute = scenes.find(s => s.id === route.sceneId);
  const sceneName = draft?.name || editingScene?.name || '';

  if (showOnb) {
    screen = <Onboarding illustLib={ILLUST_LIB} onDone={()=>setShowOnb(false)}/>;
  } else if (route.name === 'top') {
    screen = <ScreenTop scenes={scenes} onOpen={openScene} onEdit={editScene} onToggleFav={toggleFav} onTab={onTabSwitch}/>;
  } else if (route.name === 'newlist') {
    screen = <ScreenNewList onBack={()=>{ setDraft(null); setRoute({name:'top'}); }} onSave={saveDraftName} onTab={onTabSwitch}/>;
  } else if (route.name === 'edit') {
    screen = <ScreenEdit
      sceneName={draft?.name || ''} cards={draft?.cards || []} isNew={draft?.isNew}
      onBack={()=>{ setDraft(null); setEditingScene(null); setRoute({name:'top'}); }}
      onSave={saveScene} onAddCard={startAddCard} onDeleteCard={deleteCard}
      onTab={onTabSwitch} askDelete={askDelete} askDiscard={askDiscard}/>;
  } else if (route.name === 'cardtype') {
    screen = <ScreenCardType sceneName={sceneName} onBack={()=>setRoute({name:'edit'})} onPick={pickCardType} onTab={onTabSwitch}/>;
  } else if (route.name === 'pickIllust') {
    screen = <ScreenIllust sceneName={sceneName} illustLib={ILLUST_LIB} onBack={()=>setRoute({name:'cardtype'})} onPick={onIllustPicked} onTab={onTabSwitch}/>;
  } else if (route.name === 'photoCard') {
    screen = <ScreenPhoto sceneName={sceneName} onBack={()=>setRoute({name:'cardtype'})} onSave={onPhotoSaved} onTab={onTabSwitch}/>;
  } else if (route.name === 'clockCard') {
    screen = <ScreenClock sceneName={sceneName} onBack={()=>setRoute({name:'cardtype'})} onSave={onClockSaved} onTab={onTabSwitch}/>;
  } else if (route.name === 'textCard') {
    screen = <ScreenText sceneName={sceneName} onBack={()=>setRoute({name:'cardtype'})} onSave={onTextSaved} onTab={onTabSwitch}/>;
  } else if (route.name === 'confirm') {
    screen = <ScreenConfirm sceneName={sceneName} draft={cardDraft}
      onBack={()=>setRoute({name: cardDraft?.type === 'photo' ? 'photoCard' : 'pickIllust'})}
      onSave={onConfirmed} onTab={onTabSwitch}/>;
  } else if (route.name === 'exec' && sceneInRoute) {
    screen = <ScreenExec scene={sceneInRoute} doneIds={runDoneIds} onTap={tapExec}
      onBack={()=>setRoute({name:'top'})} onComplete={completeExec}/>;
  } else if (route.name === 'complete' && sceneInRoute) {
    screen = <ScreenComplete scene={sceneInRoute} onHome={goHome}/>;
  } else if (route.name === 'my') {
    screen = <ScreenMy profile={profile} setProfile={setProfile} onTab={onTabSwitch} sceneCount={scenes.length}/>;
  } else {
    screen = <ScreenTop scenes={scenes} onOpen={openScene} onEdit={editScene} onToggleFav={toggleFav} onTab={onTabSwitch}/>;
  }

  // ── primary color override (CSS var) ──
  const primaryStyle = {
    '--primary': t.primaryColor,
    '--primary-hover': shade(t.primaryColor, -12),
    '--primary-soft': shade(t.primaryColor, 60, true),
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'30px 20px', gap:20, ...primaryStyle}}>
      <div className="iphone-shell" style={{transform: 'scale(1)'}}>
        <div className="iphone-screen">
          <div className="iphone-island"/>
          {screen}
          <div className="iphone-home-indicator"/>
          {modal && <ModalSheet {...modal}/>}
          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="表示モード"/>
        <TweakRadio label="View" value={t.view}
          options={['prototype','canvas','icon']}
          onChange={(v)=>setTweak('view', v)}/>
        <TweakSection label="クイック操作"/>
        <TweakButton label="オンボーディングを表示" onClick={()=>{ setTweak('view','prototype'); setShowOnb(true); }}/>
        <TweakButton label="TOPに戻る" onClick={()=>{ setRoute({name:'top'}); setDraft(null); }}/>
        <TweakSection label="テーマ"/>
        <TweakColor label="プライマリ" value={t.primaryColor} onChange={(v)=>setTweak('primaryColor', v)}/>
        <TweakToggle label="ダークモード" value={t.dark} onChange={(v)=>setTweak('dark', v)}/>
        <TweakSection label="レイアウト"/>
        <TweakRadio label="密度" value={t.density}
          options={['compact','regular','comfy']}
          onChange={(v)=>setTweak('density', v)}/>
      </TweaksPanel>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Color helpers
// ═══════════════════════════════════════════════
function shade(hex, amount, soft = false) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  if (soft) {
    // mix toward white
    const ratio = amount / 100;
    const nr = Math.round(r + (255-r)*ratio), ng = Math.round(g + (255-g)*ratio), nb = Math.round(b + (255-b)*ratio);
    return `rgb(${nr}, ${ng}, ${nb})`;
  }
  const f = 1 + amount/100;
  const cl = (v) => Math.max(0, Math.min(255, Math.round(v*f)));
  return `rgb(${cl(r)}, ${cl(g)}, ${cl(b)})`;
}

// ═══════════════════════════════════════════════
// Modal sheet
// ═══════════════════════════════════════════════
function ModalSheet({ title, body, actions }) {
  return (
    <div className="modal-backdrop" onClick={(e)=>{ if (e.target===e.currentTarget) actions[0]?.action(); }}>
      <div className="modal-sheet">
        <h3 className="modal-title">{title}</h3>
        <div className="modal-body">{body}</div>
        <div className="modal-actions">
          {actions.map((a, i) => (
            <button key={i} className={`modal-btn ${a.kind}`} onClick={a.action}>{a.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Canvas view — show all screens at once
// ═══════════════════════════════════════════════
function CanvasView({ onBackToProto, appProps }) {
  const presetScenes = buildPresets();
  const draft = { name: 'あさのしたく', cards: presetScenes[0].cards.slice(0,3), isNew: true };
  const oneScene = presetScenes[0];
  const partialDone = new Set([oneScene.cards[0].id, oneScene.cards[1].id]);
  const photoCard = { type: 'illust', label: 'はをみがく', illustId: 'hamigaki', illustSrc: ILLUST_LIB[0].src };

  const Frame = ({ children, label }) => (
    <DCArtboard id={label} label={label} width={393} height={852}>
      <div className="iphone-shell" style={{ width: 393, height: 852, padding: 0, borderRadius: 0, boxShadow:'none' }}>
        <div className="iphone-screen" style={{borderRadius: 0}}>
          {children}
        </div>
      </div>
    </DCArtboard>
  );

  const noop = () => {};
  const lib = ILLUST_LIB;

  return (
    <DesignCanvas title="mitooshi — 全画面俯瞰" onExitFocus={onBackToProto}>
      <DCSection id="onboarding" title="オンボーディング & アプリアイコン">
        <DCArtboard id="icon" label="App Icon / Splash" width={420} height={520}>
          <div style={{padding:30, display:'flex', flexDirection:'column', gap:24, alignItems:'center', justifyContent:'center', height:'100%', background:'#fff', borderRadius:12}}>
            <AppIcon size={140}/>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:32, fontWeight:900, color:'var(--primary)'}}>mitooshi</div>
              <div style={{fontSize:13, color:'var(--text-sub)', marginTop:4}}>子どもの見通しボード</div>
            </div>
            <div style={{display:'flex', gap:16, marginTop:20}}>
              <AppIcon size={68}/>
              <AppIcon size={48}/>
              <AppIcon size={36}/>
            </div>
          </div>
        </DCArtboard>
        <Frame label="Onboarding 1"><Onboarding illustLib={lib} onDone={noop}/></Frame>
      </DCSection>

      <DCSection id="main" title="メインフロー">
        <Frame label="S1 TOP"><ScreenTop scenes={presetScenes} onOpen={noop} onEdit={noop} onToggleFav={noop} onTab={noop}/></Frame>
        <Frame label="S2 リスト新規作成"><ScreenNewList onBack={noop} onSave={noop} onTab={noop}/></Frame>
        <Frame label="S3 カード種別選択"><ScreenCardType sceneName="あさのしたく" onBack={noop} onPick={noop} onTab={noop}/></Frame>
        <Frame label="S5 リスト編集"><ScreenEdit sceneName="あさのしたく" cards={presetScenes[0].cards} isNew={false} onBack={noop} onSave={noop} onAddCard={noop} onDeleteCard={noop} onTab={noop} askDelete={noop} askDiscard={noop}/></Frame>
      </DCSection>

      <DCSection id="card" title="カード作成（4種）">
        <Frame label="S4a イラスト"><ScreenIllust sceneName="あさのしたく" illustLib={lib} onBack={noop} onPick={noop} onTab={noop}/></Frame>
        <Frame label="S4b 写真"><ScreenPhoto sceneName="あさのしたく" onBack={noop} onSave={noop} onTab={noop}/></Frame>
        <Frame label="S4c 時計"><ScreenClock sceneName="あさのしたく" onBack={noop} onSave={noop} onTab={noop}/></Frame>
        <Frame label="S4d 文字"><ScreenText sceneName="あさのしたく" onBack={noop} onSave={noop} onTab={noop}/></Frame>
        <Frame label="S4 確認 (イラスト)"><ScreenConfirm sceneName="あさのしたく" draft={photoCard} onBack={noop} onSave={noop} onTab={noop}/></Frame>
      </DCSection>

      <DCSection id="run" title="実行 & 完了">
        <Frame label="S6 実行"><ScreenExec scene={oneScene} doneIds={partialDone} onTap={noop} onBack={noop} onComplete={noop}/></Frame>
        <Frame label="S7 完了"><ScreenComplete scene={oneScene} onHome={noop}/></Frame>
        <Frame label="S8 マイページ"><ScreenMy profile={{childName:'みとおし', soundEnabled: true, plan:'free'}} setProfile={noop} onTab={noop} sceneCount={3}/></Frame>
      </DCSection>
    </DesignCanvas>
  );
}

// ═══════════════════════════════════════════════
// Icon showcase (single page)
// ═══════════════════════════════════════════════
function IconShowcase({ onBack }) {
  return (
    <div style={{minHeight:'100vh', padding:40, display:'flex', flexDirection:'column', alignItems:'center', gap:32, background:'#eef0f3'}}>
      <div style={{fontSize:24, fontWeight:900, color:'var(--primary)'}}>mitooshi — App Icon & Splash</div>

      <div style={{display:'flex', gap:32, alignItems:'flex-end'}}>
        <div style={{textAlign:'center'}}>
          <AppIcon size={180}/>
          <div style={{marginTop:8, fontSize:12, color:'var(--text-sub)'}}>180×180</div>
        </div>
        <div style={{textAlign:'center'}}>
          <AppIcon size={120}/>
          <div style={{marginTop:8, fontSize:12, color:'var(--text-sub)'}}>120×120</div>
        </div>
        <div style={{textAlign:'center'}}>
          <AppIcon size={76}/>
          <div style={{marginTop:8, fontSize:12, color:'var(--text-sub)'}}>76×76</div>
        </div>
        <div style={{textAlign:'center'}}>
          <AppIcon size={48}/>
          <div style={{marginTop:8, fontSize:12, color:'var(--text-sub)'}}>48×48</div>
        </div>
      </div>

      <div style={{width:393, height:852, borderRadius:48, overflow:'hidden', background:'linear-gradient(180deg, #00d4ad 0%, #00B894 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxShadow:'0 30px 60px rgba(0,184,148,0.3)'}}>
        <AppIcon size={180}/>
        <div style={{marginTop:24, fontSize:42, fontWeight:900, color:'#fff', letterSpacing:'-0.5px'}}>mitooshi</div>
        <div style={{marginTop:8, fontSize:14, color:'rgba(255,255,255,0.8)'}}>みとおしボード</div>
      </div>

      <button className="cta-button" style={{maxWidth:200}} onClick={onBack}>プロトに戻る</button>
    </div>
  );
}

// Wait until DOM ready
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
