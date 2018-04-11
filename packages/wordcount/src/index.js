import { extend, flow  } from 'lodash';
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
	const settings = extend( defaultSettings, userSettings  );

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
 * @param regex
 * @returns {Array|{index: number, input: string}}
 */
function matchWords( text, regex, settings ) {
	text = flow(
		stripTags.bind( this, settings ),
		stripHTMLComments.bind( this, settings ),
		stripShortcodes.bind( this, settings ),
		stripSpaces.bind( this, settings ),
		stripHTMLEntities.bind( this, settings ),
		stripConnectors.bind( this, settings ),
		stripRemovables.bind( this, settings ),
	)( text );
	text = text + '\n';
	return text.match( regex );
}

/**
 * Match the regex for either 'characters_excluding_spaces' or 'characters_including_spaces'
 * @param text
 * @param regex
 * @returns {Array|{index: number, input: string}}
 */
function matchCharacters( text, regex, settings ) {
	text = flow(
		stripTags.bind( this, settings ),
		stripHTMLComments.bind( this, settings ),
		stripShortcodes.bind( this, settings ),
		stripSpaces.bind( this, settings ),
		transposeAstralsToCountableChar.bind( this, settings ),
		transposeHTMLEntitiesToCountableChars.bind( this, settings ),
	)( text );
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
		let matchRegExp = settings[type + 'RegExp'];
		if ('words' === settings.type) {
			return matchWords( text, matchRegExp, settings ).length;
		} else {
			return matchCharacters( text, matchRegExp, settings ).length;
		}
	}
}

