import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project 1 - Images of the Russian Empire",
  description: "Reconstructing Prokudin-Gorskii's glass plate photographs with single-scale and multiscale image alignment.",
};

const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const singleScaleResults = [
  {
    title: "Cathedral",
    before: `${assetPrefix}/images/project-1-cathedral-before.jpg`,
    after: `${assetPrefix}/images/project-1-cathedral-after.jpg`,
  },
  {
    title: "Monastery",
    before: `${assetPrefix}/images/project-1-monastery-before.jpg`,
    after: `${assetPrefix}/images/project-1-monastery-after.jpg`,
  },
  {
    title: "Tobolsk",
    before: `${assetPrefix}/images/project-1-tobolsk-before.jpg`,
    after: `${assetPrefix}/images/project-1-tobolsk-after.jpg`,
  },
];

export default function ProjectOne() {
  return (
    <main className="report project-one" id="main-content">
      <nav className="report-nav" aria-label="Project navigation">
        <Link href="/">← Projects</Link>
        <span>CS 180 / Project 1</span>
      </nav>

      <header className="report-header">
        <p className="report-kicker">Project 1</p>
        <h1>Images of the Russian Empire</h1>
        <p className="report-deck">
          Reconstructing color photographs from Prokudin-Gorskii&apos;s glass plate negatives through automatic channel alignment.
        </p>
        <nav className="part-jump" aria-label="Jump to a project section">
          <a href="#introduction"><span>01</span> Introduction</a>
          <a href="#single-scale"><span>02</span> Single scale</a>
          <a href="#multiscale"><span>03</span> Multiscale</a>
        </nav>
      </header>

      <section className="report-part" id="introduction">
        <header className="part-heading">
          <p>Introduction</p>
          <h2>From three exposures to one color image</h2>
        </header>
        <div className="project-one-copy">
          <p>
            In the early twentieth century, Sergei Prokudin-Gorskii documented the Russian Empire using three exposures of each scene, captured through blue, green, and red filters. The Library of Congress later digitized these glass plate negatives, preserving each exposure as a vertically stacked grayscale image.
          </p>
          <p>
            This project separates each plate into its three channels, aligns the green and red images to the blue reference, and combines them into a single RGB photograph. The central challenge is finding accurate translations while ignoring borders and differences in brightness between color channels.
          </p>
        </div>
        <ol className="alignment-steps" aria-label="Color reconstruction process">
          <li><span>01</span><strong>Split</strong><p>Divide the glass plate into blue, green, and red exposures.</p></li>
          <li><span>02</span><strong>Align</strong><p>Search for the displacement that best matches each channel to blue.</p></li>
          <li><span>03</span><strong>Compose</strong><p>Stack the aligned channels to produce the final color photograph.</p></li>
        </ol>
      </section>

      <section className="report-part" id="single-scale">
        <header className="part-heading">
          <p>Single scale</p>
          <h2>Exhaustive alignment for small images</h2>
        </header>
        <div className="project-one-copy">
          <p>
            The single-scale method searches every horizontal and vertical translation within a fixed window. For each candidate shift, it compares the overlapping interior of the moving channel with the blue reference using an image similarity score. The displacement with the best score is applied before the channels are combined.
          </p>
          <p>
            This direct search is practical for the smaller JPEG plates, where the correct offset is limited to a few pixels. Result images, channel offsets, and the selected scoring metric will be presented here.
          </p>
        </div>
        <div className="single-scale-results" aria-label="Single-scale alignment results">
          {singleScaleResults.map((result) => (
            <article className="alignment-result" key={result.title}>
              <h3>{result.title}</h3>
              <div className="alignment-pair">
                <figure>
                  <Image
                    src={result.before}
                    alt={`${result.title} color channels before alignment`}
                    width={396}
                    height={341}
                    sizes="(max-width: 720px) 100vw, 34vw"
                  />
                  <figcaption>Before alignment</figcaption>
                </figure>
                <figure>
                  <Image
                    src={result.after}
                    alt={`${result.title} color channels after single-scale alignment`}
                    width={396}
                    height={341}
                    sizes="(max-width: 720px) 100vw, 34vw"
                  />
                  <figcaption>After alignment</figcaption>
                </figure>
              </div>
              <dl className="alignment-metadata">
                <div><dt>Red displacement</dt><dd aria-label="To be added">&nbsp;</dd></div>
                <div><dt>Green displacement</dt><dd aria-label="To be added">&nbsp;</dd></div>
                <div><dt>Generation time</dt><dd aria-label="To be added">&nbsp;</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="report-part" id="multiscale">
        <header className="part-heading">
          <p>Multiscale</p>
          <h2>Coarse-to-fine image pyramid</h2>
        </header>
        <div className="project-one-copy">
          <p>
            Full-resolution TIFF plates require much larger displacements, making a single exhaustive search too expensive. The multiscale method builds an image pyramid and begins alignment at the smallest resolution. Each estimate is doubled and refined within a narrow search window at the next finer level.
          </p>
          <p>
            Repeating this process through the pyramid preserves a wide effective search range while keeping the computation efficient. This section will show the full set of reconstructed images, their final offsets, and any cases where raw pixel similarity does not align the channels correctly.
          </p>
        </div>
        <div className="result-slot" role="note">
          <span>Multiscale results</span>
          <p>Add the aligned TIFF outputs, chosen examples, runtime details, and final displacement vectors.</p>
        </div>
      </section>

      <footer className="report-footer">
        <Link href="/">← Return to project archive</Link>
        <span>Maixin Zhang / 2026</span>
      </footer>
    </main>
  );
}
