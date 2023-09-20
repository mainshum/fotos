import { PHOTOS_URL } from "@/lib/const";
import { useQuery } from "react-query";
import { Photo as P } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "@swan-io/chicane";
import { Router } from "@/lib/router";
import { LazyImage } from "./lazy-image";
import { match } from "ts-pattern";

function Loader() {
  return (
    <div className="center-absolute">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}

function Error() {
  return <div>Unexpected error occured</div>;
}

// photos are [600, 600];
export default function Photo({ photoId }: { photoId: string }) {
  const photoDetailsUrl = `${PHOTOS_URL}/${photoId}`;
  const query = useQuery({
    queryKey: ["PHOTO", photoId],
    queryFn: () =>
      fetch(photoDetailsUrl)
        .then((res) => res.json())
        .then(P.parse),
  });

  return match(query)
    .with({ status: "loading" }, { status: "idle" }, () => <Loader></Loader>)
    .with({ status: "error" }, () => <Error></Error>)
    .with({ status: "success" }, ({ data: { url, title, id } }) => (
      <div className="py-16">
        <article className="flex flex-col items-center gap-4">
          <LazyImage
            className="w- h-[600px]"
            width={600}
            height={600}
            src={url}
            alt={title}
          />
          <div>
            <span className="font-bold">ID</span>
            <h2>{id}</h2>
          </div>
          <div>
            <span className="font-bold">Title</span>
            <h2>{title}</h2>
          </div>

          <Button className="w-[150px]" asChild>
            <Link to={Router.Home()}>Galery</Link>
          </Button>
        </article>
      </div>
    ))
    .exhaustive();
}
