import _ from 'lodash';
import { defaultSettings } from './defaultSettings'
import stripTags from './stripTags';
import transposeAstralsToCountableChar from './transposeAstralsToCountableChar';
import stripHTMLEntities from './stripHTMLEntities';
import stripConnectors from './stripConnectors';
import stripRemovables from './stripRemovables';
import stripHTMLComments from './stripHTMLComments';
import stripShortcodes from './stripShortcodes';
import stripSpaces from './stripSpaces';
import transposeHTMLEntitiesToCountableChars from './transposeHTMLEntitiesToCountableChars';



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
 * Count some words.
 *
 * @param {String} text
 * @param {String} type
 * @param {Object}  userSettings
 *
 * @returns {Number}
 */
export const WordCounter = {

	settings: null,

	count: function count( text, type, userSettings ) {
		this.settings = loadSettings( type, userSettings );
		if ( text ) {
			let matchRegExp = this.settings[type + 'RegExp'];
			if ('words' === this.settings.type) {
				return this.matchWords( text, matchRegExp ).length;
			} else {
				return this.matchCharacters(text, matchRegExp).length;
			}
		}
	},

	/**
	 * Match the regex for the type 'words'
	 * @param text
	 * @param regex
	 * @returns {Array|{index: number, input: string}}
	 */
	matchWords: function( text, regex ) {
		text = this.stripRemovables(
			this.stripConnectors(
				this.stripHTMLEntities(
					this.stripSpaces(
						this.stripShortcodes(
							this.stripHTMLComments(
								this.stripTags( text ),
								),
							),
						),
					),
				 ),
			);
		text = text + '\n';
		return text.match( regex );
	},

	/**
	 * Match the regex for either 'characters_excluding_spaces' or 'characters_including_spaces'
	 * @param text
	 * @param regex
	 * @returns {Array|{index: number, input: string}}
	 */
	matchCharacters: function( text, regex ) {
		text = this.transposeHTMLEntitiesToCountableChars(
				this.transposeAstralsToCountableChar(
					this.stripSpaces(
						this.stripShortcodes(
							this.stripHTMLComments(
								this.stripTags( text ),
							),
						),
					),
				),
			 );
		text = text + '\n';
		return text.match( regex );
	},
	stripHTMLEntities: stripHTMLEntities,
	stripConnectors: stripConnectors,
	stripRemovables: stripRemovables,
	stripHTMLComments: stripHTMLComments,
	stripShortcodes: stripShortcodes,
	stripSpaces: stripSpaces,
	transposeHTMLEntitiesToCountableChars: transposeHTMLEntitiesToCountableChars,
	transposeAstralsToCountableChar: transposeAstralsToCountableChar,
	stripTags: stripTags,
};

