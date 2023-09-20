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

const GalPhoto = ({ photo }: { photo: z.infer<typeof Photo> }) => (
  <li
    data-photo-id={photo.id}
    onClick={() =>
      (document as any).startViewTransition(() =>
        Router.push("Photo", { photoId: photo.id.toString() })
      )
    }
    className="flex flex-col justify-start w-[150px]"
  >
    <LazyImage
      width={150}
      height={150}
      src={photo.thumbnailUrl}
      alt={photo.title}
    />
    <p className="truncate">{photo.title}</p>
  </li>
);

const photosAtOnce = 50;
const constTrue = () => true;

const filterPhotos = (phrase: string | null, photos: Photos | undefined) => {
  const filter = !phrase
    ? constTrue
    : (x: z.infer<typeof Photo>) => x.title.includes(phrase);

  return !photos ? [] : photos.filter(filter).slice(0, photosAtOnce);
};

export default function Galery() {
  const [value, setValue] = useState<string>("");

  const photoSearchDebounced = useDebounce<string>(value, 500);

  const [elRef] = useAutoAnimate();

  const photoSearch =
    photoSearchDebounced.length === 0 ? null : photoSearchDebounced;

  const query = useQuery("PHOTOS", getPhotos);

  const photos = filterPhotos(photoSearch, query.data);

  return (
    <div>
      <div className="py-8">
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
        />
      </div>
      <ul ref={elRef} className="grid justify-between grid-cols-auto-150px">
        {photos.length === 0 && (
          <h1 className="center-absolute">There is no photos to display</h1>
        )}
        {photos.map((p) => (
          <GalPhoto key={p.id} photo={p} />
        ))}
      </ul>
    </div>
  );
}
