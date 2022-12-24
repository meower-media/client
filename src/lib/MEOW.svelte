<!-- 
    MEOW VERSION 1.0 
    Literally The script that generates the group cat page (minus the text) 
-->
<script>
	import meowy from "../assets/meowy.svg";

	let cats = new Array(100).fill({}).map(_ => {
		return {
			x: Math.random() * 100,
			y: Math.random() * 100,
			offset: Math.random() * 15,
			time: 5 + Math.random() * 10,
		};
	});
</script>

<div class="cats">
	{#each cats as cat}
		<img
			class="cat"
			alt="MEOW"
			title="MEOW"
			src={meowy}
			style:left={(cat.x || 0) + "vw"}
			style:top={(cat.y || 0) + "vh"}
			style:animation-delay={-(cat.offset || 0) + "s"}
			style:animation-duration={cat.time + "s"}
			height="100"
		/>
	{/each}
</div>

<style>
	.cats {
		position: fixed;
		top: -50px;
		left: -50px;
	}
	.cat {
		position: absolute;

		animation: move 10s infinite ease-in-out;
	}

	@keyframes move {
		from {
			margin-top: 5.353373095343571px;
			margin-left: -0.31948846929643615px;
		}
		10% {
			margin-top: 6.6694499706507315px;
			margin-left: 3.9703162426243566px;
		}
		20% {
			margin-top: -8.018704491444083px;
			margin-left: 9.697074885869263px;
		}
		30% {
			margin-top: 4.532600575778979px;
			margin-left: -10.782553666481215px;
		}
		40% {
			margin-top: -11.471281323282605px;
			margin-left: -9.73860314878502px;
		}
		50% {
			margin-top: 3.813092989989176px;
			margin-left: 4.382947362905082px;
		}
		60% {
			margin-top: 10.802343178869005px;
			margin-left: 9.88894001636454px;
		}
		70% {
			margin-top: 5.665170236719096px;
			margin-left: -5.521824674118115px;
		}
		80% {
			margin-top: -10.341108084816113px;
			margin-left: 6.995339957134032px;
		}
		90% {
			margin-top: 8.910465362922437px;
			margin-left: 4.9442609567688045px;
		}
		to {
			margin-top: 5.353373095343571px;
			margin-left: -0.31948846929643615px;
		}
	}
</style>
