<!-- MEOW -->

<script>
    import meowy from "../assets/meowy.svg";
    let cats = new Array(100).fill().map(
        _ => {
            return ({
                x: Math.random() * 100,
                y: Math.random() * 100,
                offset: Math.random() * 280,
                time: 100 + Math.random() * 250
            })
        }
    );
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
        animation: move 10s infinite cubic-bezier(0.5, 0, 0.5, 1);
    }

    @keyframes move {
		0% {margin-top: -75px; margin-left: 80px;}
		1% {margin-top: 83px; margin-left: 39px;}
		2% {margin-top: 95px; margin-left: -93px;}
		3% {margin-top: 96px; margin-left: 59px;}
		4% {margin-top: -84px; margin-left: 24px;}
		5% {margin-top: 76px; margin-left: -98px;}
		6% {margin-top: 3px; margin-left: -8px;}
		7% {margin-top: -7px; margin-left: -52px;}
		8% {margin-top: -53px; margin-left: 76px;}
		9% {margin-top: -50px; margin-left: 40px;}
		10% {margin-top: 93px; margin-left: 20px;}
		11% {margin-top: -49px; margin-left: -34px;}
		12% {margin-top: 77px; margin-left: 46px;}
		13% {margin-top: 31px; margin-left: -20px;}
		14% {margin-top: -100px; margin-left: 2px;}
		15% {margin-top: -62px; margin-left: -89px;}
		16% {margin-top: -24px; margin-left: 47px;}
		17% {margin-top: -36px; margin-left: 39px;}
		18% {margin-top: -41px; margin-left: 0px;}
		19% {margin-top: -11px; margin-left: 67px;}
		20% {margin-top: 51px; margin-left: 5px;}
		21% {margin-top: -70px; margin-left: -13px;}
		22% {margin-top: -82px; margin-left: -34px;}
		23% {margin-top: 49px; margin-left: -49px;}
		24% {margin-top: -96px; margin-left: 16px;}
		25% {margin-top: -15px; margin-left: 48px;}
		26% {margin-top: -41px; margin-left: -47px;}
		27% {margin-top: -32px; margin-left: -73px;}
		28% {margin-top: 33px; margin-left: -25px;}
		29% {margin-top: -74px; margin-left: 69px;}
		30% {margin-top: 72px; margin-left: 11px;}
		31% {margin-top: -14px; margin-left: 31px;}
		32% {margin-top: -50px; margin-left: -8px;}
		33% {margin-top: -90px; margin-left: 4px;}
		34% {margin-top: 10px; margin-left: -1px;}
		35% {margin-top: -71px; margin-left: 89px;}
		36% {margin-top: 19px; margin-left: -64px;}
		37% {margin-top: 12px; margin-left: -1px;}
		38% {margin-top: 58px; margin-left: 3px;}
		39% {margin-top: -82px; margin-left: -33px;}
		40% {margin-top: 9px; margin-left: -97px;}
		41% {margin-top: -22px; margin-left: 4px;}
		42% {margin-top: -4px; margin-left: 53px;}
		43% {margin-top: 73px; margin-left: 60px;}
		44% {margin-top: 46px; margin-left: 50px;}
		45% {margin-top: 52px; margin-left: -7px;}
		46% {margin-top: -81px; margin-left: 58px;}
		47% {margin-top: 55px; margin-left: 31px;}
		48% {margin-top: 28px; margin-left: 69px;}
		49% {margin-top: 77px; margin-left: 90px;}
		50% {margin-top: -35px; margin-left: 58px;}
		51% {margin-top: -86px; margin-left: -38px;}
		52% {margin-top: -49px; margin-left: 2px;}
		53% {margin-top: 6px; margin-left: -63px;}
		54% {margin-top: 79px; margin-left: 42px;}
		55% {margin-top: -99px; margin-left: 11px;}
		56% {margin-top: -25px; margin-left: -75px;}
		57% {margin-top: 71px; margin-left: -14px;}
		58% {margin-top: -22px; margin-left: 30px;}
		59% {margin-top: -37px; margin-left: -76px;}
		60% {margin-top: 51px; margin-left: -67px;}
		61% {margin-top: 60px; margin-left: -77px;}
		62% {margin-top: 57px; margin-left: -24px;}
		63% {margin-top: -86px; margin-left: -48px;}
		64% {margin-top: -46px; margin-left: 44px;}
		65% {margin-top: -18px; margin-left: 2px;}
		66% {margin-top: 23px; margin-left: 67px;}
		67% {margin-top: -97px; margin-left: 5px;}
		68% {margin-top: -72px; margin-left: 20px;}
		69% {margin-top: 5px; margin-left: 30px;}
		70% {margin-top: -5px; margin-left: -49px;}
		71% {margin-top: -35px; margin-left: 92px;}
		72% {margin-top: -53px; margin-left: 60px;}
		73% {margin-top: -95px; margin-left: -80px;}
		74% {margin-top: -35px; margin-left: 21px;}
		75% {margin-top: -67px; margin-left: 31px;}
		76% {margin-top: 0px; margin-left: 6px;}
		77% {margin-top: 52px; margin-left: -55px;}
		78% {margin-top: 74px; margin-left: 62px;}
		79% {margin-top: -84px; margin-left: -41px;}
		80% {margin-top: 12px; margin-left: -85px;}
		81% {margin-top: -39px; margin-left: 29px;}
		82% {margin-top: 52px; margin-left: -14px;}
		83% {margin-top: -23px; margin-left: -40px;}
		84% {margin-top: 11px; margin-left: -10px;}
		85% {margin-top: -59px; margin-left: -76px;}
		86% {margin-top: -78px; margin-left: -25px;}
		87% {margin-top: -80px; margin-left: 26px;}
		88% {margin-top: 72px; margin-left: -70px;}
		89% {margin-top: -13px; margin-left: 56px;}
		90% {margin-top: -5px; margin-left: -91px;}
		91% {margin-top: -72px; margin-left: 99px;}
		92% {margin-top: -78px; margin-left: -31px;}
		93% {margin-top: 70px; margin-left: 33px;}
		94% {margin-top: 34px; margin-left: -55px;}
		95% {margin-top: -54px; margin-left: -25px;}
		96% {margin-top: -9px; margin-left: -5px;}
		97% {margin-top: 62px; margin-left: -31px;}
		98% {margin-top: -42px; margin-left: -71px;}
		99% {margin-top: -64px; margin-left: 76px;}
		100% {margin-top: -75px; margin-left: 80px;}
    }
</style>