// should return 5000 photos

import { PHOTOS_URL } from "@/lib/const";
import { z } from "zod";

import { useQuery } from "react-query";
import { Input } from "./ui/input";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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

const Photo = z.object({
  id: z.number(),
  title: z.string(),
  thumbnailUrl: z.string(),
});

const Photos = z.array(Photo);

type Photo = z.infer<typeof Photo>;
type Photos = z.infer<typeof Photos>;

const getPhotos = () =>
  fetch(PHOTOS_URL)
    .then((x) => x.json())
    .then(Photos.parse);

const GalPhoto = ({ photo }: { photo: z.infer<typeof Photo> }) => (
  <div className="flex flex-col justify-start gap-">
    <img src={photo.thumbnailUrl} alt={photo.title}></img>
    <p className="truncate">{photo.title}</p>
  </div>
);

const photosAtOnce = 10;
const constTrue = () => true;

const filterPhotos = (phrase: string | null, photos: Photos | undefined) => {
  const filter = !phrase ? constTrue : (x: Photo) => x.title.includes(phrase);

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
      <section ref={elRef} className="flex flex-col gap-2">
        {photos.map((p) => (
          <GalPhoto key={p.id} photo={p} />
        ))}
      </section>
    </div>
  );
}
