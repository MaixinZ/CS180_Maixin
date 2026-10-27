import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "(Auto)stitching and Photo Mosaics | CS 180",
  description:
    "Project 4 explores image warping, mosaicing, feature matching, and automatic panorama stitching.",
};

const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const partBSections = [
  ["B.1", "Detect Corner Features"],
  ["B.2", "Extract Feature Descriptors"],
  ["B.3", "Match Feature Descriptors"],
  ["B.4", "Compute a Robust Homography"],
  ["B.5", "Produce the Autostitched Mosaic"],
];

const correspondencePoints = [
  ["0", "(632.019, 218.513)", "(324.487, 203.968)"],
  ["1", "(703.708, 189.422)", "(394.097, 186.305)"],
  ["2", "(790.981, 154.097)", "(470.981, 168.643)"],
  ["3", "(910.461, 107.344)", "(573.838, 141.630)"],
  ["4", "(915.656, 245.526)", "(571.760, 268.383)"],
  ["5", "(795.136, 269.422)", "(476.175, 277.734)"],
  ["6", "(707.864, 290.201)", "(394.097, 291.240)"],
  ["7", "(632.019, 310.981)", "(322.409, 298.513)"],
];

export default function ProjectFour() {
  return (
    <main className="report project-four" id="main-content">
      <nav className="report-nav" aria-label="Project navigation">
        <Link href="/">← Projects</Link>
        <span>CS 180 / Project 4</span>
      </nav>

      <header className="report-header project-four-header">
        <p className="report-kicker">Project 4</p>
        <h1>(Auto)stitching and Photo Mosaics</h1>

        <nav className="part-jump project-four-jump" aria-label="Project sections">
          <a href="#overview"><span>00</span>Overview</a>
          <a href="#part-a"><span>A</span>Image Warping &amp; Mosaicing</a>
          <a href="#part-b"><span>B</span>Feature Matching for Autostitching</a>
        </nav>
      </header>

      <section className="report-part" id="overview">
        <header className="part-heading">
          <p>00</p>
          <h2>Overview</h2>
        </header>

        <div className="project-four-intro-copy">
          <p>
            Building panoramas first by hand, then automatically, moving from projective geometry
            and inverse warping to feature detection, matching, and robust alignment.
          </p>
        </div>
      </section>

      <section className="report-part project-four-major-part" id="part-a">
        <header className="project-four-part-heading">
          <p>Part A</p>
          <div>
            <h2>Image Warping &amp; Mosaicing</h2>
            <p>
              A manual stitching pipeline built from point correspondences, least-squares
              homography recovery, inverse resampling, and weighted blending.
            </p>
          </div>
        </header>

        <section className="project-four-subpart" id="a1">
          <header><span>A.1</span><h3>Shoot the Pictures</h3></header>
          <p className="project-four-section-copy">
            Photograph overlapping views while keeping the center of projection fixed and rotating
            the camera. The image sets and capture notes will appear below.
          </p>
          <figure className="project-four-photo-set">
            <figcaption>Image set 01 · Hearst Memorial Mining Building</figcaption>
            <div>
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/building-left.jpeg`}
                  alt="Left view of the Hearst Memorial Mining Building"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Left view</figcaption>
              </figure>
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/building-center.jpeg`}
                  alt="Center view of the Hearst Memorial Mining Building"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Center view</figcaption>
              </figure>
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/building-right.jpeg`}
                  alt="Right view of the Hearst Memorial Mining Building"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Right view</figcaption>
              </figure>
            </div>
            <figure className="project-four-panorama">
              <Image
                src={`${assetPrefix}/images/project-4/building-iphone-panorama.jpeg`}
                alt="iPhone panorama of the Hearst Memorial Mining Building"
                width={2904}
                height={1082}
                sizes="100vw"
              />
              <figcaption>Panorama taken with iPhone</figcaption>
            </figure>
          </figure>

          <figure className="project-four-photo-set project-four-photo-set-secondary">
            <figcaption>Image set 02 · Kitchen</figcaption>
            <div>
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/kitchen-left.jpeg`}
                  alt="Left view of the kitchen"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Left view</figcaption>
              </figure>
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/kitchen-center.jpeg`}
                  alt="Center view of the kitchen"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Center view</figcaption>
              </figure>
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/kitchen-right.jpeg`}
                  alt="Right view of the kitchen"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Right view</figcaption>
              </figure>
            </div>
            <figure className="project-four-panorama">
              <Image
                src={`${assetPrefix}/images/project-4/kitchen-iphone-panorama.jpeg`}
                alt="iPhone panorama of the kitchen"
                width={1232}
                height={638}
                sizes="100vw"
              />
              <figcaption>Panorama taken with iPhone</figcaption>
            </figure>
          </figure>
        </section>

        <section className="project-four-subpart" id="a2">
          <header><span>A.2</span><h3>Recover Homographies</h3></header>
          <div className="project-four-section-copy project-four-method-copy">
            <p>
              I implement <code>computeH</code> to recover the projective transformation between
              two images from manually selected point correspondences. For a point
              <code>a = [x, y, 1]ᵀ</code> in the first image and its matching point
              <code>b = [u, v, 1]ᵀ</code> in the second image, the homography relation is
              <code>b ∼ Ha</code>.
            </p>

            <p>
              To calculate the 8 unknown entries in the homography matrix, I rearrange the two equations into
              the following format:
            </p>

            <div className="project-four-equation" aria-label="Linear system rows contributed by one point correspondence">
              <pre>{`      [ x  y  1  0  0  0  -ux  -uy ]
Aᵢ =  [ 0  0  0  x  y  1  -vx  -vy ]

h = [ h₁  h₂  h₃  h₄  h₅  h₆  h₇  h₈ ]ᵀ
bᵢ = [ u   v ]ᵀ

Aᵢh = bᵢ`}</pre>
            </div>

            <p>
              Each correspondence therefore contributes two rows to matrix <code>A</code> and two
              entries, <code>u</code> and <code>v</code>, to the output vector <code>b</code>. Stacking
              all correspondences reformulates the original relation <code>b ∼ Ha</code> as the
              linear system <code>Ah = b</code>, where <code>h</code> contains the eight unknown
              homography entries.
            </p>

            <p>
              With more than four correspondences, the system is overdetermined and usually has no
              exact solution because the clicked coordinates contain small measurement errors. I
              use <code>np.linalg.lstsq(A, b, rcond=None)</code> to find the values of <code>h</code>
              that minimize <code>||Ah − b||²</code> across every correspondence. Finally, I reshape
              the eight recovered values into a 3 × 3 matrix and append the fixed final entry of 1.
            </p>
          </div>
          <div className="project-four-correspondences">
            <h4>Image set 01 · Hearst Memorial Mining Building</h4>
            <div className="project-four-correspondence-images">
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/correspondences-image-1.png`}
                  alt="Eight labeled correspondence points selected in image 1"
                  width={769}
                  height={615}
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
                <figcaption>Image 1 · Selected points</figcaption>
              </figure>
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/correspondences-image-2.png`}
                  alt="Eight labeled correspondence points selected in image 2"
                  width={769}
                  height={615}
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
                <figcaption>Image 2 · Matching points</figcaption>
              </figure>
            </div>

            <div className="project-four-coordinate-table-wrap">
              <table className="project-four-coordinate-table">
                <caption>Selected correspondence coordinates</caption>
                <thead>
                  <tr>
                    <th>Point</th>
                    <th>Image 1 · (x, y)</th>
                    <th>Image 2 · (u, v)</th>
                  </tr>
                </thead>
                <tbody>
                  {correspondencePoints.map(([point, imageOne, imageTwo]) => (
                    <tr key={point}>
                      <th scope="row">{point}</th>
                      <td>{imageOne}</td>
                      <td>{imageTwo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="project-four-homography-result">
            <span>Recovered homography</span>
            <pre>{`H = [ 1.37622827e+00  -6.54843301e-02  -4.42051462e+02
      2.87201730e-01   1.27595646e+00  -1.99306165e+02
      4.52170014e-04  -6.80764056e-05   1.00000000e+00 ]`}</pre>
          </div>
        </section>

        <section className="project-four-subpart" id="a3">
          <header><span>A.3</span><h3>Warp the Images</h3></header>
          <div className="project-four-section-copy project-four-method-copy">
            <p>
              After computing the homography matrix, I use it to warp each image into the reference
              image&apos;s coordinate system. I use inverse warping: for every pixel in the output, I
              apply the inverse homography to locate the corresponding position in the source image.
              Sampling in this direction avoids the holes that forward warping can leave in the
              output. I implemented two interpolation methods for sampling the source image:
            </p>

            <ol className="project-four-interpolation-list">
              <li>
                <strong>Nearest-neighbor interpolation.</strong> I use <code>np.round()</code> to
                round the mapped coordinates to the nearest source pixel and copy its value.
              </li>
              <li>
                <strong>Bilinear interpolation.</strong> I combine the four pixels surrounding the
                mapped position using weights determined by its fractional horizontal and vertical
                offsets.
                <div className="project-four-equation">
                  <pre>{`pixel = (img[y_bottom, x_left] * weight_x_left
       + img[y_bottom, x_right] * weight_x_right) * weight_y_bottom
      + (img[y_top, x_left] * weight_x_left
       + img[y_top, x_right] * weight_x_right) * weight_y_top`}</pre>
                </div>
              </li>
            </ol>

            <p>
              Below are two examples in which I rectify a selected quadrilateral region into a
              square. I set each output square&apos;s dimensions from the distances between its selected
              corner correspondences so that the result preserves a reasonable scale. In these
              examples, nearest-neighbor and bilinear interpolation produce visually similar
              results, although bilinear interpolation gives slightly smoother sampling, especially at regions with fine details.
              The final desired square crop from bilinear interpolation is also shown.
            </p>
          </div>
          <div className="project-four-rectification">
            <h4>Rectification set 01 · Instax photograph</h4>
            <div className="project-four-rectification-row">
              <figure className="project-four-square-source">
                <Image
                  src={`${assetPrefix}/images/project-4/rectification-original.png`}
                  alt="Original photograph of two overlapping Instax prints"
                  width={768}
                  height={1024}
                  sizes="(max-width: 720px) 100vw, 25vw"
                />
                <figcaption>Original</figcaption>
              </figure>
              <figure className="project-four-square-source">
                <Image
                  src={`${assetPrefix}/images/project-4/rectification-correspondences.png`}
                  alt="Instax photograph with selected corner correspondences"
                  width={445}
                  height={615}
                  sizes="(max-width: 720px) 100vw, 25vw"
                />
                <figcaption>Correspondences</figcaption>
              </figure>
              <figure>
                <div className="project-four-warp-crop">
                  <Image
                    src={`${assetPrefix}/images/project-4/rectification-nearest-neighbor.png`}
                    alt="Rectification using nearest-neighbor interpolation"
                    width={480}
                    height={640}
                    sizes="(max-width: 720px) 100vw, 25vw"
                  />
                </div>
                <figcaption>Nearest-neighbor interpolation</figcaption>
              </figure>
              <figure>
                <div className="project-four-warp-crop">
                  <Image
                    src={`${assetPrefix}/images/project-4/rectification-bilinear.png`}
                    alt="Rectification using bilinear interpolation"
                    width={480}
                    height={640}
                    sizes="(max-width: 720px) 100vw, 25vw"
                  />
                </div>
                <figcaption>Bilinear interpolation</figcaption>
              </figure>
              <figure className="project-four-rectified-square">
                <Image
                  src={`${assetPrefix}/images/project-4/rectification-square.jpeg`}
                  alt="Rectified square crop of the selected Instax photograph"
                  width={192}
                  height={192}
                  sizes="(max-width: 720px) 50vw, 20vw"
                />
                <figcaption>Rectified square image</figcaption>
              </figure>
            </div>

            <div className="project-four-rectification-set">
              <h4>Rectification set 02 · Contour Palette</h4>
              <div className="project-four-rectification-row">
                <figure className="project-four-square-source">
                  <Image
                    src={`${assetPrefix}/images/project-4/rectification-ondine-original.png`}
                    alt="Original photograph of a Contour Palette mounted on a wall"
                    width={768}
                    height={1024}
                    sizes="(max-width: 720px) 100vw, 20vw"
                  />
                  <figcaption>Original</figcaption>
                </figure>
                <figure className="project-four-square-source">
                  <Image
                    src={`${assetPrefix}/images/project-4/rectification-ondine-correspondences.png`}
                    alt="Contour Palette photograph with selected corner correspondences"
                    width={445}
                    height={615}
                    sizes="(max-width: 720px) 100vw, 20vw"
                  />
                  <figcaption>Correspondences</figcaption>
                </figure>
                <figure>
                  <div className="project-four-warp-crop">
                    <Image
                      src={`${assetPrefix}/images/project-4/rectification-ondine-nearest-neighbor.png`}
                      alt="Contour Palette rectification using nearest-neighbor interpolation"
                      width={480}
                      height={640}
                      sizes="(max-width: 720px) 100vw, 20vw"
                    />
                  </div>
                  <figcaption>Nearest-neighbor interpolation</figcaption>
                </figure>
                <figure>
                  <div className="project-four-warp-crop">
                    <Image
                      src={`${assetPrefix}/images/project-4/rectification-ondine-bilinear.png`}
                      alt="Contour Palette rectification using bilinear interpolation"
                      width={480}
                      height={640}
                      sizes="(max-width: 720px) 100vw, 20vw"
                    />
                  </div>
                  <figcaption>Bilinear interpolation</figcaption>
                </figure>
                <figure className="project-four-rectified-square">
                  <Image
                    src={`${assetPrefix}/images/project-4/rectification-ondine-square.jpeg`}
                    alt="Rectified square image of the Contour Palette"
                    width={299}
                    height={299}
                    sizes="(max-width: 720px) 50vw, 20vw"
                  />
                  <figcaption>Rectified square image</figcaption>
                </figure>
              </div>

              <div className="project-four-rectification-detail-row">
                <figure>
                  <Image
                    src={`${assetPrefix}/images/project-4/rectification-ondine-nearest-neighbor-smile.png`}
                    alt="Magnified Little Ondine smile logo using nearest-neighbor interpolation"
                    width={600}
                    height={450}
                    sizes="(max-width: 720px) 100vw, 50vw"
                  />
                  <figcaption>Nearest neighbor</figcaption>
                </figure>
                <figure>
                  <Image
                    src={`${assetPrefix}/images/project-4/rectification-ondine-bilinear-smile.png`}
                    alt="Magnified Little Ondine smile logo using bilinear interpolation"
                    width={600}
                    height={450}
                    sizes="(max-width: 720px) 100vw, 50vw"
                  />
                  <figcaption>Bilinear</figcaption>
                </figure>
              </div>
              <p className="project-four-rectification-detail-note">
                In the enlarged smile logo, nearest-neighbor interpolation produces more abrupt,
                block-like pixel transitions, while bilinear interpolation blends adjacent pixels
                to create smoother edges. The difference is subtle at the original display size
                but becomes clearer when the small feature is magnified.
              </p>
            </div>

            <div className="project-four-wall-warp">
              <h4>Warping the A.2 image pair</h4>
              <p>
                I also warp Image 1 from Part A.2 using the selected correspondences and bilinear
                interpolation so that it aligns with Image 2.
              </p>
              <div>
                <figure>
                  <div className="project-four-wall-source-crop">
                    <Image
                      src={`${assetPrefix}/images/project-4/correspondences-image-1.png`}
                      alt="Selected correspondence points in Image 1"
                      width={769}
                      height={615}
                      sizes="(max-width: 720px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption>Image 1 · Correspondences</figcaption>
                </figure>
                <figure>
                  <div className="project-four-wall-source-crop">
                    <Image
                      src={`${assetPrefix}/images/project-4/correspondences-image-2.png`}
                      alt="Matching correspondence points in Image 2"
                      width={769}
                      height={615}
                      sizes="(max-width: 720px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption>Image 2 · Correspondences</figcaption>
                </figure>
                <figure className="project-four-wall-warp-output">
                  <div>
                    <Image
                      src={`${assetPrefix}/images/project-4/warped-wall-image-1.png`}
                      alt="Image 1 warped toward Image 2 using bilinear interpolation"
                      width={640}
                      height={480}
                      sizes="(max-width: 720px) 100vw, 33vw"
                    />
                  </div>
                  <figcaption>Warped Image 1</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="project-four-subpart" id="a4">
          <header><span>A.4</span><h3>Blend Images into a Mosaic</h3></header>
          <div className="project-four-section-copy project-four-method-copy">
            <p>
              For each mosaic, I select one photograph as the reference and copy it directly into
              the mosaic without transforming it. I use the center photograph for the three-image
              mosaics and the left photograph for the two-image mosaic. I then compute a homography
              from every remaining image into the reference image&apos;s projection. After transforming
              the four corners of every input image, I take their minimum and maximum coordinates to
              determine the size of one shared output canvas.
            </p>

            <p>
              I inverse-warp each side image into this canvas. For every output pixel, I apply the
              inverse homography to find its continuous source coordinate. Because this coordinate
              is usually between pixels, I use bilinear interpolation to combine its four nearest
              source pixels.
            </p>

            <p>
              Each warped image also produces an alpha mask marking its valid pixels. I convert each
              mask with a distance transform, giving pixels near the image
              center more influence and pixels near its boundary less influence. In overlapping
              regions, I multiply each image by its weight, add the results, and divide by the sum of
              the weights. This normalized weighted average creates a gradual transition between
              images. Some fine details appear blurry because small correspondence or homography errors can
              leave overlapping images a few pixels out of alignment.
            </p>
          </div>

          <div className="project-four-mosaic-set">
            <h4>Image set 01 · Kitchen</h4>

            <div className="project-four-mosaic-sources">
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/kitchen-left.jpeg`}
                  alt="Left source view of the kitchen"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 1</figcaption>
              </figure>

              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/kitchen-center.jpeg`}
                  alt="Center reference view of the kitchen"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 2 · Reference</figcaption>
              </figure>

              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/kitchen-right.jpeg`}
                  alt="Right source view of the kitchen"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 3</figcaption>
              </figure>
            </div>

            <figure className="project-four-mosaic-result">
              <Image
                src={`${assetPrefix}/images/project-4/kitchen-manual-mosaic.png`}
                alt="Kitchen mosaic made by warping the side images into the center image projection and feather blending the overlaps"
                width={1600}
                height={800}
                sizes="(max-width: 720px) 100vw, 1100px"
              />
              <figcaption>Final mosaic</figcaption>
            </figure>
          </div>

          <div className="project-four-mosaic-set project-four-mosaic-set-secondary">
            <h4>Image set 02 · Balcony</h4>

            <div className="project-four-mosaic-sources">
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/balcony-left.jpeg`}
                  alt="Left source view of the balcony"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 1</figcaption>
              </figure>

              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/balcony-center.jpeg`}
                  alt="Center reference view of the balcony"
                  width={2247}
                  height={1685}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 2 · Reference</figcaption>
              </figure>

              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/balcony-right.jpeg`}
                  alt="Right source view of the balcony"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 3</figcaption>
              </figure>
            </div>

            <figure className="project-four-mosaic-result">
              <Image
                src={`${assetPrefix}/images/project-4/balcony-manual-mosaic.png`}
                alt="Balcony mosaic made by warping the side images into the center image projection and feather blending the overlaps"
                width={1600}
                height={800}
                sizes="(max-width: 720px) 100vw, 1100px"
              />
              <figcaption>Final mosaic</figcaption>
            </figure>
          </div>

          <div className="project-four-mosaic-set project-four-mosaic-set-secondary">
            <h4>Image set 03 · Campanile gate</h4>

            <div className="project-four-mosaic-sources project-four-mosaic-sources-two">
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/gate-left.jpeg`}
                  alt="Left reference source image of the Campanile gate scene"
                  width={4284}
                  height={5712}
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
                <figcaption>Source image 1 · Reference</figcaption>
              </figure>

              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/gate-right.jpeg`}
                  alt="Right source image of the Campanile gate scene"
                  width={4284}
                  height={5712}
                  sizes="(max-width: 720px) 100vw, 50vw"
                />
                <figcaption>Source image 2</figcaption>
              </figure>
            </div>

            <figure className="project-four-mosaic-result">
              <Image
                src={`${assetPrefix}/images/project-4/gate-manual-mosaic.png`}
                alt="Two-image Campanile gate mosaic using the left image as the reference"
                width={1600}
                height={800}
                sizes="(max-width: 720px) 100vw, 1100px"
              />
              <figcaption>Final mosaic · Left image used as reference</figcaption>
            </figure>
          </div>

          <div className="project-four-mosaic-set project-four-mosaic-set-secondary">
            <h4>Image set 04 · Hearst Memorial Mining Building (bad example)</h4>

            <p className="project-four-mosaic-note">
              This set produces a poor mosaic because adjacent photographs do not contain enough
              overlap. The small shared regions provide too few well-distributed correspondences,
              so the homographies are poorly constrained away from those regions. To force the
              right image into the center image&apos;s projection, the transformation applies extreme
              perspective scaling and shearing. As a result, objects are stretched and their
              original width-to-height proportions are no longer preserved.
            </p>

            <div className="project-four-mosaic-sources">
              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/building-left.jpeg`}
                  alt="Left source view of the Hearst Memorial Mining Building"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 1</figcaption>
              </figure>

              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/building-center.jpeg`}
                  alt="Center reference view of the Hearst Memorial Mining Building"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 2 · Reference</figcaption>
              </figure>

              <figure>
                <Image
                  src={`${assetPrefix}/images/project-4/building-right.jpeg`}
                  alt="Right source view of the Hearst Memorial Mining Building"
                  width={1024}
                  height={768}
                  sizes="(max-width: 720px) 100vw, 33vw"
                />
                <figcaption>Source image 3</figcaption>
              </figure>
            </div>

            <figure className="project-four-mosaic-result">
              <Image
                src={`${assetPrefix}/images/project-4/memorial-manual-mosaic.png`}
                alt="Distorted Hearst Memorial Mining Building mosaic caused by insufficient overlap between source photographs"
                width={1600}
                height={800}
                sizes="(max-width: 720px) 100vw, 1100px"
              />
              <figcaption>Bad mosaic · Insufficient overlap and excessive distortion</figcaption>
            </figure>
          </div>
        </section>
      </section>

      <section className="report-part project-four-major-part" id="part-b">
        <header className="project-four-part-heading">
          <p>Part B</p>
          <div>
            <h2>Feature Matching for Autostitching</h2>
            <p>
              An automatic correspondence pipeline that detects stable corners, describes local
              appearance, filters matches, and estimates a homography robustly.
            </p>
          </div>
        </header>

        {partBSections.map(([number, title], index) => (
          <section className="project-four-subpart" id={`b${index + 1}`} key={number}>
            <header><span>{number}</span><h3>{title}</h3></header>
          </section>
        ))}
      </section>

      <footer className="report-footer">
        <Link href="/">← Project archive</Link>
        <a href="#main-content">Back to top ↑</a>
      </footer>
    </main>
  );
}
