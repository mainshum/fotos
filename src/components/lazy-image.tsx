import { cn } from "@/lib/utils";
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

  const sizeClasses = `w-[${width}px] h-[${height}px]`;

  return (
    <div className="relative">
      {!isLoaded && <Skeleton className={cn(sizeClasses, "absolute")} />}
      <img
        {...rest}
        width={width}
        height={height}
        className={cn(className, sizeClasses)}
        src={src}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
