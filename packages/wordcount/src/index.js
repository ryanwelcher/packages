import _ from 'lodash';
import {
	stripHTMLEntities,
	stripConnectors,
	stripRemoveables,
	stripHTMLComments,
	stripTags,
	stripShortcodes,
	stripSpaces,
	transposeHTMLEntitiesToCountableChars,
	transpostAstralsToCountableChar
} from "./stripCharacters";


const defaultSettings  = {
	HTMLRegExp: /<\/?[a-z][^>]*?>/gi,
	HTMLcommentRegExp: /<!--[\s\S]*?-->/g,
	spaceRegExp: /&nbsp;|&#160;/gi,
	HTMLEntityRegExp: /&\S+?;/g,

	// \u2014 = em-dash
	connectorRegExp: /--|\u2014/g,

	// Characters to be removed from input text.
	removeRegExp: new RegExp([
		'[',

		// Basic Latin (extract)
		'\u0021-\u0040\u005B-\u0060\u007B-\u007E',

		// Latin-1 Supplement (extract)
		'\u0080-\u00BF\u00D7\u00F7',

		/*
		 * The following range consists of:
		 * General Punctuation
		 * Superscripts and Subscripts
		 * Currency Symbols
		 * Combining Diacritical Marks for Symbols
		 * Letterlike Symbols
		 * Number Forms
		 * Arrows
		 * Mathematical Operators
		 * Miscellaneous Technical
		 * Control Pictures
		 * Optical Character Recognition
		 * Enclosed Alphanumerics
		 * Box Drawing
		 * Block Elements
		 * Geometric Shapes
		 * Miscellaneous Symbols
		 * Dingbats
		 * Miscellaneous Mathematical Symbols-A
		 * Supplemental Arrows-A
		 * Braille Patterns
		 * Supplemental Arrows-B
		 * Miscellaneous Mathematical Symbols-B
		 * Supplemental Mathematical Operators
		 * Miscellaneous Symbols and Arrows
		 */
		'\u2000-\u2BFF',

		// Supplemental Punctuation
		'\u2E00-\u2E7F',
		']'
	].join(''), 'g'),

	// Remove UTF-16 surrogate points, see https://en.wikipedia.org/wiki/UTF-16#U.2BD800_to_U.2BDFFF
	astralRegExp: /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
	wordsRegExp: /\S\s+/g,
	characters_excluding_spacesRegExp: /\S/g,

	/*
	 * Match anything that is not a formatting character, excluding:
	 * \f = form feed
	 * \n = new line
	 * \r = carriage return
	 * \t = tab
	 * \v = vertical tab
	 * \u00AD = soft hyphen
	 * \u2028 = line separator
	 * \u2029 = paragraph separator
	 */
	characters_including_spacesRegExp: /[^\f\n\r\t\v\u00AD\u2028\u2029]/g,
	l10n: {
		type: 'words'
	}
};


/**
 * Private function to manage the settings.
 *
 * @param type
 * @param userSettings
 * @returns {void|Object|*}
 */
function loadSettings( type, userSettings ) {
	let settings = _.extend( defaultSettings, userSettings  );

	settings.shortcodes = settings.l10n.shortcodes || {};

	if ( settings.shortcodes && settings.shortcodes.length ) {
		settings.shortcodesRegExp = new RegExp( '\\[\\/?(?:' + settings.shortcodes.join( '|' ) + ')[^\\]]*?\\]', 'g' );
	}

	settings.type = type || settings.l10n.type;

	if ( settings.type !== 'characters_excluding_spaces' && settings.type !== 'characters_including_spaces' ) {
		settings.type = 'words';
	}

	return settings;
}

/**
 * Match the regex for the type 'words'
 * @param text
 * @param settings
 * @param regex
 * @returns {Array|{index: number, input: string}}
 */
function matchWords( text, settings, regex ) {
	text = stripRemoveables(
			stripConnectors(
				stripHTMLEntities(
					stripSpaces(
						stripShortcodes(
							stripHTMLComments(
								stripTags( text, settings ),
							settings ),
						settings ),
					settings),
				settings),
			settings ),
		settings);
	text = text + '\n';
	return text.match( regex );
}


/**
 * Match the regex for either 'characters_excluding_spaces' or 'characters_including_spaces'
 * @param text
 * @param settings
 * @param regex
 * @returns {Array|{index: number, input: string}}
 */
function matchCharacters( text, settings, regex ) {
	text = transposeHTMLEntitiesToCountableChars(
			transpostAstralsToCountableChar(
					stripSpaces(
						stripShortcodes(
							stripHTMLComments(
								stripTags( text, settings ),
							settings ),
						settings ),
					settings),
				settings ),
			settings );
	text = text + '\n';
	return text.match( regex );
}


/**
 * Count some words.
 *
 * @param {String} text
 * @param {String} type
 * @param {Object}  userSettings
 *
 * @returns {Number}
 */
export function count( text, type, userSettings ) {
	const settings = loadSettings( type, userSettings );
	if ( text ) {
		let matchRegExp = settings[ type +'RegExp'];
		if ( 'words' === settings.type ) {
			return matchWords( text, settings, matchRegExp ).length;
		} else {
			return matchCharacters( text, settings, matchRegExp ).length;
		}
	}
}

