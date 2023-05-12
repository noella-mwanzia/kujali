/**
 * Replaces all special characters with pre-defined valid characters
 * and omits any undefined invalid characters.
 *
 * @param inputString String to be cleaned/sanitized
 * @returns sanitized input string
 */
export function SANITIZE_TEXT_INPUT(inputString: string | undefined){
  if(!inputString || !inputString?.length){
    return inputString;
  }

  const stringReplacements = {
    'é è ê ë': 'e',
    'à': 'a',
    'ç': 'c' ,
    'ï i î': 'i',
    'ö ô': 'o',
    'ù û': 'u',
    '&': 'et'
  }

  let result = inputString;

  // Loop over string replacements which is a definite pre-difined
  // length of items rather than a variable input string
  Object.keys(stringReplacements).forEach(charKey => {
    // Construct regex: match 1 or more of the characters in the stringReplacements key
    const characterList = charKey?.split(' ').join('');
    const exp = new RegExp(`[${characterList}]+`, 'g');

    // Replace all occurences
    result = result.replace(exp, stringReplacements[charKey]);
  });

  // Omit all other outliers
  result = result.replace(/[^\w\s\d()+/:,.'"-]/gi, '');

  return result;
}

export const BANKING_PATTERN = /^[\s\da-zA-Z()+/:\?*,.'"-]*$/;
