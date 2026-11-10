import Image from "next/image";
import { assetPath } from "@/lib/campaign";

export function BrandLogo({
  priority = false,
  sizes = "(max-width: 700px) 100px, 132px",
}: {
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <a className="brand-logo" href="#inicio" aria-label="WOA Talk — início">
      <Image
        src={assetPath("/images/woa-talk-logo.webp")}
        alt="WOA Talk: águia abraçando o globo"
        width={420}
        height={336}
        sizes={sizes}
        priority={priority}
      />
    </a>
  );
}
