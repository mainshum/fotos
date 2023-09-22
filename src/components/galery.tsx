// should return 5000 photos

import { FAV_ID_LOCAL_STORAGE, PHOTOS_URL } from "@/lib/const";
import { z } from "zod";

import { useQuery } from "react-query";
import { Input } from "./ui/input";

import { useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Router } from "@/lib/router";
import { Photo, Photos } from "@/lib/types";
import { LazyImage } from "./lazy-image";
import { match } from "ts-pattern";
import Loader from "./loader";
import Error from "./error";
import React from "react";
import { Star } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useDebounce } from "@/lib/hooks";

const getPhotos = () =>
  fetch(PHOTOS_URL)
    .then((x) => x.json())
    .then(Photos.parse);

interface GalPhotoProps extends React.HTMLAttributes<HTMLLIElement> {
  photo: FavPhoto;
  onFavToggle: (id: number) => void;
}

const FavIds = z.array(z.number());
type FavIds = z.infer<typeof FavIds>;

const GalPhoto = React.forwardRef<HTMLLIElement, GalPhotoProps>(
  ({ photo, onFavToggle, ...rest }: GalPhotoProps, ref) => (
    <li
      data-photo-id={photo.id}
      ref={ref}
      className="flex flex-col justify-start w-[150px]"
      {...rest}
    >
      <LazyImage
        width={150}
        className="cursor-pointer"
        height={150}
        src={photo.thumbnailUrl}
        alt={photo.title}
        onClick={() =>
          (document as any).startViewTransition(() =>
            Router.push("Photo", { photoId: photo.id.toString() })
          )
        }
      />
      <div className="flex justify-between items-center">
        <p className="truncate">{photo.title}</p>
        <Star
          data-testid="fav-star"
          fill={photo.isFav ? "gold" : "none"}
          onClick={() => onFavToggle(photo.id)}
          className="w-4 h-4 shrink-0 cursor-pointer"
        />
      </div>
    </li>
  )
);

const pageSize = 50;

const filterPhotosBySearch = (
  phrase: string | null,
  photos: FavPhoto[] | undefined
) => {
  const constTrue = () => true;
  const filter = !phrase
    ? constTrue
    : (x: z.infer<typeof Photo>) => x.title.includes(phrase);

  return !photos ? [] : photos.filter(filter);
};

const capPhotos = (pages: number, photos: FavPhoto[]): FavPhoto[] =>
  photos.slice(0, pages * pageSize);

// we use in-memory pagination, as the url endpoint returns way more photos than we
// really need and there's seemingly no way to control it

type FavPhoto = Photo & { isFav: boolean };

function usePhotos(photoSearch: null | string, filterFavourites: boolean) {
  const [pagesLoaded, setPagesLoaded] = useState(1);
  const [favs, setFavs] = useState<FavIds>(() => {
    try {
      return FavIds.parse(
        JSON.parse(localStorage.getItem(FAV_ID_LOCAL_STORAGE)!)
      );
    } catch (err) {
      console.error(err);
      // error proobably means that entry is messed up and so it's better to remove it
      localStorage.removeItem(FAV_ID_LOCAL_STORAGE);
    }
    return [];
  });

  const query = useQuery("photos", { queryFn: getPhotos, retry: false });

  const loadNextPage = () => setPagesLoaded((p) => p + 1);

  const toggleFav = (photoId: number) => {
    const newFavs = favs.includes(photoId)
      ? favs.filter((d) => d !== photoId)
      : favs.concat(photoId);

    setFavs(newFavs);

    localStorage.setItem(FAV_ID_LOCAL_STORAGE, JSON.stringify(newFavs));
  };

  const withFavs = useMemo((): FavPhoto[] | undefined => {
    if (!query.data) return undefined;

    return query.data.map((d) => ({ ...d, isFav: favs.includes(d.id) }));
  }, [query.data, favs]);

  const data = useMemo(() => {
    if (!withFavs) return undefined;

    const photos = filterPhotosBySearch(photoSearch, withFavs);

    const favOnly = !filterFavourites
      ? photos
      : photos.slice().filter((d) => d.isFav);

    const cappedPhotos = capPhotos(pagesLoaded, favOnly);

    return {
      photos: cappedPhotos,
      isExhausted: cappedPhotos.length === favOnly.length,
    };
  }, [withFavs, photoSearch, pagesLoaded, filterFavourites]);

  return { data, toggleFav, loadNextPage, query };
}

export default function Galery() {
  const [value, setValue] = useState<string>("");
  const [onlyFavs, setOnlyFavs] = useState<boolean>(false);

  const photoSearchDebounced = useDebounce<string>(value, 500);

  const [ulRef] = useAutoAnimate();

  const photoSearch =
    photoSearchDebounced.length === 0 ? null : photoSearchDebounced;

  const { query, loadNextPage, data, toggleFav } = usePhotos(
    photoSearch,
    onlyFavs
  );

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
      <div className="py-8 flex flex-col justify-between gap-4 sm:flex-row sm:gap-8">
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
        />
        <div className="flex items-center justify-end sm:justify-between gap-8">
          <Checkbox
            checked={onlyFavs}
            onCheckedChange={() => setOnlyFavs((d) => !d)}
            id="favs"
          />
          <label
            htmlFor="favs"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show only favourites
          </label>
        </div>
      </div>
      <ul ref={ulRef} className="grid justify-between grid-cols-auto-150px">
        {data && (
          <>
            {data.photos.length === 0 && (
              <h1 className="center-absolute">There is no photos to display</h1>
            )}
            {data.photos.map((p, ind) => (
              <GalPhoto
                onFavToggle={toggleFav}
                ref={(el) => {
                  if (ind !== data.photos.length - 1) return;

                  observer.current.disconnect();
                  if (data.isExhausted) return;
                  if (!el) return;

                  observer.current.observe(el);
                }}
                key={p.id}
                photo={p}
              />
            ))}
          </>
        )}
        {match(query)
          .with({ status: "success" }, () => null)
          .with({ status: "error" }, () => <Error />)
          .otherwise(() => (
            <Loader />
          ))}
      </ul>
    </div>
  );
}
