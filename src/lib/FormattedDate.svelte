<!--
	Formatted date display with hover text.
	Mostly taken straight from Appel Level Database.
-->
<script>
	/**
	 * @file good thing I had already made a date display for appel level database
	 * *yoink with some tweaks*
	 */

	// 32-bit UTC time (1 is 1 second instead of 1 millisecond)
	export let date = 0;

	let text, title;

	$: {
		const _date = new Date(date * 1000);
		text = _date.toLocaleString();
		title = `Time is in your local timezone (UTC+${-(
			_date.getTimezoneOffset() / 60
		)}).
12-hour time: ${_date.toLocaleString([], {hourCycle: "h11"})}
24-hour time: ${_date.toLocaleString([], {hourCycle: "h23"})}
ISO: ${_date.toISOString()}`;
	}
</script>

<span {title} class="date">
	{text}
</span>

<style>
	.date {
		font-style: italic;
		cursor: help;
	}
</style>
