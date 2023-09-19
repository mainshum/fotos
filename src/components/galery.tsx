// should return 5000 photos

import { PHOTOS_URL } from "@/lib/const";
import { z } from "zod";

import { useQuery } from "react-query";

const Photo = z.object({
  id: z.number(),
  title: z.string(),
  thumbnailUrl: z.string(),
});

const Photos = z.array(Photo);

type Photos = z.infer<typeof Photos>;

const getPhotos = () =>
  fetch(PHOTOS_URL)
    .then((x) => x.json())
    .then(Photos.parse);

const GalPhoto = ({ photo }: { photo: z.infer<typeof Photo> }) => (
  <div className="flex flex-col justify-start">
    <img src={photo.thumbnailUrl} alt={photo.title}></img>
    <p>{photo.title}</p>
  </div>
);

export default function Galery() {
  const query = useQuery("PHOTOS", getPhotos);

  return (
    <div>
      <h1 className="text-4xl">Fotos</h1>
      {query.data?.slice(0, 3).map((p) => (
        <GalPhoto key={p.id} photo={p} />
      ))}
    </div>
  );
}
