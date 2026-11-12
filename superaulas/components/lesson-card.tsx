"use client";
import Image from "next/image";
import { useState } from "react";
import { Download, Play, ArrowUpRight } from "lucide-react";
import { assetPath, pdfPath, type Lesson } from "@/lib/campaign";
export function LessonCard({ lesson }: { lesson: Lesson }) {
  const [playing, setPlaying] = useState(false);
  const videoId =
    lesson.youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(lesson.youtubeId)
      ? lesson.youtubeId
      : null;
  const pdf = pdfPath(lesson.pdf);
  return (
    <article
      className={`lesson-card ${lesson.theme}`}
      aria-label={`Superaula ${lesson.id}: ${lesson.title}`}
    >
      <div className="lesson-visual">
        {lesson.image && (
          <Image
            src={assetPath(lesson.image)}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
            className="artwork"
          />
        )}
        {playing && videoId ? (
          <iframe
            className="video"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            title={`Superaula ${lesson.id}: ${lesson.title}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <>
            <div className="lesson-copy">
              <span className="lesson-tag">
                AULA {lesson.id} — {lesson.topic}
              </span>
              <h3 id={`lesson-${lesson.id}`}>{lesson.title}</h3>
              <p>{lesson.description}</p>
            </div>
            <button
              className="play-button"
              disabled={!videoId}
              onClick={() => setPlaying(true)}
              aria-label={`Assistir à Superaula ${lesson.id}: ${lesson.title}`}
              aria-describedby={
                !videoId ? `video-pending-${lesson.id}` : undefined
              }
            >
              <Play size={28} fill="currentColor" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <div className="lesson-footer">
        <span id={`video-pending-${lesson.id}`}>
          {videoId ? "Pronto para dar o próximo passo?" : "Vídeo em breve"}
        </span>
        {pdf ? (
          <a href={pdf} download>
            <Download size={15} aria-hidden="true" /> Baixar material da aula{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        ) : (
          <button
            disabled
            aria-label={`PDF da Superaula ${lesson.id} indisponível`}
          >
            <Download size={15} aria-hidden="true" /> PDF em breve
          </button>
        )}
      </div>
    </article>
  );
}
