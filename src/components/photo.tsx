import { PHOTOS_URL } from "@/lib/const";
import { useQuery } from "react-query";
import { Photo as P } from "@/lib/types";
import { Button } from "./ui/button";
import { Link } from "@swan-io/chicane";
import { Router } from "@/lib/router";
import { LazyImage } from "./lazy-image";
import { match } from "ts-pattern";
import Error from "./error";
import Loader from "./loader";

// photos are [600, 600];
export default function Photo({ photoId }: { photoId: string }) {
  const photoDetailsUrl = `${PHOTOS_URL}/${photoId}`;
  const query = useQuery({
    queryKey: ["PHOTO", photoId],
    retry: false,
    queryFn: () =>
      fetch(photoDetailsUrl)
        .then((res) => res.json())
        .then(P.parse),
  });

  return match(query)
    .with({ status: "error" }, () => <Error />)
    .with({ status: "success" }, ({ data: { url, title, id } }) => (
      <div className="center-absolute flex flex-col gap-3">
        <Button className="text-2xl" asChild>
          <Link to={Router.Home()}>Go to galery</Link>
        </Button>
        <article className="relative">
          <LazyImage
            className="rounded-xl"
            width={600}
            height={600}
            src={url}
            alt={title}
          />
          <div className="absolute flex items-center justify-center w-[60px] h-[60px] top-5 right-5 rounded-full border-4 border-black">
            <h1 className="font-extrabold text-right tracking-tight text-5xl">
              {id}
            </h1>
          </div>
          <h1 className="absolute max-h-[27%] overflow-hidden bottom-5 right-5 w-full font-extrabold text-right tracking-tight text-2xl lg:text-5xl">
            {title}
          </h1>
        </article>
      </div>
    ))
    .otherwise(() => <Loader />);
}
