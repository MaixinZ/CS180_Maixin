import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Fun with Filters and Frequencies | CS 180",
  description: "Project 2 explores convolution, finite differences, Gaussian smoothing, and derivative of Gaussian filters.",
};

type ImageResultProps = {
  alt: string;
  height?: number;
  note?: string;
  src: string;
  title: string;
  width?: number;
};

function ImageResult({ alt, height = 1024, note, src, title, width = 768 }: ImageResultProps) {
  return (
    <figure className="filter-result-slot">
      <Image
        alt={alt}
        className="filter-result-image"
        height={height}
        sizes="(max-width: 720px) 100vw, 40vw"
        src={`${assetPrefix}${src}`}
        width={width}
      />
      <figcaption>
        <strong>{title}</strong>
        {note ? <span>{note}</span> : null}
      </figcaption>
    </figure>
  );
}

function CodeSlot({ code, title }: { code: string; title: string }) {
  return (
    <div className="filter-code-slot">
      <div>
        <span>Code snippet</span>
        <strong>{title}</strong>
      </div>
      <pre aria-label={`${title} code`}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ProjectTwo() {
  return (
    <main className="report project-two" id="main-content">
      <nav className="report-nav" aria-label="Project navigation">
        <Link href="/">← Projects</Link>
        <span>CS 180 / Project 2</span>
      </nav>

      <header className="report-header">
        <p className="report-kicker">Project 2</p>
        <h1>Fun with Filters and Frequencies!</h1>
        <p className="report-deck">
          Building intuition for convolution, image derivatives, edge detection, and Gaussian filtering.
        </p>
        <nav className="part-jump project-two-jump" aria-label="Project sections">
          <a href="#overview"><span>01</span>Overview</a>
          <a href="#filters"><span>02</span>Fun with Filters</a>
          <a href="#frequencies"><span>03</span>Fun with Frequencies</a>
        </nav>
      </header>

      <section className="report-part" id="overview">
        <header className="part-heading">
          <p>01</p>
          <h2>Overview</h2>
        </header>
        <div className="project-one-copy">
          <p>
            This project explores how filtering and frequency decomposition can be used to analyze, enhance, and combine images. I begin by implementing two-dimensional convolution from scratch and comparing it with <code>scipy.signal.convolve2d()</code>. I then use finite-difference filters to compute image gradients and detect edges, examining how Gaussian smoothing and derivative-of-Gaussian filters reduce noise and produce cleaner edge maps.
          </p>
          <p>
            The second half applies these ideas across multiple spatial-frequency scales. I sharpen images with unsharp masking, construct hybrid images whose interpretation changes with viewing distance, and build Gaussian and Laplacian stacks for multiresolution blending. Using both straight and irregular masks, I combine an apple with an orange, place a dog&apos;s face onto a generated Thomas the Tank Engine image, and blend a flower field with a portrait. Together, these experiments demonstrate how frequency-aware filtering can preserve fine detail while producing smooth transitions between otherwise different images.
          </p>
        </div>
      </section>

      <section className="report-part" id="filters">
        <header className="part-heading">
          <p>02</p>
          <h2>Fun with Filters</h2>
        </header>
        <section className="filter-subpart" id="convolution">
          <header className="filter-subpart-heading">
            <p>Part 1.1</p>
            <h3>Convolutions from Scratch</h3>
          </header>
          <div className="project-one-copy">
            <p>
              I implement convolution from scratch using two nested loops. The implementation flips the kernel and applies zero-filled &quot;same&quot; padding so that pixels along the boundary can be convolved appropriately and the output retains the same shape as the input image. I use <code>np.pad()</code> to add padding equal to half the kernel&apos;s height and width on the corresponding axes. I then compare my implementation with the prebuilt <code>scipy.signal.convolve2d()</code> function. My implementation takes 1.075 seconds, while the prebuilt function takes 0.628 seconds. The prebuilt function is faster because its core operations run as optimized compiled code, avoiding much of the repeated Python-level loop overhead in my implementation.
            </p>
            <p>
              To test the implementation, I convert a portrait I took at Disney to grayscale and convolve it with a normalized 9 × 9 box filter. I then apply the finite difference filters <code>D_x = [1, 0, -1]</code> and <code>D_y = D_xᵀ</code> to visualize horizontal and vertical intensity changes, respectively, revealing the image&apos;s edges.
            </p>
          </div>

          <div className="filter-code-grid filter-code-grid-single" aria-label="Convolution code snippet">
            <CodeSlot
              title="Two-loop convolution"
              code={`def convolve2d(image, kernel):
    # Flip the kernel horizontally and vertically
    kernel = np.flipud(np.fliplr(kernel))

    # Get dimensions of the kernel and image
    img_h, img_w = image.shape
    ker_h, ker_w = kernel.shape

    # Get the padding for same padding
    padding_ud = ker_h // 2
    padding_lr = ker_w // 2

    # Add padding to the image
    paddedImage = np.pad(
        image,
        ((padding_ud, padding_ud), (padding_lr, padding_lr)),
        mode="constant",
        constant_values=0,
    )

    # Create the output image
    outputImage = np.zeros((img_h, img_w))

    # Use two loops to convolve each image region
    for row in range(img_h):
        for col in range(img_w):
            patch = paddedImage[row:row+ker_h, col:col+ker_w]
            outputImage[row, col] = np.sum(patch * kernel)

    return outputImage`}
            />
          </div>

          <div className="filter-results-grid filter-results-grid-four filter-results-grid-compact" aria-label="Convolution results">
            <ImageResult
              alt="Original grayscale selfie with two costumed characters"
              note="Grayscale input"
              src="/images/project-2-original-selfie.png"
              title="Original portrait"
            />
            <ImageResult
              alt="Selfie blurred with a 9 by 9 box filter"
              note="9 × 9 averaging kernel"
              src="/images/project-2-box-filter.png"
              title="Box-filtered portrait"
            />
            <ImageResult
              alt="Horizontal derivative response of the grayscale selfie"
              note="Convolution with D_x"
              src="/images/project-2-derivative-x.png"
              title="Partial derivative in x"
            />
            <ImageResult
              alt="Vertical derivative response of the grayscale selfie"
              note="Convolution with D_y"
              src="/images/project-2-derivative-y.png"
              title="Partial derivative in y"
            />
          </div>
        </section>

        <section className="filter-subpart" id="finite-difference">
          <header className="filter-subpart-heading">
            <p>Part 1.2</p>
            <h3>Finite Difference Operator</h3>
          </header>
          <div className="project-one-copy">
            <p>
              I convolve the cameraman image with <code>D_x</code> and <code>D_y</code> to estimate its partial derivatives. From these responses, I compute the gradient magnitude at every pixel using <code>√(D_x² + D_y²)</code>. The gradient magnitude emphasizes locations where image intensity changes sharply.
            </p>
            <p>
              The gradient magnitude image contains a continuous range of response strengths, including both meaningful boundaries and weak variations caused by texture or noise. Applying a threshold converts these responses into a binary edge image: pixels above the threshold are classified as edges, while weaker responses are suppressed. I initially tested thresholds of 0.1, 0.2, and 0.3. A threshold of 0.2 retained too much noise in the grass, while 0.3 removed some meaningful edges from the camera stand. I therefore selected 0.25 as a compromise that preserves more significant edges while accepting a small amount of residual noise in the sky and grass.
            </p>
          </div>

          <div className="filter-results-grid filter-results-grid-five filter-results-grid-one-line" aria-label="Finite difference results">
            <ImageResult
              alt="Original grayscale cameraman image"
              height={542}
              note="Original grayscale image"
              src="/images/project-2-cameraman-original.png"
              title="Cameraman"
              width={540}
            />
            <ImageResult
              alt="Signed partial derivative of the cameraman image in the x direction"
              height={542}
              note="Horizontal intensity change"
              src="/images/project-2-cameraman-x.png"
              title="Partial derivative in x"
              width={540}
            />
            <ImageResult
              alt="Signed partial derivative of the cameraman image in the y direction"
              height={542}
              note="Vertical intensity change"
              src="/images/project-2-cameraman-y.png"
              title="Partial derivative in y"
              width={540}
            />
            <ImageResult
              alt="Gradient magnitude of the cameraman image"
              height={542}
              note="Combined derivative response"
              src="/images/project-2-gradient-magnitude.png"
              title="Gradient magnitude"
              width={540}
            />
            <ImageResult
              alt="Binary edges from the cameraman gradient magnitude using a threshold of 0.25"
              height={542}
              note="Threshold = 0.25"
              src="/images/project-2-binary-edges-025.png"
              title="Binary edge image"
              width={540}
            />
          </div>

          <div className="filter-comparison-block">
            <p className="filter-comparison-label">Threshold comparison</p>
            <div className="filter-results-grid filter-threshold-grid" aria-label="Binary edge threshold comparison">
              <ImageResult alt="Binary cameraman edges using a threshold of 0.1" height={542} src="/images/project-2-binary-edges-010.png" title="Threshold 0.1" width={540} />
              <ImageResult alt="Binary cameraman edges using a threshold of 0.2" height={542} src="/images/project-2-binary-edges-020.png" title="Threshold 0.2" width={540} />
              <ImageResult alt="Binary cameraman edges using a threshold of 0.25" height={542} src="/images/project-2-binary-edges-025.png" title="Threshold 0.25" width={540} />
              <ImageResult alt="Binary cameraman edges using a threshold of 0.3" height={542} src="/images/project-2-binary-edges-030.png" title="Threshold 0.3" width={540} />
            </div>
          </div>
        </section>

        <section className="filter-subpart" id="dog">
          <header className="filter-subpart-heading">
            <p>Part 1.3</p>
            <h3>Derivative of Gaussian Filter</h3>
          </header>
          <div className="project-one-copy">
            <p>
              Finite-difference operators respond strongly to noise as well as meaningful edges. To reduce these unwanted responses, I first smooth the cameraman image with a two-dimensional Gaussian filter and then repeat the differentiation, gradient-magnitude, and thresholding procedure. I generate the Gaussian kernel using <code>cv2.getGaussianKernel(9, 1.5)</code>, with a kernel size of 9 and a standard deviation of 1.5. After testing several thresholds, I determine that 0.15 produces the best result. Compared with the optimal binary edge image from Part 1.2, the smoothed result contains substantially less noise in the grass and sky while retaining the important object boundaries.
            </p>
            <p>
              I also create derivative-of-Gaussian filters by convolving the Gaussian kernel with <code>D_x</code> and <code>D_y</code>, as shown below. Applying each DoG filter directly to the original image combines smoothing and differentiation into a single convolution. This produces the same result as smoothing and differentiating in two separate steps because convolution is associative: <code>(I * G) * D = I * (G * D)</code>.
            </p>
          </div>

          <div className="filter-results-grid filter-results-grid-four filter-results-grid-four-inline" aria-label="Gaussian smoothing results">
            <ImageResult
              alt="Cameraman image smoothed with a Gaussian filter"
              height={542}
              note="Gaussian-smoothed cameraman"
              src="/images/project-2-gaussian-blur.png"
              title="Gaussian-blurred image"
              width={540}
            />
            <ImageResult
              alt="Gradient magnitude calculated after Gaussian smoothing"
              height={542}
              note="Gradient magnitude after smoothing"
              src="/images/project-2-gaussian-gradient.png"
              title="Smoothed gradient magnitude"
              width={540}
            />
            <ImageResult
              alt="Binary cameraman edges after Gaussian smoothing using a threshold of 0.15"
              height={542}
              note="Threshold = 0.15"
              src="/images/project-2-gaussian-edges-015.png"
              title="Smoothed binary edges"
              width={540}
            />
            <ImageResult
              alt="Binary cameraman edges without Gaussian smoothing using a threshold of 0.25"
              height={542}
              note="Part 1.2, threshold = 0.25"
              src="/images/project-2-binary-edges-025.png"
              title="Original binary edges"
              width={540}
            />
          </div>

          <div className="filter-results-grid filter-kernel-grid" aria-label="Derivative of Gaussian filters">
            <ImageResult
              alt="Derivative of Gaussian kernel in the x direction"
              height={9}
              note="Gaussian convolved with D_x"
              src="/images/project-2-dog-x.png"
              title="DoG filter in x"
              width={9}
            />
            <ImageResult
              alt="Derivative of Gaussian kernel in the y direction"
              height={9}
              note="Gaussian convolved with D_y"
              src="/images/project-2-dog-y.png"
              title="DoG filter in y"
              width={9}
            />
            <ImageResult
              alt="Binary cameraman edges produced with derivative of Gaussian filters"
              height={542}
              note="Direct DoG filter application"
              src="/images/project-2-dog-edges.png"
              title="One-pass DoG result"
              width={540}
            />
          </div>

        </section>
      </section>

      <section className="report-part" id="frequencies">
        <header className="part-heading">
          <p>03</p>
          <h2>Fun with Frequencies</h2>
        </header>
        <section className="filter-subpart" id="sharpening">
          <header className="filter-subpart-heading">
            <p>Part 2.1</p>
            <h3>Image Sharpening</h3>
          </header>

          <div className="project-one-copy sharpening-intro">
            <p>
              In this part, I implement an unsharp mask filter to sharpen digital images. I first blur the original image with a Gaussian filter, then subtract the blurred image from the original to isolate its high-frequency details. Finally, I add these details back to the original image, scaled by a coefficient <code>α</code>, to increase local contrast along edges. I use a Gaussian filter with a kernel size of 9 and a standard deviation of 1.5.
            </p>
            <p>
              The first row below shows the original, blurred, high-frequency, and sharpened versions of the Taj Mahal image. The second row presents the same process for a famous tower in Quanzhou, China. The high-frequency details appear less pronounced in the second result because that image has a much higher resolution, so the same 9 × 9 Gaussian kernel covers a smaller proportion of the scene and produces a subtler blur. Consequently, subtracting the blurred image leaves a lower-amplitude high-frequency residual.
            </p>
          </div>

          <div className="filter-result-series">
            <h4>Taj Mahal</h4>
            <div className="filter-results-grid filter-results-grid-four filter-results-grid-four-inline filter-sharpening-grid" aria-label="Taj Mahal unsharp masking results">
              <ImageResult alt="Original Taj Mahal image" height={300} src="/images/project-2-taj-original.jpg" title="Original" width={300} />
              <ImageResult alt="Gaussian-blurred Taj Mahal image" height={300} src="/images/project-2-taj-blurred.png" title="Blurred" width={300} />
              <ImageResult alt="High-frequency details extracted from the Taj Mahal image" height={300} src="/images/project-2-taj-high-frequency.png" title="High frequency" width={300} />
              <ImageResult alt="Sharpened Taj Mahal image using alpha equal to 2" height={300} note="α = 2" src="/images/project-2-taj-sharpened-a2.png" title="Sharpened" width={300} />
            </div>
          </div>

          <div className="filter-result-series">
            <h4>Quanzhou</h4>
            <div className="filter-results-grid filter-results-grid-four filter-results-grid-four-inline filter-sharpening-grid" aria-label="Quanzhou unsharp masking results">
              <ImageResult alt="Original Quanzhou tower image" height={1280} src="/images/project-2-quanzhou-original.jpg" title="Original" width={1280} />
              <ImageResult alt="Gaussian-blurred Quanzhou tower image" height={1280} src="/images/project-2-quanzhou-blurred.png" title="Blurred" width={1280} />
              <ImageResult alt="High-frequency details extracted from the Quanzhou tower image" height={1280} src="/images/project-2-quanzhou-high-frequency.png" title="High frequency" width={1280} />
              <ImageResult alt="Sharpened Quanzhou tower image using alpha equal to 2" height={1280} note="α = 2" src="/images/project-2-quanzhou-sharpened-a2.png" title="Sharpened" width={1280} />
            </div>
          </div>

          <div className="filter-result-series filter-alpha-series">
            <h4>Varying the Sharpening Amount</h4>
            <p>
              The parameter <code>α</code> controls how much of the extracted high-frequency detail is added back to the image. Increasing <code>α</code> strengthens local contrast and makes edges appear sharper, but large values also exaggerate noise and produce an increasingly harsh, unnatural result. The sequence below shows this progression from subtle sharpening at 0.5 to strong over-sharpening at 5.
            </p>
            <div className="filter-results-grid filter-results-grid-four filter-results-grid-four-inline filter-sharpening-grid" aria-label="Taj Mahal sharpening amount comparison">
              <ImageResult alt="Taj Mahal sharpened with alpha equal to 0.5" height={300} src="/images/project-2-taj-sharpened-a05.png" title="α = 0.5" width={300} />
              <ImageResult alt="Taj Mahal sharpened with alpha equal to 1" height={300} src="/images/project-2-taj-sharpened-a1.png" title="α = 1" width={300} />
              <ImageResult alt="Taj Mahal sharpened with alpha equal to 2" height={300} src="/images/project-2-taj-sharpened-a2.png" title="α = 2" width={300} />
              <ImageResult alt="Taj Mahal sharpened with alpha equal to 5" height={300} src="/images/project-2-taj-sharpened-a5.png" title="α = 5" width={300} />
            </div>
          </div>

          <div className="filter-result-series filter-alpha-series">
            <h4>Blurring and Re-sharpening</h4>
            <p>
              For this evaluation, I take the sharpened Quanzhou image, blur it with the same Gaussian filter, and then apply the unsharp mask again. The first and last images differ because Gaussian blurring removes some of the fine high-frequency information from the sharpened input, and unsharp masking cannot reconstruct that lost information. Instead, the second sharpening pass subtracts another blurred copy from the intermediate image and amplifies the contrast that remains around its transitions.
            </p>
            <div className="filter-results-grid filter-results-grid-three-inline filter-sharpening-grid" aria-label="Quanzhou blur and re-sharpen evaluation">
              <ImageResult alt="Sharpened Quanzhou tower image used as the evaluation input" height={1280} note="α = 2" src="/images/project-2-quanzhou-sharpened-a2.png" title="Sharpened input" width={1280} />
              <ImageResult alt="Previously sharpened Quanzhou tower image after Gaussian blurring" height={1280} src="/images/project-2-quanzhou-sharpened-blurred.png" title="Sharpened then blurred" width={1280} />
              <ImageResult alt="Quanzhou tower image sharpened again after blurring" height={1280} note="α = 2" src="/images/project-2-quanzhou-resharpened-a2.png" title="Re-sharpened" width={1280} />
            </div>
          </div>
        </section>

        <section className="filter-subpart" id="hybrid-images">
          <header className="filter-subpart-heading">
            <p>Part 2.2</p>
            <h3>Hybrid Images</h3>
          </header>

          <div className="project-one-copy sharpening-intro">
            <p>
              I create a hybrid image by combining the low-frequency component of my portrait with the high-frequency component of my dog&apos;s portrait. The first row shows the two aligned inputs, their filtered components, and the resulting hybrid. The second row shows the corresponding log magnitudes of their Fourier transforms, revealing how the low-pass filter concentrates energy near the center while the high-pass filter suppresses the lowest frequencies.
            </p>
            <p>
              I choose the cutoff parameters experimentally by comparing how clearly each subject appears at different viewing distances. For the low-pass component, I apply a Gaussian filter with <code>σ = 10</code>, which suppresses most fine facial detail while retaining the broad structure of my face. For the high-pass component, I subtract a Gaussian-filtered image with <code>σ = 16</code> from the original dog image. This larger value produces a lower effective high-pass cutoff, allowing the residual to retain not only fine fur texture but also enough mid-frequency facial structure for the dog to remain recognizable at close range. Together, these values produce a clear transition from the dog nearby to my face from farther away.
            </p>
          </div>

          <div className="filter-result-series">
            <h4>Spatial-domain Images</h4>
            <div className="filter-results-grid filter-results-grid-one-line filter-hybrid-grid" aria-label="Hybrid image construction in the spatial domain">
              <ImageResult alt="Aligned portrait of Maixin" height={2316} src="/images/project-2-hybrid-maixin.jpg" title="Me" width={2316} />
              <ImageResult alt="Aligned portrait of Maixin's dog" height={1097} src="/images/project-2-hybrid-dog.jpg" title="My dog" width={1097} />
              <ImageResult alt="Low-pass filtered portrait of Maixin" height={370} note="σ = 10" src="/images/project-2-hybrid-maixin-low-pass.png" title="Low-pass me" width={370} />
              <ImageResult alt="High-pass filtered portrait of Maixin's dog" height={370} note="σ = 16" src="/images/project-2-hybrid-dog-high-pass.png" title="High-pass dog" width={370} />
              <ImageResult alt="Hybrid portrait combining Maixin and her dog" height={370} src="/images/project-2-hybrid-result.png" title="Hybrid" width={370} />
            </div>
          </div>

          <div className="project-one-copy filter-frequency-analysis-copy">
            <p>
              In each Fourier spectrum, the bright center represents low frequencies associated with broad shapes and gradual intensity changes, while energy farther from the center represents high frequencies associated with edges and fine texture. After low-pass filtering my portrait, its spectrum becomes more concentrated near the center because the outer high frequencies are suppressed. In contrast, the high-pass dog spectrum has a weaker center and retains more energy away from it because the filter removes broad, slowly varying structure. The hybrid spectrum combines these patterns, with central low-frequency energy contributed by my portrait and surrounding high-frequency energy contributed by the dog.
            </p>
          </div>

          <div className="filter-result-series">
            <h4>Log Magnitude of the Fourier Transform</h4>
            <div className="filter-results-grid filter-results-grid-one-line filter-hybrid-grid" aria-label="Frequency analysis of the hybrid image construction">
              <ImageResult alt="Log magnitude Fourier spectrum of Maixin's portrait" height={370} src="/images/project-2-hybrid-maixin-spectrum.png" title="Me" width={370} />
              <ImageResult alt="Log magnitude Fourier spectrum of the dog portrait" height={370} src="/images/project-2-hybrid-dog-spectrum.png" title="My dog" width={370} />
              <ImageResult alt="Log magnitude Fourier spectrum of the low-pass portrait" height={370} note="σ = 10" src="/images/project-2-hybrid-maixin-low-pass-spectrum.png" title="Low-pass me" width={370} />
              <ImageResult alt="Log magnitude Fourier spectrum of the high-pass dog portrait" height={370} note="σ = 16" src="/images/project-2-hybrid-dog-high-pass-spectrum.png" title="High-pass dog" width={370} />
              <ImageResult alt="Log magnitude Fourier spectrum of the hybrid portrait" height={370} src="/images/project-2-hybrid-result-spectrum.png" title="Hybrid" width={370} />
            </div>
          </div>

          <div className="filter-result-series filter-alpha-series">
            <h4>Other Hybrid Images</h4>
            <div className="filter-results-grid filter-results-grid-three-inline filter-hybrid-grid" aria-label="Derek and Nutmeg hybrid image">
              <ImageResult alt="Portrait of Derek used as the low-pass source" height={732} note="Low-pass source, σ = 5" src="/images/project-2-hybrid-derek-square.jpg" title="Derek" width={732} />
              <ImageResult alt="Portrait of Nutmeg used as the high-pass source" height={1024} note="High-pass source, σ = 8" src="/images/project-2-hybrid-nutmeg-square.jpg" title="Nutmeg" width={1024} />
              <ImageResult alt="Hybrid image combining the low frequencies of Derek with the high frequencies of Nutmeg" height={220} src="/images/project-2-hybrid-derek-nutmeg-square.png" title="Derek + Nutmeg" width={220} />
            </div>
            <div className="filter-results-grid filter-results-grid-three-inline filter-hybrid-grid" aria-label="Shoe and boat hybrid image">
              <ImageResult alt="Shoe image used as the low-pass source" height={2000} note="Low-pass source, σ = 5" src="/images/project-2-hybrid-shoe-square.jpg" title="Shoe" width={2000} />
              <ImageResult alt="Boat image used as the high-pass source" height={500} note="High-pass source, σ = 8" src="/images/project-2-hybrid-boat-square.jpg" title="Boat" width={500} />
              <ImageResult alt="Hybrid image combining the low frequencies of the shoe with the high frequencies of the boat" height={370} src="/images/project-2-hybrid-shoe-boat-square.png" title="Shoe + Boat" width={370} />
            </div>
          </div>
        </section>

        <section className="filter-subpart" id="stacks">
          <header className="filter-subpart-heading">
            <p>Part 2.3</p>
            <h3>Gaussian and Laplacian Stacks</h3>
          </header>

          <div className="project-one-copy sharpening-intro">
            <p>
              In this part, I construct Gaussian and Laplacian stacks for two images: an apple and an orange. Unlike a pyramid, a stack does not downsample its images, so every level retains the original dimensions. The Gaussian stack begins with the original image at level 0, and each subsequent level is produced by applying <code>gaussian_filter()</code> to the preceding level. Each Laplacian level is computed as the difference between the corresponding Gaussian level and the next Gaussian level: <code>Lᵢ = Gᵢ − Gᵢ₊₁</code>. The final, coarsest Gaussian image is stored unchanged as the last level of the Laplacian stack. This residual makes the decomposition complete, so summing all Laplacian levels reconstructs the original image. For Gaussian filtering, I use <code>sigmaRange = [2, 4, 8, 16, 32]</code>. Doubling sigma at each step progressively expands the smoothing scale, producing a clear sequence from fine image detail to broad, low-frequency structure.
            </p>
          </div>

          <div className="filter-result-series">
            <h4>Apple Gaussian Stack</h4>
            <div className="filter-results-grid filter-results-grid-one-line filter-stack-grid filter-stack-grid-six" aria-label="Apple Gaussian stack">
              <ImageResult alt="Apple Gaussian stack level 0" height={370} note="(Original image)" src="/images/project-2-apple-gaussian-0.png" title="Gaussian Level 0" width={370} />
              <ImageResult alt="Apple Gaussian stack level 1" height={370} src="/images/project-2-apple-gaussian-1.png" title="Gaussian Level 1" width={370} />
              <ImageResult alt="Apple Gaussian stack level 2" height={370} src="/images/project-2-apple-gaussian-2.png" title="Gaussian Level 2" width={370} />
              <ImageResult alt="Apple Gaussian stack level 3" height={370} src="/images/project-2-apple-gaussian-3.png" title="Gaussian Level 3" width={370} />
              <ImageResult alt="Apple Gaussian stack level 4" height={370} src="/images/project-2-apple-gaussian-4.png" title="Gaussian Level 4" width={370} />
              <ImageResult alt="Apple Gaussian stack level 5" height={370} src="/images/project-2-apple-gaussian-5.png" title="Gaussian Level 5" width={370} />
            </div>
          </div>

          <div className="filter-result-series">
            <h4>Apple Laplacian Stack</h4>
            <div className="filter-results-grid filter-results-grid-one-line filter-stack-grid filter-stack-grid-six" aria-label="Apple Laplacian stack">
              <ImageResult alt="Apple Laplacian stack level 0" height={370} src="/images/project-2-apple-laplacian-0.png" title="Laplacian Level 0" width={370} />
              <ImageResult alt="Apple Laplacian stack level 1" height={370} src="/images/project-2-apple-laplacian-1.png" title="Laplacian Level 1" width={370} />
              <ImageResult alt="Apple Laplacian stack level 2" height={370} src="/images/project-2-apple-laplacian-2.png" title="Laplacian Level 2" width={370} />
              <ImageResult alt="Apple Laplacian stack level 3" height={370} src="/images/project-2-apple-laplacian-3.png" title="Laplacian Level 3" width={370} />
              <ImageResult alt="Apple Laplacian stack level 4" height={370} src="/images/project-2-apple-laplacian-4.png" title="Laplacian Level 4" width={370} />
              <ImageResult alt="Apple Laplacian stack level 5, equal to Gaussian stack level 5" height={370} note="(= Gaussian Level 5)" src="/images/project-2-apple-laplacian-5.png" title="Laplacian Level 5" width={370} />
            </div>
          </div>

          <div className="filter-result-series">
            <h4>Orange Gaussian Stack</h4>
            <div className="filter-results-grid filter-results-grid-one-line filter-stack-grid filter-stack-grid-six" aria-label="Orange Gaussian stack">
              <ImageResult alt="Orange Gaussian stack level 0" height={370} note="(Original image)" src="/images/project-2-orange-gaussian-0.png" title="Gaussian Level 0" width={370} />
              <ImageResult alt="Orange Gaussian stack level 1" height={370} src="/images/project-2-orange-gaussian-1.png" title="Gaussian Level 1" width={370} />
              <ImageResult alt="Orange Gaussian stack level 2" height={370} src="/images/project-2-orange-gaussian-2.png" title="Gaussian Level 2" width={370} />
              <ImageResult alt="Orange Gaussian stack level 3" height={370} src="/images/project-2-orange-gaussian-3.png" title="Gaussian Level 3" width={370} />
              <ImageResult alt="Orange Gaussian stack level 4" height={370} src="/images/project-2-orange-gaussian-4.png" title="Gaussian Level 4" width={370} />
              <ImageResult alt="Orange Gaussian stack level 5" height={370} src="/images/project-2-orange-gaussian-5.png" title="Gaussian Level 5" width={370} />
            </div>
          </div>

          <div className="filter-result-series">
            <h4>Orange Laplacian Stack</h4>
            <div className="filter-results-grid filter-results-grid-one-line filter-stack-grid filter-stack-grid-six" aria-label="Orange Laplacian stack">
              <ImageResult alt="Orange Laplacian stack level 0" height={370} src="/images/project-2-orange-laplacian-0.png" title="Laplacian Level 0" width={370} />
              <ImageResult alt="Orange Laplacian stack level 1" height={370} src="/images/project-2-orange-laplacian-1.png" title="Laplacian Level 1" width={370} />
              <ImageResult alt="Orange Laplacian stack level 2" height={370} src="/images/project-2-orange-laplacian-2.png" title="Laplacian Level 2" width={370} />
              <ImageResult alt="Orange Laplacian stack level 3" height={370} src="/images/project-2-orange-laplacian-3.png" title="Laplacian Level 3" width={370} />
              <ImageResult alt="Orange Laplacian stack level 4" height={370} src="/images/project-2-orange-laplacian-4.png" title="Laplacian Level 4" width={370} />
              <ImageResult alt="Orange Laplacian stack level 5, equal to Gaussian stack level 5" height={370} note="(= Gaussian Level 5)" src="/images/project-2-orange-laplacian-5.png" title="Laplacian Level 5" width={370} />
            </div>
          </div>

        </section>

        <section className="filter-subpart" id="multiresolution-blending">
          <header className="filter-subpart-heading">
            <p>Part 2.4</p>
            <h3>Multiresolution Blending</h3>
          </header>

          <div className="filter-result-series">
            <h4>Oraple</h4>
            <div className="project-one-copy oraple-matrix-copy">
              <p>
                The following grid illustrates how the Oraple is assembled at selected Laplacian levels. I begin with a vertical binary mask whose left half is 1 and whose right half is 0, so the mask selects the apple on the left and its complement selects the orange on the right. To construct the mask stack, I use <code>blend_sigma_range = [1, 2, 4, 8, 16, 32]</code>. I choose each sigma according to the frequency range represented at that Laplacian level. Lower levels contain relatively high-frequency information, so I use smaller sigma values to keep the mask transition narrow and preserve fine details. Higher levels contain lower-frequency information and broader structures, so I use larger sigma values to widen the transition and blend those coarse features smoothly. At each level, I multiply the apple Laplacian image by the corresponding Gaussian mask and the orange Laplacian image by its complement, then add the two weighted images. The L0, L2, and L4 rows show representative fine-to-coarse components, while the Collapsed row shows the sum of the levels in each column and the final reconstructed Oraple.
              </p>
            </div>
            <div className="oraple-matrix" aria-label="Apple, orange, and combined Laplacian levels">
              <span aria-hidden="true" />
              <strong className="oraple-column-label">Apple</strong>
              <strong className="oraple-column-label">Orange</strong>
              <strong className="oraple-column-label">Combined</strong>

              <strong className="oraple-row-label">L0</strong>
              <Image alt="Left half of the apple at Laplacian level 0" height={370} src={`${assetPrefix}/images/project-2-oraple-apple-l0.png`} width={370} />
              <Image alt="Right half of the orange at Laplacian level 0" height={370} src={`${assetPrefix}/images/project-2-oraple-orange-l0.png`} width={370} />
              <Image alt="Combined Oraple at Laplacian level 0" height={370} src={`${assetPrefix}/images/project-2-oraple-combined-l0.png`} width={370} />

              <strong className="oraple-row-label">L2</strong>
              <Image alt="Left half of the apple at Laplacian level 2" height={370} src={`${assetPrefix}/images/project-2-oraple-apple-l2.png`} width={370} />
              <Image alt="Right half of the orange at Laplacian level 2" height={370} src={`${assetPrefix}/images/project-2-oraple-orange-l2.png`} width={370} />
              <Image alt="Combined Oraple at Laplacian level 2" height={370} src={`${assetPrefix}/images/project-2-oraple-combined-l2.png`} width={370} />

              <strong className="oraple-row-label">L4</strong>
              <Image alt="Left half of the apple at Laplacian level 4" height={370} src={`${assetPrefix}/images/project-2-oraple-apple-l4.png`} width={370} />
              <Image alt="Right half of the orange at Laplacian level 4" height={370} src={`${assetPrefix}/images/project-2-oraple-orange-l4.png`} width={370} />
              <Image alt="Combined Oraple at Laplacian level 4" height={370} src={`${assetPrefix}/images/project-2-oraple-combined-l4.png`} width={370} />

              <strong className="oraple-row-label">Collapsed</strong>
              <Image alt="Collapsed Apple Laplacian levels" height={370} src={`${assetPrefix}/images/project-2-oraple-apple-collapsed.png`} width={370} />
              <Image alt="Collapsed Orange Laplacian levels" height={370} src={`${assetPrefix}/images/project-2-oraple-orange-collapsed.png`} width={370} />
              <Image alt="Final collapsed Oraple result" height={370} src={`${assetPrefix}/images/project-2-oraple-combined-collapsed.png`} width={370} />
            </div>
          </div>

          <div className="filter-result-series">
            <h4>Dog Train</h4>
            <div className="project-one-copy oraple-matrix-copy">
              <p>
                Multiresolution blending is not limited to two photographs; it can also combine a real image with a generated one. Here, I blend a photograph of my dog with a generated image of Thomas the Tank Engine. Because the subjects in the original images differ in viewpoint and geometry, their heads cannot be aligned perfectly, leaving a small mismatch around the blend boundary. I use the same Gaussian- and Laplacian-stack parameters as in the previous examples.
              </p>
            </div>
            <div className="filter-results-grid filter-results-grid-four-inline filter-hybrid-grid" aria-label="Dog and train irregular-mask blending process">
              <ImageResult alt="Aligned dog used as the blending source" height={720} src="/images/project-2-dog-train-source-dog.png" title="Dog image" width={720} />
              <ImageResult alt="Thomas the Tank Engine image used as the blending target" height={720} src="/images/project-2-dog-train-source-train.jpg" title="Train image" width={720} />
              <ImageResult alt="Irregular mask selecting the train's face" height={720} src="/images/project-2-dog-train-mask.png" title="Irregular mask" width={720} />
              <ImageResult alt="Multiresolution blend placing the dog's face on the train" height={720} src="/images/project-2-dog-train-final.png" title="Blended result" width={720} />
            </div>
            <div className="oraple-matrix" aria-label="Dog, train, and combined Laplacian levels">
              <span aria-hidden="true" />
              <strong className="oraple-column-label">Dog</strong>
              <strong className="oraple-column-label">Train</strong>
              <strong className="oraple-column-label">Combined</strong>

              <strong className="oraple-row-label">L0</strong>
              <Image alt="Masked dog face at Laplacian level 0" height={720} src={`${assetPrefix}/images/project-2-dog-train-dog-l0.png`} width={720} />
              <Image alt="Masked train at Laplacian level 0" height={720} src={`${assetPrefix}/images/project-2-dog-train-train-l0.png`} width={720} />
              <Image alt="Combined dog and train at Laplacian level 0" height={720} src={`${assetPrefix}/images/project-2-dog-train-result-l0.png`} width={720} />

              <strong className="oraple-row-label">L2</strong>
              <Image alt="Masked dog face at Laplacian level 2" height={720} src={`${assetPrefix}/images/project-2-dog-train-dog-l2.png`} width={720} />
              <Image alt="Masked train at Laplacian level 2" height={720} src={`${assetPrefix}/images/project-2-dog-train-train-l2.png`} width={720} />
              <Image alt="Combined dog and train at Laplacian level 2" height={720} src={`${assetPrefix}/images/project-2-dog-train-result-l2.png`} width={720} />

              <strong className="oraple-row-label">L4</strong>
              <Image alt="Masked dog face at Laplacian level 4" height={720} src={`${assetPrefix}/images/project-2-dog-train-dog-l4.png`} width={720} />
              <Image alt="Masked train at Laplacian level 4" height={720} src={`${assetPrefix}/images/project-2-dog-train-train-l4.png`} width={720} />
              <Image alt="Combined dog and train at Laplacian level 4" height={720} src={`${assetPrefix}/images/project-2-dog-train-result-l4.png`} width={720} />

              <strong className="oraple-row-label">Collapsed</strong>
              <Image alt="Collapsed masked dog Laplacian levels" height={720} src={`${assetPrefix}/images/project-2-dog-train-dog-collapsed.png`} width={720} />
              <Image alt="Collapsed masked train Laplacian levels" height={720} src={`${assetPrefix}/images/project-2-dog-train-train-collapsed.png`} width={720} />
              <Image alt="Final collapsed dog and train blend" height={720} src={`${assetPrefix}/images/project-2-dog-train-result-collapsed.png`} width={720} />
            </div>
          </div>

          <div className="filter-result-series">
            <h4>Girl in Flower</h4>
            <div className="filter-results-grid filter-results-grid-four-inline filter-hybrid-grid" aria-label="Irregular-mask flower and dress blending process">
              <ImageResult alt="Woman wearing the original floral dress" height={720} src="/images/project-2-irregular-dress.jpg" title="Dress image" width={720} />
              <ImageResult alt="Flower field used as the blending source" height={720} src="/images/project-2-irregular-flowers.jpg" title="Flower image" width={720} />
              <ImageResult alt="Hand-drawn irregular mask selecting the dress and surrounding foreground" height={720} src="/images/project-2-irregular-mask.png" title="Irregular mask" width={720} />
              <ImageResult alt="Multiresolution blend placing the flower field around the woman and her dress" height={720} src="/images/project-2-irregular-result.png" title="Blended result" width={720} />
            </div>
          </div>
        </section>
      </section>

      <footer className="report-footer">
        <Link href="/">← Return to project archive</Link>
        <span>Maixin Zhang / 2026</span>
      </footer>
    </main>
  );
}
