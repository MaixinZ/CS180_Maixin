import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project 3 — Fun with Flow Models",
  description: "A CS 180 project exploring flow-based generative models.",
};

const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const unconditionalUNetCode = `class UnconditionalUNet(nn.Module):
    def __init__(
        self,
        in_channels: int,
        num_hiddens: int,
    ):
        super().__init__()
        self.cb1 = ConvBlock(in_channels, num_hiddens)
        self.down1 = DownBlock(num_hiddens, num_hiddens)
        self.down2 = DownBlock(num_hiddens, 2 * num_hiddens)

        self.flat = Flatten()
        self.unflat = Unflatten(2 * num_hiddens)

        self.up1 = UpBlock(4 * num_hiddens, num_hiddens)
        self.up2 = UpBlock(2 * num_hiddens, num_hiddens)

        self.cb2 = ConvBlock(2 * num_hiddens, num_hiddens)
        self.conv = nn.Conv2d(num_hiddens, in_channels, kernel_size=3, padding=1, stride=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        assert x.shape[-2:] == (28, 28), "Expect input shape to be (28, 28)."

        step1 = self.cb1(x)
        step2 = self.down1(step1)
        step3 = self.down2(step2)

        step4 = self.flat(step3)
        step5 = self.unflat(step4)

        step6 = torch.cat([step3, step5], dim=1)
        step7 = self.up1(step6)
        step8 = torch.cat([step2, step7], dim=1)

        step9 = self.up2(step8)
        step10 = torch.cat([step1, step9], dim=1)

        step11 = self.cb2(step10)
        result = self.conv(step11)

        return result`;

const timeConditionalUNetCode = `class TimeConditionalUNet(nn.Module):
    def __init__(
        self,
        in_channels: int,
        num_classes: int,
        num_hiddens: int,
    ):
        super().__init__()

        self.cb1 = ConvBlock(in_channels, num_hiddens)
        self.down1 = DownBlock(num_hiddens, num_hiddens)
        self.down2 = DownBlock(num_hiddens, 2 * num_hiddens)

        self.flat = Flatten()
        self.unflat = Unflatten(2 * num_hiddens)

        self.fcb1 = FCBlock(1, 2 * num_hiddens)
        self.fcb2 = FCBlock(1, num_hiddens)

        self.up1 = UpBlock(4 * num_hiddens, num_hiddens)
        self.up2 = UpBlock(2 * num_hiddens, num_hiddens)

        self.cb2 = ConvBlock(2 * num_hiddens, num_hiddens)
        self.conv = nn.Conv2d(num_hiddens, in_channels, kernel_size=3, stride=1, padding=1)

    def forward(
        self,
        x: torch.Tensor,
        t: torch.Tensor,
    ) -> torch.Tensor:
        """
        Args:
            x: (N, C, 28, 28) input tensor.
            t: (N,) normalized time tensor.

        Returns:
            (N, C, 28, 28) predicted velocity.
        """
        assert x.shape[-2:] == (28, 28)
        assert t.shape == (x.shape[0],)

        t = t[:, None].to(device=x.device, dtype=x.dtype)

        step1 = self.cb1(x)
        step2 = self.down1(step1)
        step3 = self.down2(step2)

        step4 = self.flat(step3)
        step5 = self.unflat(step4)

        t1 = self.fcb1(t)[:, :, None, None]
        step5 = step5 * t1

        step6 = torch.cat([step3, step5], dim=1)
        step7 = self.up1(step6)

        t2 = self.fcb2(t)[:, :, None, None]
        step7 = step7 * t2

        step8 = torch.cat([step2, step7], dim=1)
        step9 = self.up2(step8)

        step10 = torch.cat([step1, step9], dim=1)
        step11 = self.cb2(step10)

        return self.conv(step11)`;

const noisyTrainingInputs = [
  { src: `${assetPrefix}/images/project-3/bee-original.png`, label: "Original", alt: "Original upright image of a yellow robot" },
  { src: `${assetPrefix}/images/project-3/bee-t025.png`, label: "t = 0.25", alt: "Yellow robot training input at time 0.25 with heavy Gaussian noise" },
  { src: `${assetPrefix}/images/project-3/bee-t050.png`, label: "t = 0.50", alt: "Yellow robot training input at time 0.50 with moderate Gaussian noise" },
  { src: `${assetPrefix}/images/project-3/bee-t075.png`, label: "t = 0.75", alt: "Yellow robot training input at time 0.75 with light Gaussian noise" },
];

const classicalDenoisingResults = [
  { src: `${assetPrefix}/images/project-3/bee-noisy-t025.png`, label: "Noisy input · t = 0.25", alt: "Upright noisy yellow robot input at time 0.25" },
  { src: `${assetPrefix}/images/project-3/bee-blur-t025-sigma8.png`, label: "t = 0.25 · σ = 8.0", alt: "Upright Gaussian-denoised yellow robot at time 0.25 using sigma 8" },
  { src: `${assetPrefix}/images/project-3/bee-noisy-t050.png`, label: "Noisy input · t = 0.50", alt: "Upright noisy yellow robot input at time 0.50" },
  { src: `${assetPrefix}/images/project-3/bee-blur-t050-sigma2.png`, label: "t = 0.50 · σ = 2.0", alt: "Upright Gaussian-denoised yellow robot at time 0.50 using sigma 2" },
  { src: `${assetPrefix}/images/project-3/bee-noisy-t075.png`, label: "Noisy input · t = 0.75", alt: "Upright noisy yellow robot input at time 0.75" },
  { src: `${assetPrefix}/images/project-3/bee-blur-t075-sigma1.png`, label: "t = 0.75 · σ = 1.0", alt: "Upright Gaussian-denoised yellow robot at time 0.75 using sigma 1" },
];

const oneStepDenoisingRows = [
  {
    time: "0.25",
    images: [
      { src: `${assetPrefix}/images/project-3/bee-original.png`, label: "Original", alt: "Original upright image of a yellow robot" },
      { src: `${assetPrefix}/images/project-3/bee-noisy-t025.png`, label: "Noisy input", alt: "Upright noisy yellow robot input at time 0.25" },
      { src: `${assetPrefix}/images/project-3/bee-one-step-t025.png`, label: "One-step estimate", alt: "Upright one-step denoising estimate at time 0.25" },
    ],
  },
  {
    time: "0.50",
    images: [
      { src: `${assetPrefix}/images/project-3/bee-original.png`, label: "Original", alt: "Original upright image of a yellow robot" },
      { src: `${assetPrefix}/images/project-3/bee-noisy-t050.png`, label: "Noisy input", alt: "Upright noisy yellow robot input at time 0.50" },
      { src: `${assetPrefix}/images/project-3/bee-one-step-t050.png`, label: "One-step estimate", alt: "Upright one-step denoising estimate at time 0.50" },
    ],
  },
  {
    time: "0.75",
    images: [
      { src: `${assetPrefix}/images/project-3/bee-original.png`, label: "Original", alt: "Original upright image of a yellow robot" },
      { src: `${assetPrefix}/images/project-3/bee-noisy-t075.png`, label: "Noisy input", alt: "Upright noisy yellow robot input at time 0.75" },
      { src: `${assetPrefix}/images/project-3/bee-one-step-t075.png`, label: "One-step estimate", alt: "Upright one-step denoising estimate at time 0.75" },
    ],
  },
];

const velocityVisualizationRows = [
  {
    time: "0.25",
    images: [
      { src: `${assetPrefix}/images/project-3/bee-velocity-t025-noisy.png`, label: "Noisy image", alt: "Upright noisy yellow robot at time 0.25" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t025-predicted.png`, label: "Predicted update", alt: "Predicted velocity update at time 0.25" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t025-ground-truth.png`, label: "Ground-truth update", alt: "Ground-truth velocity update at time 0.25" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t025-error.png`, label: "Error heatmap", alt: "RGB RMS error heatmap at time 0.25" },
    ],
  },
  {
    time: "0.50",
    images: [
      { src: `${assetPrefix}/images/project-3/bee-velocity-t050-noisy.png`, label: "Noisy image", alt: "Upright noisy yellow robot at time 0.50" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t050-predicted.png`, label: "Predicted update", alt: "Predicted velocity update at time 0.50" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t050-ground-truth.png`, label: "Ground-truth update", alt: "Ground-truth velocity update at time 0.50" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t050-error.png`, label: "Error heatmap", alt: "RGB RMS error heatmap at time 0.50" },
    ],
  },
  {
    time: "0.75",
    images: [
      { src: `${assetPrefix}/images/project-3/bee-velocity-t075-noisy.png`, label: "Noisy image", alt: "Upright noisy yellow robot at time 0.75" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t075-predicted.png`, label: "Predicted update", alt: "Predicted velocity update at time 0.75" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t075-ground-truth.png`, label: "Ground-truth update", alt: "Ground-truth velocity update at time 0.75" },
      { src: `${assetPrefix}/images/project-3/bee-velocity-t075-error.png`, label: "Error heatmap", alt: "RGB RMS error heatmap at time 0.75" },
    ],
  },
];

const eulerTrajectory = [
  { src: `${assetPrefix}/images/project-3/bee-euler-t050.png`, label: "t = 0.50", alt: "Upright Euler denoising state at time 0.50" },
  { src: `${assetPrefix}/images/project-3/bee-euler-t060.png`, label: "t = 0.60", alt: "Upright Euler denoising state at time 0.60" },
  { src: `${assetPrefix}/images/project-3/bee-euler-t070.png`, label: "t = 0.70", alt: "Upright Euler denoising state at time 0.70" },
  { src: `${assetPrefix}/images/project-3/bee-euler-t080.png`, label: "t = 0.80", alt: "Upright Euler denoising state at time 0.80" },
  { src: `${assetPrefix}/images/project-3/bee-euler-t090.png`, label: "t = 0.90", alt: "Upright Euler denoising state at time 0.90" },
  { src: `${assetPrefix}/images/project-3/bee-euler-t100.png`, label: "t = 1.00", alt: "Upright final Euler denoising state at time 1.00" },
];

const denoisingComparison = [
  { src: `${assetPrefix}/images/project-3/bee-comparison-original.png`, label: "Original", alt: "Original upright image of a yellow robot" },
  { src: `${assetPrefix}/images/project-3/bee-comparison-blur.png`, label: "Gaussian blur", alt: "Upright Gaussian-blur denoising result" },
  { src: `${assetPrefix}/images/project-3/bee-comparison-one-step.png`, label: "One-step", alt: "Upright one-step denoising result" },
  { src: `${assetPrefix}/images/project-3/bee-comparison-euler.png`, label: "Euler", alt: "Upright Euler denoising result" },
];

const generatedSamples = [180, 181, 182, 183, 184].map((seed) => ({
  src: `${assetPrefix}/images/project-3/sample-seed-${seed}.png`,
  label: `Seed ${seed}`,
  alt: `Image generated from Gaussian noise using seed ${seed}`,
}));

const guidedSamples = [180, 181, 182, 183, 184].map((seed) => ({
  src: `${assetPrefix}/images/project-3/cfg-seed-${seed}-w7.png`,
  label: `Seed ${seed} · w = 7`,
  alt: `Classifier-free guided portrait generated with seed ${seed} and guidance weight 7`,
}));

const imageToImageEdits = [
  {
    src: `${assetPrefix}/images/project-3/edit-campanile.png`,
    title: "Campanile",
    alt: "Image-to-image editing progression for the Campanile across several starting times",
  },
  {
    src: `${assetPrefix}/images/project-3/edit-dog.png`,
    title: "Dog",
    alt: "Image-to-image editing progression for a dog across several starting times",
  },
  {
    src: `${assetPrefix}/images/project-3/edit-hotpot.png`,
    title: "Hotpot",
    alt: "Image-to-image editing progression for a hotpot across several starting times",
  },
];

const nonrealisticImageEdits = [
  {
    src: `${assetPrefix}/images/project-3/edit-duolingo-owl.png`,
    title: "Duolingo Owl",
    alt: "Image-to-image editing progression for a stylized green owl across several starting times",
  },
  {
    src: `${assetPrefix}/images/project-3/edit-rabbit.png`,
    title: "Rabbit",
    alt: "Image-to-image editing progression for a rabbit drawing across several starting times",
  },
  {
    src: `${assetPrefix}/images/project-3/edit-tree.png`,
    title: "Tree",
    alt: "Image-to-image editing progression for a tree drawing across several starting times",
  },
];

const textGuidedImageEdits = [
  {
    src: `${assetPrefix}/images/project-3/text-edit-campanile-pen.png`,
    title: "Campanile → White Pen",
    alt: "Text-guided image editing progression transforming the Campanile into a white pen",
  },
  {
    src: `${assetPrefix}/images/project-3/text-edit-dog-teddy.png`,
    title: "Dog → White Teddy Bear",
    alt: "Text-guided image editing progression transforming a dog into a white teddy bear on a yellow bed",
  },
  {
    src: `${assetPrefix}/images/project-3/text-edit-hotpot-red-moon.png`,
    title: "Hotpot → Red Moon",
    alt: "Text-guided image editing progression transforming a hotpot into a red moon",
  },
];

export default function ProjectThree() {
  return (
    <main className="report" id="main-content">
      <nav className="report-nav" aria-label="Project navigation">
        <Link href="/">← Projects</Link>
        <span>CS 180 / Project 3</span>
      </nav>

      <header className="report-header">
        <p className="report-kicker">Project 3</p>
        <h1>Fun with Flow Models</h1>
        <p className="report-deck">
          Exploring how flow models transform noise into structured images, then building the
          core flow-matching process from scratch.
        </p>
        <nav className="part-jump" aria-label="Jump to a project part">
          <a href="#overview"><span>00</span> Overview</a>
          <a href="#part-a"><span>A</span> Exploring flow models</a>
          <a href="#part-b"><span>B</span> Flow matching from scratch</a>
        </nav>
      </header>

      <section className="report-part" id="overview">
        <header className="part-heading">
          <p>Overview</p>
          <h2>From observation to implementation</h2>
        </header>
        <div className="project-one-copy">
          <p>
            This project is divided into two main parts. Part A explores the power of flow models
            through guided experiments and observations. Part B turns to the underlying method,
            constructing a flow-matching model from scratch to understand how samples move from a
            simple noise distribution toward the target data distribution.
          </p>
        </div>
      </section>

      <section className="report-part" id="part-a">
        <header className="part-heading">
          <p>Part A</p>
          <h2>Exploring the Power of Flow Models</h2>
        </header>
        <div className="project-one-copy">
          <p>
            Part A uses a pretrained flow model to study sampling, text conditioning, and creative
            image editing. The work is organized into three sections.
          </p>
        </div>

        <section className="filter-subpart" id="a1">
          <header className="filter-subpart-heading">
            <p>Section A1</p>
            <h3>Visualizing Training and Sampling</h3>
          </header>

          <section className="project-three-experiment" id="a1-1">
            <header className="filter-subpart-heading">
              <p>Part 1.1</p>
              <h3>Constructing Noisy Training Inputs</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I constructed noisy training inputs by linearly interpolating between a clean image
                and Gaussian noise:
              </p>
              <div className="math-equation" aria-label="x sub t equals open parenthesis one minus t close parenthesis epsilon plus t x sub one">
                <span><i>x</i><sub>t</sub></span>
                <span>=</span>
                <span>(1 − <i>t</i>)ε + <i>t</i><i>x</i><sub>1</sub></span>
              </div>
              <p>
                As <i>t</i> increases, the clean image <i>x</i><sub>1</sub> receives more weight while
                the noise contribution decreases, so the resulting input becomes progressively clearer.
              </p>
            </div>
            <div className="project-three-noise-grid" aria-label="Noisy training inputs at four times">
              {noisyTrainingInputs.map((image) => (
                <figure key={image.label}>
                  <Image src={image.src} alt={image.alt} width={374} height={374} sizes="(max-width: 720px) 100vw, 35vw" />
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="project-three-experiment" id="a1-2">
            <header className="filter-subpart-heading">
              <p>Part 1.2</p>
              <h3>Classical Denoising</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I used Gaussian blur as a baseline that does not rely on a learned flow model.
                Averaging nearby pixels partially cancels independent, zero-mean noise. However,
                as the examples show, the results are not especially strong—particularly at low
                values of <i>t</i>, when the input contains more noise.
              </p>
            </div>
            <div className="project-three-denoise-grid" aria-label="Noisy inputs beside their corresponding Gaussian-denoised results">
              {classicalDenoisingResults.map((image) => (
                <figure key={image.label}>
                  <Image src={image.src} alt={image.alt} width={374} height={374} sizes="(max-width: 720px) 30vw, 24vw" />
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="project-three-experiment" id="a1-3">
            <header className="filter-subpart-heading">
              <p>Part 1.3</p>
              <h3>One-Step Denoising</h3>
            </header>
            <div className="project-one-copy">
              <p>
                Using the pretrained flow model, I predicted the velocity at each noisy image and
                extrapolated once to the clean endpoint. The results are significantly better than
                those produced by Gaussian denoising. However, at low values of <i>t</i>, the
                one-step estimate is blurry because the input contains little information about the
                clean image, and the model must extrapolate across a longer interval. This amplifies
                velocity-prediction errors, while uncertainty among many plausible reconstructions
                causes fine details to be averaged together.
              </p>
            </div>
            <div className="project-three-one-step-results">
              {oneStepDenoisingRows.map((row) => (
                <section className="project-three-one-step-row" key={row.time} aria-label={`One-step denoising at t = ${row.time}`}>
                  <h4>t = {row.time}</h4>
                  <div>
                    {row.images.map((image) => (
                      <figure key={image.label}>
                        <Image src={image.src} alt={image.alt} width={374} height={374} sizes="(max-width: 720px) 30vw, 24vw" />
                        <figcaption>{image.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="project-three-experiment" id="a1-4">
            <header className="filter-subpart-heading">
              <p>Part 1.4</p>
              <h3>Visualizing Velocity</h3>
            </header>
            <div className="project-one-copy">
              <p>
                Because the original image is known, we also know the exact update required to
                reach it: <i>x</i><sub>1</sub> − <i>x</i><sub>t</sub>. I compared this ground-truth
                update with the model&apos;s predicted update. The error heatmap highlights the regions
                where the two differ most.
              </p>
            </div>
            <div className="project-three-velocity-results">
              <figure className="project-three-velocity-original">
                <Image src={`${assetPrefix}/images/project-3/bee-original.png`} alt="Original upright image of a yellow robot" width={374} height={374} sizes="25vw" />
                <figcaption>Original</figcaption>
              </figure>
              {velocityVisualizationRows.map((row) => (
                <section className="project-three-velocity-row" key={row.time} aria-label={`Velocity diagnostics at t = ${row.time}`}>
                  <h4>t = {row.time}</h4>
                  <div>
                    {row.images.map((image) => (
                      <figure key={image.label}>
                        <Image src={image.src} alt={image.alt} width={340} height={340} sizes="20vw" />
                        <figcaption>{image.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="project-three-experiment" id="a1-5">
            <header className="filter-subpart-heading">
              <p>Part 1.5</p>
              <h3>Iterative Denoising with Euler Sampling</h3>
            </header>
            <div className="project-one-copy">
              <p>
                One-step denoising can be inaccurate because the learned velocity changes as the
                image moves along the flow path. Instead, I used Euler integration: take a small
                step, predict a new velocity at the updated state, and repeat. With a step size of
                0.02, I started from the noisy image at <i>t</i> = 0.50 and performed 25 Euler
                updates to reach <i>t</i> = 1.00. Compared with the results from the previous
                sections, Euler integration produces a noticeably cleaner, higher-quality image.
              </p>
            </div>
            <figure className="project-three-euler-figure">
              <figcaption>Euler denoising trajectory</figcaption>
              <div className="project-three-euler-grid" aria-label="Euler denoising trajectory from time 0.50 to 1.00">
                {eulerTrajectory.map((image) => (
                  <figure key={image.label}>
                    <Image src={image.src} alt={image.alt} width={374} height={374} sizes="(max-width: 720px) 22vw, 18vw" />
                    <figcaption>{image.label}</figcaption>
                  </figure>
                ))}
              </div>
            </figure>

            <figure className="project-three-comparison-figure">
              <figcaption>Comparison</figcaption>
              <div className="project-three-comparison-grid" aria-label="Comparison of denoising methods">
                {denoisingComparison.map((image) => (
                  <figure key={image.label}>
                    <Image src={image.src} alt={image.alt} width={374} height={374} sizes="(max-width: 720px) 22vw, 18vw" />
                    <figcaption>{image.label}</figcaption>
                  </figure>
                ))}
              </div>
            </figure>
          </section>

          <section className="project-three-experiment" id="a1-6">
            <header className="filter-subpart-heading">
              <p>Part 1.6</p>
              <h3>Generating Images from Noise</h3>
            </header>
            <div className="project-one-copy">
              <p>
                Starting from five independent Gaussian noise samples at <em>t</em> = 0, I used the
                Euler sampler with the prompt “a high quality photo” to generate images from scratch.
                The generic prompt strongly favors human portraits, with varying realism and visible
                structural artifacts across seeds.
              </p>
            </div>
            <div className="project-three-sample-grid" aria-label="Five images generated from Gaussian noise">
              {generatedSamples.map((image) => (
                <figure key={image.label}>
                  <Image src={image.src} alt={image.alt} width={374} height={374} sizes="(max-width: 720px) 22vw, 18vw" />
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        </section>

        <section className="filter-subpart" id="a2">
          <header className="filter-subpart-heading">
            <p>Section A2</p>
            <h3>Conditional Generation and Guidance</h3>
          </header>
          <div className="project-one-copy">
            <p>
              Classifier-free guidance strengthens the effect of the text condition by moving the
              conditional velocity farther away from the unconditional prediction:
            </p>
            <div className="math-equation" aria-label="v C F G equals v conditional plus w times open parenthesis v conditional minus v unconditional close parenthesis">
              <span><i>v</i><sub>CFG</sub></span>
              <span>=</span>
              <span><i>v</i><sub>cond</sub> + <i>w</i>(<i>v</i><sub>cond</sub> − <i>v</i><sub>uncond</sub>)</span>
            </div>
            <p>
              Here, <i>w</i> controls the guidance strength. When <i>w</i> = 0, the result is the
              ordinary conditional prediction; increasing <i>w</i> emphasizes features associated
              with the prompt. The samples below use <i>w</i> = 7.
            </p>
          </div>
          <div className="project-three-sample-grid" aria-label="Five images generated with classifier-free guidance weight 7">
            {guidedSamples.map((image) => (
              <figure key={image.label}>
                <Image src={image.src} alt={image.alt} width={374} height={374} sizes="(max-width: 720px) 22vw, 18vw" />
                <figcaption>{image.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="project-one-copy project-three-sample-comparison">
            <p>
              Compared with the generated images in Section 1.6, the images generated using
              classifier-free guidance have significantly higher quality and look more natural.
              This is because classifier-free guidance amplifies the difference between the
              conditional and unconditional predictions, pushing each sample more strongly toward
              features that match the prompt and away from generic or noisy outputs.
            </p>
          </div>
        </section>

        <section className="filter-subpart" id="a3">
          <header className="filter-subpart-heading">
            <p>Section A3</p>
            <h3>Creative Applications</h3>
          </header>
          <div className="project-one-copy">
            <p>
              Apply guided sampling to image-to-image editing, text-guided transformations, visual
              anagrams, and hybrid-image illusions.
            </p>
          </div>

          <section className="project-three-experiment" id="a3-1">
            <header className="filter-subpart-heading">
              <p>Part 3.1</p>
              <h3>Image-to-Image Editing</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I added different amounts of noise to each source image and then denoised it with
                the guided flow model. Smaller starting times introduce more noise and give the
                model greater freedom to reinterpret the scene, while larger starting times retain
                more of the original image&apos;s structure and details.
              </p>
            </div>
            <div className="project-three-edit-results">
              {imageToImageEdits.map((image) => (
                <figure key={image.title}>
                  <figcaption>{image.title}</figcaption>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1593}
                    height={811}
                    sizes="(max-width: 720px) 100vw, 88vw"
                  />
                </figure>
              ))}
            </div>
            <h4 className="project-three-edit-subtitle">Nonrealistic images</h4>
            <div className="project-three-edit-results">
              {nonrealisticImageEdits.map((image) => (
                <figure key={image.title}>
                  <figcaption>{image.title}</figcaption>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1593}
                    height={811}
                    sizes="(max-width: 720px) 100vw, 88vw"
                  />
                </figure>
              ))}
            </div>
          </section>

          <section className="project-three-experiment" id="a3-2">
            <header className="filter-subpart-heading">
              <p>Part 3.2</p>
              <h3>Text-Guided Image Editing</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I repeated the image-to-image editing procedure from the previous section, but
                replaced the generic prompt “a high quality photo” with a prompt describing the
                desired edit for each image.
              </p>
            </div>
            <div className="project-three-edit-results">
              {textGuidedImageEdits.map((image) => (
                <figure key={image.title}>
                  <figcaption>{image.title}</figcaption>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={1580}
                    height={811}
                    sizes="(max-width: 720px) 100vw, 88vw"
                  />
                </figure>
              ))}
            </div>
          </section>

          <section className="project-three-experiment" id="a3-3">
            <header className="filter-subpart-heading">
              <p>Part 3.3</p>
              <h3>Visual Anagrams</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I generated each visual anagram from noise using two prompts. At every Euler step,
                the model predicts a guided velocity for the first prompt in the current
                orientation. I then rotate the image by 180°, predict the velocity for the second
                prompt, rotate that velocity back, and average the two updates. Repeating this
                process produces one image that reveals a different scene when turned upside down.
              </p>
            </div>
            <figure className="project-three-anagram-figure">
              <figcaption>Kitchen ↔ Wedding scene</figcaption>
              <Image
                src={`${assetPrefix}/images/project-3/visual-anagram-kitchen-wedding.png`}
                alt="Visual anagram showing a painting of a kitchen in one orientation and a wedding scene when rotated"
                width={793}
                height={411}
                sizes="(max-width: 720px) 100vw, 70vw"
              />
            </figure>
            <figure className="project-three-anagram-figure">
              <figcaption>Angel ↔ Devil</figcaption>
              <Image
                src={`${assetPrefix}/images/project-3/visual-anagram-angel-devil.png`}
                alt="Visual anagram showing an oil painting of an angel in one orientation and a devil when rotated"
                width={793}
                height={411}
                sizes="(max-width: 720px) 100vw, 70vw"
              />
            </figure>
          </section>

          <section className="project-three-experiment" id="a3-4">
            <header className="filter-subpart-heading">
              <p>Part 3.4</p>
              <h3>Hybrid Images</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I generated the hybrid image by predicting classifier-free guided velocities for
                two prompts at every Euler step. I retained the low-frequency component of the
                first velocity and the high-frequency component of the second, then added them to
                form a single update. Repeating this process produces an image whose interpretation
                changes with viewing distance: low frequencies dominate from far away, while high
                frequencies become more apparent up close.
              </p>
            </div>
            <div className="project-three-hybrid-grid">
              <figure className="project-three-hybrid-figure">
                <figcaption>Waterfall ↔ Tiger</figcaption>
                <Image
                  src={`${assetPrefix}/images/project-3/hybrid-image-waterfall.png`}
                  alt="Generated hybrid image combining different low-frequency and high-frequency interpretations"
                  width={512}
                  height={512}
                  sizes="(max-width: 720px) 100vw, 30vw"
                />
                <div className="project-three-lowpass-preview">
                  <Image
                    src={`${assetPrefix}/images/project-3/hybrid-image-waterfall-lowpass.png`}
                    alt="Gaussian low-pass view of the generated waterfall hybrid image"
                    width={512}
                    height={512}
                    sizes="5vw"
                  />
                </div>
              </figure>
              <figure className="project-three-hybrid-figure">
                <figcaption>Dress ↔ Girl&apos;s back</figcaption>
                <Image
                  src={`${assetPrefix}/images/project-3/hybrid-image-dress.png`}
                  alt="Hybrid image whose high-frequency interpretation is a dress and low-frequency interpretation is a girl's back"
                  width={512}
                  height={512}
                  sizes="(max-width: 720px) 100vw, 30vw"
                />
                <div className="project-three-lowpass-preview">
                  <Image
                    src={`${assetPrefix}/images/project-3/hybrid-image-girl-back-lowpass.png`}
                    alt="Low-pass view showing the back of a girl"
                    width={64}
                    height={64}
                    sizes="5vw"
                  />
                </div>
              </figure>
            </div>
          </section>
        </section>

      </section>

      <section className="report-part" id="part-b">
        <header className="part-heading">
          <p>Part B</p>
          <h2>Flow Matching from Scratch</h2>
        </header>
        <div className="project-one-copy">
          <p>
            Part B builds the flow-matching pipeline step by step. This section will cover the model
            design, training procedure, sampling process, and results, connecting the implementation
            back to the behavior explored in Part A.
          </p>
        </div>

        <section className="filter-subpart" id="b1">
          <header className="filter-subpart-heading">
            <p>Part 1</p>
            <h3>Training a Single-Step Denoising UNet</h3>
          </header>

          <section className="project-three-experiment" id="b1-1">
            <header className="filter-subpart-heading">
              <p>Part 1.1</p>
              <h3>Implementing the UNet</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I implemented the Denoising UNet with the following PyTorch module.
              </p>
            </div>
            <div className="filter-code-grid filter-code-grid-single">
              <div className="filter-code-slot">
                <div>
                  <span>Code snippet</span>
                  <strong>UnconditionalUNet</strong>
                </div>
                <pre aria-label="UnconditionalUNet code">
                  <code>{unconditionalUNetCode}</code>
                </pre>
              </div>
            </div>
          </section>

          <section className="project-three-experiment" id="b1-2">
            <header className="filter-subpart-heading">
              <p>Part 1.2</p>
              <h3>Visualizing the Noising Process</h3>
            </header>
            <div className="project-one-copy">
              <p>
                The clean MNIST image represents the digit 5. As σ increases, the image becomes
                progressively noisier because the random Gaussian-noise component contributes more
                strongly to the result.
              </p>
            </div>
            <figure className="project-three-noising-figure">
              <figcaption>
                Visualization of the noising process using σ = [0.0, 0.2, 0.4, 0.5, 0.6, 0.8, 1.0]
              </figcaption>
              <Image
                src={`${assetPrefix}/images/project-3/mnist-noise-levels.png`}
                alt="MNIST digit five shown with Gaussian noise levels sigma zero through one"
                width={1365}
                height={200}
                sizes="100vw"
              />
            </figure>

            <section className="project-three-experiment" id="b1-2-1">
              <header className="filter-subpart-heading">
                <p>Part 1.2.1</p>
                <h3>Training</h3>
              </header>
              <div className="project-one-copy">
                <p>
                  I trained the model to perform denoising using mean squared error (MSE) as the
                  loss function and the Adam optimizer with a learning rate of 10<sup>−4</sup>. For
                  each batch, I first added Gaussian noise to the clean images and passed the noisy
                  inputs through the UNet defined above. I then compared the predictions with the
                  original clean images and updated the model parameters by clearing the accumulated
                  gradients, backpropagating the loss, and taking an optimizer step. I repeated this
                  process for five epochs. The fifth-epoch predictions are visibly cleaner and more
                  faithful to the original digits than those produced after the first epoch.
                </p>
              </div>
              <figure className="project-three-training-figure">
                <figcaption>Single-Step Denoising with σ = 0.5</figcaption>
                <div>
                  <Image
                    src={`${assetPrefix}/images/project-3/single-step-denoising-epoch-1.png`}
                    alt="Single-step MNIST denoising results after epoch 1 with sigma 0.5"
                    width={950}
                    height={321}
                    sizes="100vw"
                  />
                  <Image
                    src={`${assetPrefix}/images/project-3/single-step-denoising-epoch-5.png`}
                    alt="Single-step MNIST denoising results after epoch 5 with sigma 0.5"
                    width={950}
                    height={321}
                    sizes="100vw"
                  />
                </div>
              </figure>
              <figure className="project-three-loss-figure">
                <figcaption>Training Loss Curve Plot</figcaption>
                <p>
                  The blue curve represents the raw loss for each batch, while the orange curve
                  represents the moving average of the blue line over the last 100 steps to make
                  the trend more readable because the blue curve jumps up and down a lot. The loss
                  drops sharply during the early optimizer steps, showing that the model
                  quickly learns the overall structure of the clean digits. It then decreases more
                  gradually and begins to level off, indicating convergence with smaller incremental
                  improvements later in training.
                </p>
                <Image
                  src={`${assetPrefix}/images/project-3/single-step-training-loss.png`}
                  alt="Mean squared error training loss plotted against optimizer steps for the single-step denoiser"
                  width={701}
                  height={278}
                  sizes="(max-width: 720px) 100vw, 55vw"
                />
              </figure>
            </section>

            <section className="project-three-experiment" id="b1-2-2">
              <header className="filter-subpart-heading">
                <p>Part 1.2.2</p>
                <h3>Out-of-Distribution Testing</h3>
              </header>
              <div className="project-one-copy">
                <p>
                  The model was trained using a noise level of σ = 0.5. When evaluated at lower
                  noise levels, it still reconstructs clear digits because the inputs contain at
                  least as much recognizable structure as the training data. At noise levels above
                  σ = 0.5, however, the predictions become increasingly blurry and distorted. These
                  inputs fall outside the model&apos;s training distribution, so it struggles to recover
                  details that have been more heavily obscured by noise.
                </p>
              </div>
              <figure className="project-three-ood-figure">
                <Image
                  src={`${assetPrefix}/images/project-3/denoising-out-of-distribution.png`}
                  alt="Noisy MNIST inputs and denoised predictions evaluated at noise levels from sigma zero to one"
                  width={1067}
                  height={1335}
                  sizes="(max-width: 720px) 100vw, 70vw"
                />
              </figure>
            </section>

            <section className="project-three-experiment" id="b1-2-3">
              <header className="filter-subpart-heading">
                <p>Part 1.2.3</p>
                <h3>Denoising Pure Noise</h3>
              </header>
              <div className="project-one-copy">
                <p>
                  When denoising begins from pure noise, the input contains no recognizable digit
                  structure and the unconditional network receives no label indicating which of the
                  ten MNIST classes it should generate. Although individual noise samples differ,
                  they provide no reliable evidence for a particular digit, so many clean outputs
                  are plausible for the same kind of input. Under an MSE objective, the optimal
                  prediction is the conditional mean of those possible clean images. As a result,
                  the model produces a blurry average of the digit distribution rather than a
                  distinct, sharp MNIST digit.
                </p>
              </div>
              <figure className="project-three-training-figure">
                <figcaption>Single-Step Denoising from Pure Noise</figcaption>
                <div>
                  <Image
                    src={`${assetPrefix}/images/project-3/pure-noise-denoising-epoch-1.png`}
                    alt="Single-step denoising from pure noise after epoch 1"
                    width={950}
                    height={321}
                    sizes="100vw"
                  />
                  <Image
                    src={`${assetPrefix}/images/project-3/pure-noise-denoising-epoch-5.png`}
                    alt="Single-step denoising from pure noise after epoch 5"
                    width={950}
                    height={321}
                    sizes="100vw"
                  />
                </div>
              </figure>
              <figure className="project-three-loss-figure">
                <figcaption>Training Loss Curve Plot from Pure Noise</figcaption>
                <p>
                  Unlike the previous loss curve, which continues falling to a much lower value,
                  the pure-noise loss quickly plateaus at a relatively high level. Because pure
                  noise provides no information about the target digit, the model cannot recover
                  each specific training image and instead converges toward a blurry conditional
                  mean, leaving substantial irreducible error.
                </p>
                <Image
                  src={`${assetPrefix}/images/project-3/pure-noise-training-loss.png`}
                  alt="Mean squared error training loss plotted against optimizer steps for denoising pure noise"
                  width={710}
                  height={278}
                  sizes="(max-width: 720px) 100vw, 55vw"
                />
              </figure>
            </section>
          </section>
        </section>

        <section className="filter-subpart" id="b2">
          <header className="filter-subpart-heading">
            <p>Part 2</p>
            <h3>Training a Flow Matching Model</h3>
          </header>

          <section className="project-three-experiment" id="b2-1">
            <header className="filter-subpart-heading">
              <p>Part 2.1</p>
              <h3>Adding Time Conditioning to the UNet</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I extended the denoising UNet with fully connected blocks that embed the normalized
                timestep <em>t</em>. These learned time embeddings are reshaped and injected into the
                bottleneck and decoder features, allowing the network to predict a different
                velocity depending on both the current noisy image <em>x</em><sub>t</sub> and its
                position along the noise-to-data path.
              </p>
            </div>
            <div className="filter-code-grid filter-code-grid-single">
              <div className="filter-code-slot">
                <div>
                  <span>Code snippet</span>
                  <strong>TimeConditionalUNet</strong>
                </div>
                <pre aria-label="TimeConditionalUNet code">
                  <code>{timeConditionalUNetCode}</code>
                </pre>
              </div>
            </div>
          </section>

          <section className="project-three-experiment" id="b2-2">
            <header className="filter-subpart-heading">
              <p>Part 2.2</p>
              <h3>Training the Time_Conditioned UNet</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I implemented the forward and reverse process for time_conditioned denoising.
              </p>
              <p>
                For the forward process, I transform a clean image into a noisy image in the
                following steps:
              </p>
              <ol>
                <li>Put the model into training mode with <code>unet.train()</code>.</li>
                <li>Sample noisy images that are the same size as the clean images.</li>
                <li>
                  Sample and prepare a different time value for every image in the batch.
                </li>
                <li>
                  Compute the intermediate noisy images using
                  <code>x_t = (1.0 - t_image) * x_0 + t_image * x_1</code>.
                </li>
                <li>
                  Calculate the MSE loss between the true velocity <code>x_1 - x_0</code> and the
                  predicted velocity <code>unet(x_t, t)</code>.
                </li>
              </ol>
              <p>
                For the reverse process, I try to create a clean image from a noisy image in the
                following steps:
              </p>
              <ol>
                <li>Put the model into evaluation mode with <code>unet.eval()</code>.</li>
                <li>Read the output size and match the model&apos;s device and precision.</li>
                <li>
                  Seed the randomness with <code>seed = 0</code> so the results are reproducible.
                </li>
                <li>Start from pure noise at <code>t = 0</code>.</li>
                <li>
                  Use Euler integration with
                  <code>x_t = x_t + dt * pred_velocity</code>, where
                  <code>pred_velocity = unet(x_t, t)</code>.
                </li>
              </ol>
            </div>
            <figure className="project-three-loss-figure">
              <figcaption>Training Loss Curve from Flow Model</figcaption>
              <Image
                src={`${assetPrefix}/images/project-3/flow-model-training-loss.png`}
                alt="Mean squared error training loss plotted against optimizer steps for the time-conditioned flow model"
                width={710}
                height={278}
                sizes="(max-width: 720px) 100vw, 55vw"
              />
            </figure>
          </section>

          <section className="project-three-experiment" id="b2-3">
            <header className="filter-subpart-heading">
              <p>Part 2.3</p>
              <h3>Sampling from the Time-Conditioned UNet</h3>
            </header>
            <figure className="project-three-training-figure">
              <figcaption>Sampling Results at Epochs 1, 5, and 10</figcaption>
              <div>
                <Image
                  src={`${assetPrefix}/images/project-3/time-flow-samples-epoch-1.png`}
                  alt="Forty samples generated by the time-conditioned flow model after epoch 1"
                  width={1156}
                  height={496}
                  sizes="100vw"
                />
                <Image
                  src={`${assetPrefix}/images/project-3/time-flow-samples-epoch-5.png`}
                  alt="Forty samples generated by the time-conditioned flow model after epoch 5"
                  width={1156}
                  height={496}
                  sizes="100vw"
                />
                <Image
                  src={`${assetPrefix}/images/project-3/time-flow-samples-epoch-10.png`}
                  alt="Forty samples generated by the time-conditioned flow model after epoch 10"
                  width={1156}
                  height={496}
                  sizes="100vw"
                />
              </div>
            </figure>
          </section>

          <section className="project-three-experiment" id="b2-4">
            <header className="filter-subpart-heading">
              <p>Part 2.4</p>
              <h3>Adding Class Conditioning to the UNet</h3>
            </header>
            <div className="project-one-copy">
              <p>
                To improve the results and provide direct control over image generation, I added a
                class-conditioning vector <em>c</em>. For MNIST, <em>c</em> is a one-hot vector that
                identifies the desired digit from 0 through 9. Fully connected blocks transform
                this vector into learned feature embeddings, which are injected into the UNet
                decoder so that its predicted velocity guides each sample toward the requested
                digit class rather than toward an unspecified point in the overall MNIST
                distribution.
              </p>
              <p>
                I also used conditioning dropout: for 10% of the training examples, I set the class
                vector to zero. These examples teach the same network to predict an unconditional
                velocity without knowing the target digit, while the remaining examples teach the
                class-conditional velocity. At sampling time, classifier-free guidance combines the
                two predictions and amplifies their difference, strengthening class-specific
                features without requiring a separate classifier.
              </p>
            </div>
          </section>

          <section className="project-three-experiment" id="b2-5">
            <header className="filter-subpart-heading">
              <p>Part 2.5</p>
              <h3>Training the UNet</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I trained the class-conditioned UNet with the same flow-matching objective used in
                Part 2.2: each batch was interpolated between Gaussian noise and clean MNIST images,
                and the model learned to predict the target velocity <em>x</em><sub>1</sub> −
                <em>x</em><sub>0</sub>. In addition to the normalized timestep, the network received
                each image&apos;s digit label, with the class condition dropped for 10% of examples to
                learn the unconditional branch required for classifier-free guidance. The forward
                and reverse processes remain mostly the same as in the unconditioned UNet. The major
                difference is that, during the reverse process, I predict the velocity at each time
                step using
                <code>
                  pred_velocity = uncond_velocity + 5.0 * (cond_velocity - uncond_velocity)
                </code>
                so the outputs are pulled more strongly toward the condition labels.
              </p>
            </div>
            <figure className="project-three-loss-figure">
              <figcaption>Training Loss Curve from the Class-Conditioned UNet</figcaption>
              <Image
                src={`${assetPrefix}/images/project-3/class-conditioned-training-loss.png`}
                alt="Mean squared error training loss plotted against optimizer steps for the class-conditioned UNet"
                width={691}
                height={278}
                sizes="(max-width: 720px) 100vw, 55vw"
              />
            </figure>
          </section>

          <section className="project-three-experiment" id="b2-6">
            <header className="filter-subpart-heading">
              <p>Part 2.6</p>
              <h3>Sampling from the UNet</h3>
            </header>
            <div className="project-one-copy">
              <p>
                I sampled four instances of every MNIST class using classifier-free guidance, with
                each column corresponding to a requested digit from 0 through 9.
              </p>
            </div>
            <figure className="project-three-training-figure">
              <figcaption>Class-Conditioned Sampling at Epochs 1, 5, and 10</figcaption>
              <div>
                <Image
                  src={`${assetPrefix}/images/project-3/class-flow-samples-epoch-1.png`}
                  alt="Four class-conditioned samples for every MNIST digit after epoch 1"
                  width={1156}
                  height={496}
                  sizes="100vw"
                />
                <Image
                  src={`${assetPrefix}/images/project-3/class-flow-samples-epoch-5.png`}
                  alt="Four class-conditioned samples for every MNIST digit after epoch 5"
                  width={1156}
                  height={496}
                  sizes="100vw"
                />
                <Image
                  src={`${assetPrefix}/images/project-3/class-flow-samples-epoch-10.png`}
                  alt="Four class-conditioned samples for every MNIST digit after epoch 10"
                  width={1156}
                  height={496}
                  sizes="100vw"
                />
              </div>
            </figure>

            <section className="project-three-experiment" id="b2-6-no-scheduler">
              <header className="filter-subpart-heading">
                <h3>Getting rid of learning rate scheduler.</h3>
              </header>
              <div className="project-one-copy">
                <p>
                  A learning-rate scheduler adjusts the optimizer&apos;s learning rate during training,
                  typically reducing it over time as the model approaches convergence. I removed the
                  learning-rate scheduler to test whether a fixed learning rate could continue making
                  useful updates instead of shrinking the step size too early. Since the optimizer no
                  longer receives progressively smaller learning rates, I trained for more epochs—15
                  instead of 10—to give the model enough optimization steps to converge.
                </p>
                <p>
                  The new loss curve drops very sharply from its initial value above 4, quickly
                  reaching a small fraction of the starting loss. It then decreases smoothly across
                  the remaining 14,000 optimizer steps and settles near zero. The absence of large
                  spikes suggests that training remains stable without the scheduler, while the long,
                  gradually flattening tail shows diminishing but continued improvement from the
                  additional epochs. Compared with the previous loss curve that used a learning rate
                  scheduler, this loss curve shows that including more epochs removing the scheduler
                  could maintain a similar performance.
                </p>
              </div>
              <figure className="project-three-loss-figure">
                <figcaption>Training Loss without a Learning-Rate Scheduler</figcaption>
                <Image
                  src={`${assetPrefix}/images/project-3/class-conditioned-no-scheduler-training-loss.png`}
                  alt="Mean squared error training loss for the class-conditioned flow model without a learning-rate scheduler, falling sharply before gradually converging over 14,000 optimizer steps"
                  width={678}
                  height={278}
                  sizes="(max-width: 720px) 100vw, 55vw"
                />
              </figure>
            </section>
          </section>
        </section>
      </section>

      <footer className="report-footer">
        <Link href="/">← Return to project archive</Link>
        <span>Maixin Zhang / 2026</span>
      </footer>
    </main>
  );
}
