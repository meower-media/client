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
	export let relative = false;
	export let customText = "";

	let text, title;

	function getRelativeTime(date) {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);

		if (seconds < 60) {
			return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
		}

		const minutes = Math.floor(seconds / 60);

		if (minutes < 60) {
			return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
		}

		const hours = Math.floor(minutes / 60);

		if (hours < 24) {
			return `${hours} hour${hours === 1 ? "" : "s"} ago`;
		}

		const days = Math.floor(hours / 24);

		if (days < 30) {
			return `${days} day${days === 1 ? "" : "s"} ago`;
		}

		const months = Math.floor(days / 30);

		if (months < 12) {
			return `${months} month${months === 1 ? "" : "s"} ago`;
		}

		const years = Math.floor(months / 12);

		return `${years} year${years === 1 ? "" : "s"} ago`;
	}

	$: {
		const _date = new Date(date * 1000);
		if (relative) {
			text = getRelativeTime(_date);
		} else {
			text = _date.toLocaleString();
		}

		title = `Time is in your local timezone (UTC+${-(
			_date.getTimezoneOffset() / 60
		)}).
12-hour time: ${_date.toLocaleString([], {hourCycle: "h11"})}
24-hour time: ${_date.toLocaleString([], {hourCycle: "h23"})}
ISO: ${_date.toISOString()}`;
	}
</script>

<span {title} class="date">
	{customText || text}
</span>

<style>
	.date {
		font-style: italic;
		cursor: help;
	}
</style>
