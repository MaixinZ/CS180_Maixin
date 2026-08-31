import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project 0 — Becoming friends with your camera",
  description: "Perspective, focal length, and the center of projection explored in three camera studies.",
};

const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const parts = [
  {
    number: "Part 1",
    title: "Selfie: the wrong way vs. the right way",
    method: "I took both selfies with my phone. For the left image, I held the camera about two inches from my face and used the 0.5× ultra-wide lens. For the right image, I moved the camera to roughly one arm’s length and used the standard 1× lens. The right portrait looks more natural, while the close ultra-wide image visibly distorts my face: my midface appears elongated and pushed outward, especially around my cheekbones.",
    result: "The improvement comes primarily from the greater camera-to-subject distance. At two inches, even small depth differences between features—such as my nose and ears—are large relative to the camera distance, so nearby features are exaggerated. Moving the camera farther away makes those differences proportionally smaller and reduces perspective distortion. The 1× lens then preserves a useful framing without the ultra-wide field of view, producing facial proportions that look closer to how they appear in person.",
    images: [
      { src: `${assetPrefix}/images/project-0-selfie-close.jpg`, label: "Close / wide", alt: "Close-up wide-angle portrait showing perspective distortion" },
      { src: `${assetPrefix}/images/project-0-selfie-far.jpg`, label: "Far / zoomed", alt: "Portrait taken from farther away with zoom" },
    ],
  },
  {
    number: "Part 2",
    title: "Architectural perspective compression",
    method: "Both images show the Shake Shack restaurant next to my apartment. For the left image, I stood across the street and zoomed in on the building. For the right image, I moved to roughly three meters from the facade and photographed it from close range. Although the building occupies a similar portion of each frame, the distant view appears noticeably flatter than the close view.",
    result: "This difference is caused by perspective compression. From across the street, variations in distance between the camera and different parts of the building are small relative to the total camera distance, so the facade’s layers appear closer together. At three meters, those same depth differences become much more significant. Nearby elements look larger relative to elements farther away, creating a stronger and more obvious sense of depth.",
    images: [
      { src: `${assetPrefix}/images/project-0-building-far.jpg`, label: "Far / zoomed", alt: "Zoomed view of a Shake Shack building photographed from farther away" },
      { src: `${assetPrefix}/images/project-0-building-near.jpg`, label: "Near / wide", alt: "Wide-angle view of a Shake Shack building photographed from nearby" },
    ],
  },
];

const dollyFrames = [
  { src: `${assetPrefix}/images/project-0-dolly-v2-frame-01.jpg`, width: 4284, height: 5712 },
  { src: `${assetPrefix}/images/project-0-dolly-v2-frame-02.jpg`, width: 3024, height: 4032 },
  { src: `${assetPrefix}/images/project-0-dolly-v2-frame-03.jpg`, width: 4284, height: 5712 },
  { src: `${assetPrefix}/images/project-0-dolly-v2-frame-04.jpg`, width: 4284, height: 5712 },
];

export default function ProjectZero() {
  return (
    <main className="report" id="main-content">
      <p className="print-url" aria-hidden="true">https://maixinz.github.io/CS180_Maixin/projects/0/</p>
      <nav className="report-nav" aria-label="Project navigation">
        <Link href="/">← Projects</Link>
        <span>CS 180 / Project 0</span>
      </nav>

      <header className="report-header">
        <p className="report-kicker">Project 0</p>
        <h1>Becoming friends with your camera</h1>
        <p className="report-deck">Three experiments on the relationship between perspective, focal length, zoom, and the center of projection.</p>
        <nav className="part-jump" aria-label="Jump to a project part">
          <a href="#part-1"><span>01</span> Selfie comparison</a>
          <a href="#part-2"><span>02</span> Architecture</a>
          <a href="#part-3"><span>03</span> Dolly zoom</a>
        </nav>
      </header>

      {parts.map((part, index) => (
        <section className="report-part" id={`part-${index + 1}`} key={part.number}>
          <header className="part-heading">
            <p>{part.number}</p>
            <h2>{part.title}</h2>
          </header>

          <div className="comparison" aria-label={`${part.title} image comparison`}>
            {part.images.map((image) => (
              <figure key={image.label}>
                <div className="comparison-image">
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 720px) 100vw, 48vw" />
                </div>
                <figcaption>{image.label}</figcaption>
              </figure>
            ))}
          </div>

          <div className="part-explanation">
            <p>{part.method}</p>
            <p>{part.result}</p>
          </div>
        </section>
      ))}

      <section className="report-part dolly-part" id="part-3">
        <header className="part-heading">
          <p>Part 3</p>
          <h2>The dolly zoom</h2>
        </header>

        <div className="dolly-result">
          <div className="dolly-result-image">
            <Image
              src={`${assetPrefix}/images/project-0-dolly-zoom-v2.gif`}
              alt="Dolly zoom animation focused on a vase of flowers and a lamp"
              fill
              sizes="400px"
              unoptimized
            />
          </div>
          <video className="dolly-result-video" controls playsInline preload="metadata">
            <source src={`${assetPrefix}/videos/project-0-dolly-zoom.mp4`} type="video/mp4" />
            Your browser does not support embedded video.
          </video>
        </div>

        <div className="filmstrip" aria-label="Dolly zoom source frames">
          {dollyFrames.map((frame, index) => (
            <figure key={frame.src}>
              <div>
                <Image
                  src={frame.src}
                  alt={`Dolly zoom source frame ${index + 1}`}
                  width={frame.width}
                  height={frame.height}
                  sizes="(max-width: 720px) 50vw, 20vw"
                />
              </div>
              <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>

        <p className="part-explanation">I used a corner of my bedroom as the setting for this dolly zoom. As I moved the camera backward, I simultaneously zoomed in to keep the main objects roughly the same size in the frame. Although the subject remains visually stable, the changing camera position alters the perspective, making the background appear to expand toward the viewer.</p>
      </section>

      <footer className="report-footer">
        <Link href="/">← Return to project archive</Link>
        <span>Maixin Zhang / 2026</span>
      </footer>
    </main>
  );
}
