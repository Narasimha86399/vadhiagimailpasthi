/**
 * Tannir Transliteration Engine
 * Handles Malayalam <-> Telugu bidirectional conversion and Roman phonetic mapping.
 */

const Transliterate = (function () {
  // Direct Unicode Offset: Malayalam (0x0D00-0x0D6F) <-> Telugu (0x0C00-0x0C6F)
  function mlToTe(str) {
    if (!str) return '';
    let res = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code >= 0x0D00 && code <= 0x0D6F) {
        res += String.fromCharCode(code - 0x0100);
      } else if (code === 0x0D7A) { // ൺ -> ణ్
        res += '\u0C23\u0C4D';
      } else if (code === 0x0D7B) { // ൻ -> న్
        res += '\u0C28\u0C4D';
      } else if (code === 0x0D7C) { // ർ -> ర్
        res += '\u0C30\u0C4D';
      } else if (code === 0x0D7D) { // ൽ -> ల్
        res += '\u0C32\u0C4D';
      } else if (code === 0x0D7E) { // ൾ -> ళ్
        res += '\u0C33\u0C4D';
      } else if (code === 0x0D7F) { // ൿ -> క్
        res += '\u0C15\u0C4D';
      } else {
        res += str[i];
      }
    }
    return res;
  }

  function teToMl(str) {
    if (!str) return '';
    let res = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code >= 0x0C00 && code <= 0x0C6F) {
        res += String.fromCharCode(code + 0x0100);
      } else {
        res += str[i];
      }
    }
    return res;
  }

  // Romanization maps for phonetic search
  const indicToRomanMap = {
    // Vowels
    'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo', 'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ae', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oo', 'ఔ': 'au',
    'അ': 'a', 'ആ': 'aa', 'ഇ': 'i', 'ഈ': 'ee', 'ഉ': 'u', 'ഊ': 'oo', 'ഋ': 'ru', 'എ': 'e', 'ഏ': 'ae', 'ഐ': 'ai', 'ഒ': 'o', 'ഓ': 'oo', 'ഔ': 'au',
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo', 'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oo', 'ஔ': 'au',
    
    // Consonants Telugu
    'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'ఙ': 'ng', 'చ': 'ch', 'ఛ': 'chh', 'జ': 'j', 'ఝ': 'jh', 'ఞ': 'ny',
    'ట': 't', 'ఠ': 'th', 'డ': 'd', 'ఢ': 'dh', 'ణ': 'n', 'త': 't', 'థ': 'th', 'ద': 'd', 'ధ': 'dh', 'న': 'n',
    'ప': 'p', 'ఫ': 'ph', 'బ': 'b', 'భ': 'bh', 'మ': 'm', 'య': 'y', 'ర': 'r', 'ఱ': 'r', 'ల': 'l', 'ళ': 'l',
    'వ': 'v', 'శ': 'sh', 'ష': 'sh', 'స': 's', 'హ': 'h', 'క్ష': 'ksh',
    
    // Consonants Malayalam
    'ക': 'k', 'ഖ': 'kh', 'ഗ': 'g', 'ഘ': 'gh', 'ങ': 'ng', 'ച': 'ch', 'ഛ': 'chh', 'ജ': 'j', 'ഝ': 'jh', 'ഞ': 'ny',
    'ട': 't', 'ഠ': 'th', 'ഡ': 'd', 'ഢ': 'dh', 'ണ': 'n', 'ത': 't', 'ഥ': 'th', 'ദ': 'd', 'ധ': 'dh', 'ന': 'n',
    'പ': 'p', 'ഫ': 'ph', 'ബ': 'b', 'ഭ': 'bh', 'മ': 'm', 'യ': 'y', 'ര': 'r', 'റ': 'r', 'ല': 'l', 'ള': 'l', 'ഴ': 'zh',
    'വ': 'v', 'ശ': 'sh', 'ഷ': 'sh', 'സ': 's', 'ഹ': 'h',
    
    // Tamil/Tannir Consonants
    'க': 'k', 'ங': 'ng', 'ச': 's', 'ஞ': 'ny', 'ட': 't', 'ண': 'n', 'த': 'th', 'ந': 'n', 'ப': 'p', 'ம': 'm',
    'ய': 'y', 'ர': 'r', 'ல': 'l', 'வ': 'v', 'ழ': 'zh', 'ள': 'l', 'ற': 'r', 'ன': 'n', 'ஜ': 'j', 'ஷ': 'sh', 'ஸ': 's', 'ஹ': 'h', 'க்ஷ': 'ksh', 'ஃ': 'f',

    // Matras Telugu
    'ా': 'aa', 'ి': 'i', 'ీ': 'ee', 'ు': 'u', 'ూ': 'oo', 'ృ': 'ru', 'ె': 'e', 'ే': 'ae', 'ై': 'ai', 'ొ': 'o', 'ో': 'oo', 'ౌ': 'au', '్': '', 'ం': 'm', 'ః': 'h',
    // Matras Malayalam
    'ാ': 'aa', 'ി': 'i', 'ീ': 'ee', 'ു': 'u', 'ൂ': 'oo', 'ൃ': 'ru', 'െ': 'e', 'േ': 'ae', 'ൈ': 'ai', 'ൊ': 'o', 'ോ': 'oo', 'ൌ': 'au', '്': '', 'ം': 'm', 'ഃ': 'h',
    // Matras Tamil
    'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo', 'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oo', 'ௌ': 'au', '்': ''
  };

  function toRoman(str) {
    if (!str) return '';
    let out = '';
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (indicToRomanMap[ch] !== undefined) {
        out += indicToRomanMap[ch];
      } else if (/[a-zA-Z0-9\s]/.test(ch)) {
        out += ch.toLowerCase();
      }
    }
    return out;
  }

  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^\w\s\u0C00-\u0C7F\u0D00-\u0D7F\u0B80-\u0BFF]/g, '')
      .trim();
  }

  return {
    mlToTe,
    teToMl,
    toRoman,
    normalize
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Transliterate;
}
