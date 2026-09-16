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
    redDisplacement: "(12, 3)",
    greenDisplacement: "(5, 2)",
    generationTime: "1.018s",
  },
  {
    title: "Monastery",
    before: `${assetPrefix}/images/project-1-monastery-before.jpg`,
    after: `${assetPrefix}/images/project-1-monastery-after.jpg`,
    redDisplacement: "(3, 2)",
    greenDisplacement: "(-3, 2)",
    generationTime: "1.042s",
  },
  {
    title: "Tobolsk",
    before: `${assetPrefix}/images/project-1-tobolsk-before.jpg`,
    after: `${assetPrefix}/images/project-1-tobolsk-after.jpg`,
    redDisplacement: "(6, 3)",
    greenDisplacement: "(3, 2)",
    generationTime: "1.007s",
  },
];

const multiscaleResults = [
  { title: "Cathedral", src: `${assetPrefix}/images/project-1-multiscale-cathedral.jpg`, width: 390, height: 341, redOffset: "(12, 3)", greenOffset: "(5, 2)", runtime: "0.513s" },
  { title: "Monastery", src: `${assetPrefix}/images/project-1-multiscale-monastery.jpg`, width: 391, height: 341, redOffset: "(3, 2)", greenOffset: "(-3, 2)", runtime: "0.492s" },
  { title: "Tobolsk", src: `${assetPrefix}/images/project-1-multiscale-tobolsk.jpg`, width: 396, height: 341, redOffset: "(6, 3)", greenOffset: "(3, 3)", runtime: "0.507s" },
  { title: "Church", src: `${assetPrefix}/images/project-1-multiscale-church.jpg`, width: 3634, height: 3202, redOffset: "(58, -4)", greenOffset: "(25, 4)", runtime: "7.333s" },
  { title: "Emir", src: `${assetPrefix}/images/project-1-multiscale-emir.jpg`, width: 3702, height: 3209, redOffset: "(416, -455)", greenOffset: "(49, 24)", runtime: "7.367s" },
  { title: "Harvesters", src: `${assetPrefix}/images/project-1-multiscale-harvesters.jpg`, width: 3683, height: 3218, redOffset: "(124, 13)", greenOffset: "(60, 17)", runtime: "7.392s" },
  { title: "Icon", src: `${assetPrefix}/images/project-1-multiscale-icon.jpg`, width: 3741, height: 3244, redOffset: "(89, 23)", greenOffset: "(41, 17)", runtime: "7.504s" },
  { title: "Ilemselga", src: `${assetPrefix}/images/project-1-multiscale-ilemselga.jpg`, width: 3800, height: 3270, redOffset: "(130, 11)", greenOffset: "(40, 7)", runtime: "9.127s" },
  { title: "Melons", src: `${assetPrefix}/images/project-1-multiscale-melons.jpg`, width: 3770, height: 3241, redOffset: "(178, 13)", greenOffset: "(82, 11)", runtime: "7.636s" },
  { title: "Religious Painting", src: `${assetPrefix}/images/project-1-multiscale-painting.jpg`, width: 3742, height: 3193, redOffset: "(68, 7)", greenOffset: "(28, 3)", runtime: "11.344s" },
  { title: "Self Portrait", src: `${assetPrefix}/images/project-1-multiscale-portrait.jpg`, width: 3810, height: 3251, redOffset: "(176, 37)", greenOffset: "(79, 29)", runtime: "7.752s" },
  { title: "Siren", src: `${assetPrefix}/images/project-1-multiscale-siren.jpg`, width: 3817, height: 3250, redOffset: "(96, -25)", greenOffset: "(49, -6)", runtime: "7.724s" },
  { title: "Wharf", src: `${assetPrefix}/images/project-1-multiscale-wharf.jpg`, width: 3761, height: 3244, redOffset: "(83, -16)", greenOffset: "(15, -7)", runtime: "7.417s" },
  { title: "Three Generations", src: `${assetPrefix}/images/project-1-multiscale-generations.jpg`, width: 3714, height: 3209, redOffset: "(112, 11)", greenOffset: "(53, 14)", runtime: "7.361s" },
  { title: "Woman", src: `${assetPrefix}/images/project-1-multiscale-woman.jpg`, width: 3769, height: 3253, redOffset: "(113, -2)", greenOffset: "(24, -2)", runtime: "7.701s" },
  { title: "Yurt", src: `${assetPrefix}/images/project-1-multiscale-yurt.jpg`, width: 3743, height: 3208, redOffset: "(107, 55)", greenOffset: "(48, 38)", runtime: "7.517s" },
  { title: "Gathering", src: `${assetPrefix}/images/project-1-multiscale-gathering.jpg`, width: 3742, height: 3196, redOffset: "(85, -42)", greenOffset: "(47, -13)", runtime: "7.293s" },
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
          <a href="#introduction"><span>01</span> Overview</a>
          <a href="#single-scale"><span>02</span> Single scale</a>
          <a href="#multiscale"><span>03</span> Multiscale</a>
        </nav>
      </header>

      <section className="report-part" id="introduction">
        <header className="part-heading">
          <p>01</p>
          <h2>Overview</h2>
        </header>
        <div className="project-one-copy">
          <p>
            In the early 20th century, Sergei Prokudin-Gorskii recorded the Russian Empire with three exposures of every scene onto a glass plate using a red, a green, and a blue filter. The Library of Congress later preserved each exposure of the same scene as a vertically stacked grayscale image. In this project, I aim to separate each plate into three channels, align the red and green images to the blue reference, and combine them into a single colorful RGB photograph. The project is divided into 2 parts. In the first part, I test a naive single-scale implementation that exhaustively searches over a window of possible displacements. In the second part, I implement a faster search procedure using an image pyramid for high-resolution glass plate scans. The resulting images are shown together with a brief explanation of the steps and the evaluation metric.
          </p>
        </div>
      </section>

      <section className="report-part" id="single-scale">
        <header className="part-heading">
          <p>02</p>
          <h2>Single Scale Alignment</h2>
        </header>
        <div className="project-one-copy">
          <p>
            For smaller image files, a straightforward approach is to exhaustively search a window of possible displacements and select the shift that produces the best alignment. After separating the color channels, I use the blue channel as the reference and align the red and green channels within the displacement window [-15, 15] pixels suggested by the project specification. The key function is <code>np.roll()</code>, which shifts an image by specified offsets along the horizontal x-axis (dimension 1) and vertical y-axis (dimension 0). To match NumPy&apos;s array-dimension order, all offsets in this section and the sections that follow are reported as (dy, dx).
          </p>
          <p>
            I use Normalized Cross-Correlation (NCC) to evaluate how well two image regions match:
          </p>
          <div className="math-equation" role="math" aria-label="N C C of A and B equals the dot product of mean-centered A and B divided by the product of their L2 norms">
            <span>NCC(A, B) = </span>
            <span className="math-fraction">
              <span>(A - μ<sub>A</sub>) · (B - μ<sub>B</sub>)</span>
              <span>‖A - μ<sub>A</sub>‖<sub>2</sub> ‖B - μ<sub>B</sub>‖<sub>2</sub></span>
            </span>
          </div>
          <p>
            I chose NCC instead of L2 distance because NCC reduces the influence of differences in overall brightness. It subtracts each region&apos;s mean and normalizes its magnitude, allowing the comparison to focus on structural patterns across channels. An NCC score of 1 indicates a perfect match, so the algorithm selects the displacement with the highest score in the search window.
          </p>
          <p>
            When calculating NCC, I do not use the entire image channel. I crop 20 pixels from every edge of both the shifted image and the blue reference before evaluation. Since <code>np.roll()</code> wraps pixels across image boundaries, the shifted borders contain invalid correspondences that can distort the NCC score and lead to color fringing or misalignment.
          </p>
          <p>
            The results below show three image pairs before and after single-scale alignment, together with their displacement offsets and runtime.
          </p>
        </div>
        <div className="single-scale-results" aria-label="Single-scale alignment results">
          <div className="alignment-row">
            <h3>Original images</h3>
            <div className="alignment-gallery">
              {singleScaleResults.map((result) => (
                <figure key={result.title}>
                  <Image
                    src={result.before}
                    alt={`${result.title} color channels before alignment`}
                    width={396}
                    height={341}
                    sizes="(max-width: 720px) 100vw, 22vw"
                  />
                  <figcaption>{result.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="alignment-row">
            <h3>Aligned images</h3>
            <div className="alignment-gallery">
              {singleScaleResults.map((result) => (
                <figure key={result.title}>
                  <Image
                    src={result.after}
                    alt={`${result.title} color channels after single-scale alignment`}
                    width={396}
                    height={341}
                    sizes="(max-width: 720px) 100vw, 22vw"
                  />
                  <figcaption>{result.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="alignment-table-wrap">
            <table className="alignment-table">
              <caption>Single-scale alignment details</caption>
              <thead>
                <tr>
                  <th className="alignment-order" scope="col">No.</th>
                  <th scope="col">Image title</th>
                  <th scope="col">Red offset (y, x)</th>
                  <th scope="col">Green offset (y, x)</th>
                  <th scope="col">Runtime</th>
                </tr>
              </thead>
              <tbody>
                {singleScaleResults.map((result, index) => (
                  <tr key={result.title}>
                    <td className="alignment-order">{index + 1}</td>
                    <th scope="row">{result.title}</th>
                    <td>{result.redDisplacement}</td>
                    <td>{result.greenDisplacement}</td>
                    <td>{result.generationTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="report-part" id="multiscale">
        <header className="part-heading">
          <p>03</p>
          <h2>Multi-Scale Alignment</h2>
        </header>
        <div className="project-one-copy">
          <p>
            For higher-resolution TIFF images, an exhaustive search is prohibitively expensive and results in an unreasonable runtime. To address this issue, I recursively construct an image pyramid. Using <code>sk.transform.rescale()</code>, I downsample the image by a factor of two until either dimension falls below 200 pixels. At this coarsest level, I call the single-scale alignment function developed in the previous section to find the optimal offsets. The reference blue channel is downsampled alongside the color channel being aligned. After finding the optimal offsets at the lowest resolution, I move back up the pyramid and predict the offsets at each finer level by doubling those from the previous level, since the image dimensions also double. I then apply a modified single-scale search within a narrow window of [-3, 3] pixels around the predicted offsets. After testing several window sizes, I found that [-3, 3] offers the best balance between alignment quality and runtime.
          </p>
          <p>
            Another difference between the multi-scale and single-scale implementations is how the image borders are handled. In the multi-scale function, I adjust the cropped border dynamically rather than removing a fixed 20 pixels, allowing the evaluation region to accommodate the changing channel dimensions at each pyramid level. I repeat the search recursively until returning to the original channel resolution, producing the final offsets and aligned color image.
          </p>
        </div>
        <div className="multiscale-gallery" aria-label="Multiscale alignment results">
          {multiscaleResults.map((result) => (
            <figure key={result.title}>
              <Image
                src={result.src}
                alt={`${result.title} reconstructed with multiscale alignment`}
                width={result.width}
                height={result.height}
                sizes="(max-width: 720px) 100vw, 31vw"
              />
              <figcaption>
                {result.title === "Emir" ? (
                  <a className="failure-reason-link" href="#emir-failure-reason">
                    Emir*
                  </a>
                ) : result.title}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="alignment-table-wrap multiscale-table-wrap">
          <table className="alignment-table">
            <caption>Multi-scale alignment details</caption>
            <thead>
              <tr>
                <th className="alignment-order" scope="col">No.</th>
                <th scope="col">Image title</th>
                <th scope="col">Red offset (y, x)</th>
                <th scope="col">Green offset (y, x)</th>
                <th scope="col">Runtime</th>
              </tr>
            </thead>
            <tbody>
              {multiscaleResults.map((result, index) => (
                <tr key={result.title}>
                  <td className="alignment-order">{index + 1}</td>
                  <th scope="row">{result.title}</th>
                  <td>{result.redOffset}</td>
                  <td>{result.greenOffset}</td>
                  <td>{result.runtime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="alignment-failure-note" id="emir-failure-reason">
          * The Emir image is misaligned because its highly saturated clothing produces substantially different intensity patterns across the red, green, and blue channels. Although NCC compensates for global brightness and contrast differences, it cannot handle local intensity changes or reversals, so the dominant clothing region can lead the search toward an incorrect offset. In the image pyramid, an inaccurate estimate at a coarse level is doubled and propagated upward, while the narrow refinement window may prevent recovery. Comparing structural features such as image gradients or edges instead of raw pixel intensities would likely produce a more reliable alignment.
        </p>
      </section>

      <footer className="report-footer">
        <Link href="/">← Return to project archive</Link>
        <span>Maixin Zhang / 2026</span>
      </footer>
    </main>
  );
}
