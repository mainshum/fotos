// should return 5000 photos

import { PHOTOS_URL } from "@/lib/const";
import { z } from "zod";

import { useQuery } from "react-query";
import { Input } from "./ui/input";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Router } from "@/lib/router";
import { Photo, Photos } from "@/lib/types";
import { LazyImage } from "./lazy-image";
import { match } from "ts-pattern";
import Loader from "./loader";
import Error from "./error";
import React from "react";

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

const getPhotos = () =>
  fetch(PHOTOS_URL)
    .then((x) => x.json())
    .then(Photos.parse);

interface GalPhotoProps extends React.HTMLAttributes<HTMLLIElement> {
  photo: z.infer<typeof Photo>;
}

const GalPhoto = React.forwardRef<HTMLLIElement, GalPhotoProps>(
  ({ photo, ...rest }: GalPhotoProps, ref) => (
    <li
      data-photo-id={photo.id}
      ref={ref}
      onClick={() =>
        (document as any).startViewTransition(() =>
          Router.push("Photo", { photoId: photo.id.toString() })
        )
      }
      className="flex flex-col justify-start w-[150px]"
      {...rest}
    >
      <LazyImage
        width={150}
        height={150}
        src={photo.thumbnailUrl}
        alt={photo.title}
      />
      <p className="truncate">{photo.title}</p>
    </li>
  )
);

const pageSize = 50;
const constTrue = () => true;

const filterPhotosBySearch = (
  phrase: string | null,
  photos: Photos | undefined
) => {
  const filter = !phrase
    ? constTrue
    : (x: z.infer<typeof Photo>) => x.title.includes(phrase);

  return !photos ? [] : photos.filter(filter);
};

const capPhotos = (pages: number, photos: Photos): Photos =>
  photos.slice(0, pages * pageSize);

// we use in-memory pagination, as the url endpoint returns way more photos than we
// really need and there's seemingly no way to control it

function usePhotos(photoSearch: null | string) {
  const [pagesLoaded, setPagesLoaded] = useState(1);

  const query = useQuery("photos", getPhotos);

  const loadNextPage = () => setPagesLoaded((p) => p + 1);

  let photos = filterPhotosBySearch(photoSearch, query.data);

  photos = capPhotos(pagesLoaded, photos);

  if (query.data) query.data = photos;

  return { query, loadNextPage };
}

export default function Galery() {
  const lastPhotoRef = React.useRef<HTMLLIElement>(null);
  const [value, setValue] = useState<string>("");

  const photoSearchDebounced = useDebounce<string>(value, 500);

  const [ulRef] = useAutoAnimate();

  const photoSearch =
    photoSearchDebounced.length === 0 ? null : photoSearchDebounced;

  const { query, loadNextPage } = usePhotos(photoSearch);

  const observer = React.useRef(
    new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) loadNextPage();
      },
      {
        threshold: 0.9,
      }
    )
  );

  return (
    <div>
      <div className="py-8">
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
        />
      </div>
      <ul ref={ulRef} className="grid justify-between grid-cols-auto-150px">
        {match(query)
          .with({ status: "success" }, ({ data }) => (
            <>
              {data.length === 0 && (
                <h1 className="center-absolute">
                  There is no photos to display
                </h1>
              )}
              {data.map((p, ind) =>
                ind === data.length - 1 ? (
                  <GalPhoto
                    ref={(el) => {
                      observer.current.disconnect();

                      if (!el) return;

                      observer.current.observe(el);
                    }}
                    key={p.id}
                    photo={p}
                  />
                ) : (
                  <GalPhoto key={p.id} photo={p} />
                )
              )}
            </>
          ))
          .with({ status: "error" }, () => <Error />)
          .otherwise(() => (
            <Loader />
          ))}
        <button onClick={loadNextPage}>load next page</button>
      </ul>
    </div>
  );
}
