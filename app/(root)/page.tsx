import React from "react";

export default function Home() {
  return (
    <>
      <div className="bg-slate-800 min-h-screen p-8 space-y-12">
        <section
          id="hero"
          className="bg-gradient-to-b from-black/0 to-black/80 border border-black"
        >
          <div className="justify-start text-white text-8xl font-normal font-['Satoshi_Variable'] leading-[132px]">
            <span className="italic"> M./SPENCE </span>
          </div>
          <p className={"text-slate-200 text-sm "}>
            Discover my projects and get in touch!
          </p>
        </section>

        <section className="container mx-auto p-4">
          <div>
            <h2 className="text-cyan-800 font-black text-3xl">Who I am</h2>
            <p className="text-slate-200 text-sm">
              Web developer specializing in front end development. Open to try
              out new technologies and learn new skills. Currently working as a
              freelance developer open to collaborate with other teams. Drop me
              a line lets connect and build something fun.
            </p>
          </div>
        </section>

        <div>
          {/*Tools used */}
          <h2 className="text-cyan-800 font-black text-3xl">Tools I use</h2>
          <p>Primary Skills</p>
          <ul>
            <li>Next.js</li>
            <li>TypeScript</li>
            <li>Tailwindcss</li>
            <li>Supabase</li>
            <li>Figma</li>
          </ul>
          <p>Comfortable with</p>
          <ul>
            <li>React</li>
            <li>JavaScript</li>
            <li>CSS</li>
            <li>HTML</li>
            <li>Git/GitHub</li>
          </ul>
        </div>

        <div>
          {/* Add project cards here*/}
          <h2 className="text-cyan-800 font-black text-3xl">Works</h2>
          <p>Project cards will go here</p>
        </div>
      </div>
    </>
  );
}
