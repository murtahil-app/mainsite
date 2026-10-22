// Proportions of a 6.1-inch iPhone (390 x 844 pt screen), in container-query units of the device's
// width so the frame scales with whatever width it is given. The screen is 91.2cqw wide
// (1 pt = 0.2338cqw): titanium band 1.2cqw, black bezel 3.2cqw on each side.
const cq = (pt: number) => `${(pt * 0.2338).toFixed(2)}cqw`;

/**
 * An iPhone with a Dynamic Island around a real iOS capture (1170 x 2532, status bar included).
 * The frame is decoration; the screen is the app as it ships.
 */
export function Phone({
  src,
  alt,
  width,
  height,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
}) {
  const button = "absolute w-[1.1cqw] bg-[linear-gradient(90deg,#55565b,#2b2c30)]";
  // The caller positions the outer box; the inner one anchors the side buttons.
  return (
    <div className={className}>
      <div className="@container relative">
        {/* Action button and volume on the left, side button on the right. */}
        <span aria-hidden className={`${button} -left-[0.75cqw] top-[16.5%] h-[3.4%] rounded-l-[0.6cqw]`} />
        <span aria-hidden className={`${button} -left-[0.75cqw] top-[23.5%] h-[6.4%] rounded-l-[0.6cqw]`} />
        <span aria-hidden className={`${button} -left-[0.75cqw] top-[31.5%] h-[6.4%] rounded-l-[0.6cqw]`} />
        <span aria-hidden className={`${button} -right-[0.75cqw] top-[26%] h-[10%] rounded-r-[0.6cqw]`} />

        <div
          className="relative rounded-[17.2cqw] p-[1.2cqw] shadow-[inset_0_0_0_0.3cqw_rgb(255_255_255/0.1),0_0_0_0.15cqw_rgb(0_0_0/0.5),0_30px_60px_-22px_rgb(var(--shadow-tint)/0.5)]"
          style={{ background: "linear-gradient(155deg,#64656a 0%,#2c2d31 16%,#1c1d20 50%,#2c2d31 84%,#56575c 100%)" }}
        >
          <div className="rounded-[16cqw] bg-black p-[3.2cqw]">
            <div className="relative overflow-hidden rounded-[12.8cqw] bg-black">
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                className="block h-auto w-full"
              />
              {/* The Dynamic Island, between the clock and the status icons. */}
              <span
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
                style={{ top: cq(11), width: cq(126), height: cq(37) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
