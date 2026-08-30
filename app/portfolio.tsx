import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    number: "00",
    title: "Becoming friends with your camera",
    href: "/projects/0",
  },
];

export default function Portfolio() {
  return (
    <main className="project-index" id="main-content">
      <div className="index-grid" aria-hidden="true" />
      <header className="index-header">
        <span>CS 180</span>
        <span>Computational photography</span>
        <span>Project archive</span>
      </header>

      <section className="index-title" aria-label="Project archive">
        <div className="index-intro">
          <h1>Maixin Zhang</h1>
          <p>Projects for CS180 — Intro to Computer Vision &amp; Computational Photography.</p>
        </div>
        <figure className="index-landscape">
          <Image
            src="https://picsum.photos/seed/california-landscape/1600/900"
            alt="Wooded landscape with a trail"
            fill
            priority
            sizes="(max-width: 720px) 75vw, 42vw"
          />
        </figure>
      </section>

      <h2 className="index-archive-title">Project Archive</h2>
      <div className="project-index-list">
        {projects.map((project) => (
          <Link className="project-index-item" href={project.href} key={project.href}>
            <article>
              <span className="index-number">{project.number}</span>
              <h1>{project.title}</h1>
              <span className="index-open" aria-hidden="true">↗</span>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
