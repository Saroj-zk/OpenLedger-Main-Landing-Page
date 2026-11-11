/**
 * How you settle the bill.
 *
 * Ported from the Hey Open site, where it was built on MUI. The structure
 * and the argument are unchanged; the styling is this site's own, so it
 * uses .shell, .eyebrow, .display, .lead, .glass and data-reveal rather
 * than carrying another design system across.
 *
 * ------------------------------------------------------------------
 * There are two ways to pay and the section is built in two halves,
 * because that is what the thing being described actually looks like.
 * Run together as one sentence it read as a single long qualification;
 * split, a reader sees at a glance that there is a choice and which side
 * of it is the unusual one.
 *
 * The halves are not equal and the layout says so. Paying directly needs
 * no selling: everyone assumes it, so it gets the narrower card and the
 * quieter heading. Staking an asset you already hold and spending only
 * what it earns is the part nobody expects, so it gets the wider card,
 * the accent, and the sentence that closes the argument, that the
 * position stays yours.
 *
 * No icons, no chips, no figure: all three were tried on the original and
 * all three turned a reassurance into a pitch.
 *
 * ------------------------------------------------------------------
 * THE HEDGE HAS NOT BEEN REVIEWED. Staking an asset for a return is a
 * representation about money, and "rates are not fixed, nothing here is a
 * guaranteed return" is the shortest true thing that can be said about
 * one. It sits under a rule, across the full width, because it qualifies
 * both halves and not just the one it is nearest to.
 *
 * NO RATE APPEARS ANYWHERE, deliberately. What staked USDC, ETH or BTC
 * earns moves with the market, and a figure on a marketing page reads as
 * a promise.
 *
 * Nothing is said about chains, custody or lock-up, because none of it
 * was given. If a stake is custodied, or there is a minimum term, it
 * belongs in the right-hand card.
 * ------------------------------------------------------------------
 */
export default function HowYouPay() {
  return (
    <section
      id="how-you-pay"
      data-theme="dark"
      data-parallax-root
      aria-labelledby="how-you-pay-title"
      /* Dark because the page alternates and HeyOpen above it is light.
         The glass panels and the fg/soft colours follow the theme class,
         so this one line decides the whole section's palette. */
      className="theme-dark relative overflow-hidden py-28 lg:py-40"
    >
      <div className="shell">
        <div className="mx-auto max-w-[1180px]">
          {/* The proposition. On the original this lived nowhere, and a
              reader had to assemble it from the two card titles. */}
          <div className="max-w-[760px]" data-reveal>
            <p className="eyebrow">How you pay</p>

            <h2
              id="how-you-pay-title"
              className="display mt-5 text-[38px] sm:text-[52px] lg:text-[64px]"
            >
              <span className="block">Pay for it.</span>
              <span className="block text-orange">Or let your holdings pay for it.</span>
            </h2>

            <p className="lead mt-6 max-w-[560px]">
              Two ways to cover your credits, and one of them leaves what you hold untouched.
            </p>
          </div>

          {/* And the two of them. */}
          <div
            className="mt-10 flex flex-col items-stretch gap-4 md:flex-row md:gap-6 lg:mt-12"
            data-reveal
          >
            {/* The half nobody needs convincing of. */}
            <div
              data-liquid
              data-bezel="20"
              data-blur="10"
              className="glass flex-1 rounded-[24px] p-7 sm:p-8 md:flex-[0_1_38%]"
            >
              <h3 className="font-sans text-[19px] font-semibold tracking-tight text-fg">
                Pay directly
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-soft">
                Card or crypto, whichever you already use. One bill either way.
              </p>
            </div>

            {/* And the half that is the point. */}
            <div
              data-liquid
              data-bezel="20"
              data-blur="10"
              className="glass glass-orange flex-1 rounded-[24px] p-7 sm:p-8 md:flex-[1_1_62%]"
            >
              <h3 className="font-sans text-[19px] font-semibold tracking-tight text-orange">
                Or stake instead
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-soft">
                Stake <span className="font-semibold text-fg">USDC, ETH or BTC</span> and the
                yield covers your credits. The position stays yours the whole time, and
                unstaking simply stops the credits.
              </p>
            </div>
          </div>

          {/* Across the full width, under both, because it qualifies both. */}
          <p className="hair mt-8 border-t pt-5 text-[13px] leading-relaxed text-soft">
            What a stake earns moves with the market. Rates are not fixed and nothing here is a
            guaranteed return.
          </p>
        </div>
      </div>
    </section>
  );
}
