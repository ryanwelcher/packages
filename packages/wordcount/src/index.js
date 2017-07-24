/**
 * Word counting utility
 *
 * Counts the number of words (or other specified type) in the specified text.
 *
 * @summary  Count the number of elements in a text.
 *
 * @since    2.6.0
 * @memberof wp.utils.wordcounter
 *
 * @param {String}  text Text to count elements in.
 * @param {String}  type Optional. Specify type to use.
 *
 * @param {Object} settings                                   Optional. Key-value object containing overrides for
 *                                                            settings.
 * @param {RegExp} settings.HTMLRegExp                        Optional. Regular expression to find HTML elements.
 * @param {RegExp} settings.HTMLcommentRegExp                 Optional. Regular expression to find HTML comments.
 * @param {RegExp} settings.spaceRegExp                       Optional. Regular expression to find irregular space
 *                                                            characters.
 * @param {RegExp} settings.HTMLEntityRegExp                  Optional. Regular expression to find HTML entities.
 * @param {RegExp} settings.connectorRegExp                   Optional. Regular expression to find connectors that
 *                                                            split words.
 * @param {RegExp} settings.removeRegExp                      Optional. Regular expression to find remove unwanted
 *                                                            characters to reduce false-positives.
 * @param {RegExp} settings.astralRegExp                      Optional. Regular expression to find unwanted
 *                                                            characters when searching for non-words.
 * @param {RegExp} settings.wordsRegExp                       Optional. Regular expression to find words by spaces.
 * @param {RegExp} settings.characters_excluding_spacesRegExp Optional. Regular expression to find characters which
 *                                                            are non-spaces.
 * @param {RegExp} settings.characters_including_spacesRegExp Optional. Regular expression to find characters
 *                                                            including spaces.
 * @param {RegExp} settings.shortcodesRegExp                  Optional. Regular expression to find shortcodes.
 * @param {Object} settings.l10n                              Optional. Localization object containing specific
 *                                                            configuration for the current localization.
 * @param {String} settings.l10n.type                         Optional. Method of finding words to count.
 * @param {Array}  settings.l10n.shortcodes                   Optional. Array of shortcodes that should be removed
 *                                                            from the text.
 *
 * @return {Number} The number of items counted.
 */
export function count( text, type, settings ) {
	let count = 0;
	let shortcodes;
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

	// Apply provided settings to object settings.
	if ( settings ) {
		for ( let key in settings ) {

			// Only apply valid settings.
			if ( settings.hasOwnProperty( key ) ) {
				defaultSettings[ key ] = settings[ key ];
			}
		}
	}

	shortcodes = defaultSettings.l10n.shortcodes || {};

	// If there are any localization shortcodes, add this as type in the settings.
	if ( shortcodes && shortcodes.length ) {
		defaultSettings.shortcodesRegExp = new RegExp( '\\[\\/?(?:' + shortcodes.join( '|' ) + ')[^\\]]*?\\]', 'g' );
	}

	// do the counting;

	// Use default type if none was provided.
	type = type || defaultSettings.l10n.type;

	// Sanitize type to one of three possibilities: 'words', 'characters_excluding_spaces' or 'characters_including_spaces'.
	if ( type !== 'characters_excluding_spaces' && type !== 'characters_including_spaces' ) {
		type = 'words';
	}

	// If we have any text at all.
	if ( text ) {
		text = text + '\n';

		// Replace all HTML with a new-line.
		text = text.replace( defaultSettings.HTMLRegExp, '\n' );

		// Remove all HTML comments.
		text = text.replace( defaultSettings.HTMLcommentRegExp, '' );

		// If a shortcode regular expression has been provided use it to remove shortcodes.
		if ( defaultSettings.shortcodesRegExp ) {
			text = text.replace( defaultSettings.shortcodesRegExp, '\n' );
		}

		// Normalize non-breaking space to a normal space.
		text = text.replace( defaultSettings.spaceRegExp, ' ' );

		if ( type === 'words' ) {

			// Remove HTML Entities.
			text = text.replace( defaultSettings.HTMLEntityRegExp, '' );

			// Convert connectors to spaces to count attached text as words.
			text = text.replace( defaultSettings.connectorRegExp, ' ' );

			// Remove unwanted characters.
			text = text.replace( defaultSettings.removeRegExp, '' );
		} else {

			// Convert HTML Entities to "a".
			text = text.replace( defaultSettings.HTMLEntityRegExp, 'a' );

			// Remove surrogate points.
			text = text.replace( defaultSettings.astralRegExp, 'a' );
		}

		// Match with the selected type regular expression to count the items.
		text = text.match( defaultSettings[ type + 'RegExp' ] );

		// If we have any matches, set the count to the number of items found.
		if ( text ) {
			count = text.length;
		}
	}
	return count;
}
