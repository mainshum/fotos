import { Skeleton } from "./ui/skeleton";
import { useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  src: string;
}

export const LazyImage = ({
  src,
  width,
  height,
  className,
  ...rest
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && <Skeleton className="absolute w-full h-full" />}
      <img
        {...rest}
        width={width}
        height={height}
        className={className}
        src={src}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
