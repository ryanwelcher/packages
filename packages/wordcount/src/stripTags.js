export default function( text ) {
	return text.replace( this.settings.HTMLRegExp, '\n' );
}
